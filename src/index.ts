import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'node:http';
import { config } from './config';
import routes from './routes';
import { Server } from 'socket.io';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { handleEditorSocketEvents } from './socket/editorHandler';
import chokidar from 'chokidar';
const app = express();

app.use(helmet());
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    handleEditorSocketEvents(io, socket);

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});



// API routes
app.use('/api', routes);


const editorNamespace = io.of('/editor');
editorNamespace.on('connection', (socket) => {
    console.log("editor connected");

    let projectID: string | null = "123";

    if (projectID) {
        //watch
        var watcher = chokidar.watch(`./projects/${projectID}/`, {
            //ignore node_modules and .git folders
            ignored: (path) => path.includes('node_modules'),
            persistent: true,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
            },
            ignoreInitial: true,
        });

        watcher.on('all', (path) => {
            console.log(`File changed: ${path}`);
            socket.emit('fileChanged', { path });
        });

    }


    handleEditorSocketEvents(io, socket);


    socket.on('disconnect', async () => {
        await watcher?.close();
        console.log("editor disconnected");
    });
});
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
    try {
        server.listen(config.port, '0.0.0.0', () => {
            console.log(`Main Server running on port ${config.port}`);
            console.log(`Environment: ${config.nodeEnv}`);
            console.log(`Health check: http://localhost:${config.port}/api/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
