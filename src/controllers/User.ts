import { IUserRequest } from "../interfaces/User";
import { Request, Response } from "express";
import { verifyUserService } from "../services/User";

export const verifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ message: 'El id del usuario es obligatorio' });
            return;
        }
        const result = await verifyUserService(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
