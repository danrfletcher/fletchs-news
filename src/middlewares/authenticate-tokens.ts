import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): Promise<never> | void => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return Promise.reject({status: 401, message: 'Authorization token missing from request'})
    } else {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
        jwt.verify(token, accessTokenSecret, (err, user): Promise<never> | void => {
            if (err) {
                return Promise.reject({status: 403, msg: 'User token is invalid'})
            } else {
                req.user = user;
                next()
            }
        })
    }
}
