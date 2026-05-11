import express from 'express';
import child_process from 'child_process';
import util from 'util';
import fs from "fs/promises"
import { v4 as uuidv4 } from "uuid";

const execPromisified = util.promisify(child_process.exec);
export const createProjectController = async (req: express.Request, res: express.Response) => {

    const projectId = uuidv4();
    console.log('New Project Id is', projectId);

    await fs.mkdir(`./projects/${projectId}`);

    const response = await execPromisified('npm create vite@latest sandbox -- --template react', {
        cwd: `./projects/${projectId}`
    });

    res.json({
        success: true,
        message: 'Project created successfully',
        projectId: projectId
    });

};