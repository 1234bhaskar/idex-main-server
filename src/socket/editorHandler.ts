import { Server, Socket } from 'socket.io';
import * as projectService from '../services/project.service';
import { FileOperationPayload, SOCKET_EVENTS, SocketResponse } from '../types/socket';

export const handleEditorSocketEvents = (io: Server, socket: Socket) => {

    socket.on(SOCKET_EVENTS.FILE_CREATE, async (payload: FileOperationPayload, callback: (res: SocketResponse) => void) => {
        try {
            await projectService.createFileService(payload.projectId, payload.path);
            callback({ success: true });
        } catch (error: any) {
            callback({ success: false, error: error.message });
        }
    });

    socket.on(SOCKET_EVENTS.FOLDER_CREATE, async (payload: FileOperationPayload, callback: (res: SocketResponse) => void) => {
        try {
            await projectService.createFolderService(payload.projectId, payload.path);
            callback({ success: true });
        } catch (error: any) {
            callback({ success: false, error: error.message });
        }
    });

    socket.on(SOCKET_EVENTS.FILE_DELETE, async (payload: FileOperationPayload, callback: (res: SocketResponse) => void) => {
        try {
            await projectService.deleteFileOrFolderService(payload.projectId, payload.path);
            callback({ success: true });
        } catch (error: any) {
            callback({ success: false, error: error.message });
        }
    });

    socket.on(SOCKET_EVENTS.FILE_WRITE, async (payload: FileOperationPayload, callback: (res: SocketResponse) => void) => {
        try {
            await projectService.writeFileService(payload.projectId, payload.path, payload.content || '');
            callback({ success: true });
        } catch (error: any) {
            callback({ success: false, error: error.message });
        }
    });

    socket.on(SOCKET_EVENTS.FILE_READ, async (payload: FileOperationPayload, callback: (res: SocketResponse<string>) => void) => {
        try {
            const content = await projectService.readFileService(payload.projectId, payload.path);
            // callback({ success: true, data: content });
            socket.emit("readFileSuccess", { path: payload.path, data: content });
        } catch (error: any) {
            callback({ success: false, error: error.message });
        }
    });
};
