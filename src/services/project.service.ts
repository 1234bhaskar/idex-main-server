import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import { execPromisified } from "../utils/execUtility";
import path from 'path';
import directoryTree from 'directory-tree';

const PROJECTS_DIR = path.resolve('./projects');

const validatePath = (projectId: string, relativePath: string): string => {
    const projectPath = path.join(PROJECTS_DIR, projectId);
    const fullPath = path.resolve(projectPath, relativePath);

    if (!fullPath.startsWith(projectPath)) {
        throw new Error('Access denied: Path outside of project directory');
    }

    return fullPath;
};

export const createProjectService = async (): Promise<string> => {
    const projectId = uuidv4();
    const projectPath = path.join(PROJECTS_DIR, projectId);
    await fs.mkdir(projectPath, { recursive: true });

    await execPromisified('npm create vite@latest sandbox -- --template react', {
        cwd: projectPath
    });

    return projectId;
}

export const getProjectTreeService = async (projectId: string) => {
    const projectPath = validatePath(projectId, '');
    const tree = directoryTree(projectPath);
    return tree;
}

export const createFileService = async (projectId: string, relativePath: string): Promise<void> => {
    const fullPath = validatePath(projectId, relativePath);
    await fs.writeFile(fullPath, '');
}

export const createFolderService = async (projectId: string, relativePath: string): Promise<void> => {
    const fullPath = validatePath(projectId, relativePath);
    await fs.mkdir(fullPath, { recursive: true });
}

export const deleteFileOrFolderService = async (projectId: string, relativePath: string): Promise<void> => {
    const fullPath = validatePath(projectId, relativePath);
    await fs.rm(fullPath, { recursive: true, force: true });
}

export const writeFileService = async (projectId: string, relativePath: string, content: string): Promise<void> => {
    const fullPath = validatePath(projectId, relativePath);
    await fs.writeFile(fullPath, content);
}

export const readFileService = async (projectId: string, relativePath: string): Promise<string> => {
    const fullPath = validatePath(projectId, relativePath);
    const response = (await fs.readFile(fullPath, "utf-8"));
    return response;
}
