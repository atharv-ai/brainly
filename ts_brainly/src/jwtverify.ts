import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || "secretPassword";

export function tokencreate(userId: mongoose.Types.ObjectId){
    return jwt.sign({userId}, JWT_SECRET);
}

export function auth(req: Request, res: Response, next: NextFunction){
    const rawHeader = req.headers.authorization;
    if (!rawHeader) {
        return res.status(401).json({
            message: "Token missing"
        });
    }

    const token = rawHeader.startsWith("Bearer ") ? rawHeader.split(" ")[1] : rawHeader;
    if (!token) {
        return res.status(401).json({
            message: "Token missing"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as { userId: string };
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}