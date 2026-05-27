export interface FileOperationPayload {
    projectId: string;
    path: string;
    content?: string;
}

export interface SocketResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export const SOCKET_EVENTS = {
    FILE_CREATE: 'file:create',
    FOLDER_CREATE: 'folder:create',
    FILE_DELETE: 'file:delete',
    FILE_WRITE: 'file:write',
    FILE_READ: 'file:read',
    ERROR: 'error',
} as const;
