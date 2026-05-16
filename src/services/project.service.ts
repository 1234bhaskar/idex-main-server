import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import { execPromisified } from "../utils/execUtility";
import path from 'path';
import directoryTree from 'directory-tree';

export const createProjectService = async (): Promise<string> => {
    const projectId = uuidv4();
    await fs.mkdir(`./projects/${projectId}`);

    await execPromisified('npm create vite@latest sandbox -- --template react', {
        cwd: `./projects/${projectId}`
    });

    return projectId;
}

export const getProjectTreeService = async (projectId: string) => {
    const projectPath = path.resolve(`./projects/${projectId}`);
    const tree = directoryTree(projectPath);
    return tree;
}
