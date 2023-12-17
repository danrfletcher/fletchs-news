import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";


// Allow authenticated user to be placed on request
interface CustomJwt extends JwtPayload {
    name?: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: CustomJwt;
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): Promise<never> | void => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    const error = new Error('Authorization token missing from request');
    //@ts-ignore
    error.status = 401;
    if (!token) {
        return next(error);
    } else {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
        jwt.verify(token, accessTokenSecret, (err, user): Promise<never> | void => {
            if (err) {
                next(error)
            } else {
                req.user = user as CustomJwt;
                next()
            }
        })
    }
}
