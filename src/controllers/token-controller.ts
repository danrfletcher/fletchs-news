import { Request, Response, NextFunction } from "express";
import { authenticateRefreshToken } from "../models/token-models";
import jwt from 'jsonwebtoken';

export const getToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        //Validate refresh token
        const validRefreshToken = await authenticateRefreshToken(refreshToken)
        if (validRefreshToken) {
            
            //Get new token if refresh token is valid
            const { username, refresh_token_id } = validRefreshToken;
            const user = {name: username, refresh_token_id: refresh_token_id}
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
            const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '30m' });

            //Send token to client
            res.status(200).send({accessToken})
        }
    } catch (err) {
        next(err);
    }
}