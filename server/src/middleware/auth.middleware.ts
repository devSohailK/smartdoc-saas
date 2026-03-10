import { NextFunction } from "express"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        req.userId = decoded.id;
        next();

    }catch{
        res.status(401).json({message : 'invalid or expired token'})
    }
}


