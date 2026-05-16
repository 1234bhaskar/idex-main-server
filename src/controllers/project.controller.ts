import express from 'express';
import { Request, Response } from 'express';
import { createProjectService, getProjectTreeService } from '../services/project.service';


export const createProjectController = async (req: Request, res: Response) => {
    const projectId = await createProjectService();
    res.json({
        success: true,
        message: 'Project created successfully',
        data: projectId
    });
};


export const getProjectTreeController = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const tree = await getProjectTreeService(projectId);

    return res.json({
        success: true,
        message: 'Project tree fetched successfully',
        data: tree
    });
}
