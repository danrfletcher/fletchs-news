import { Request, Response, NextFunction } from "express";
import { authenticateRefreshToken } from "../models/token-models";
import jwt from 'jsonwebtoken';
import { selectUser } from "../models/user-models";

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
};

export const getUserFromToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (req.user) {
            const user = await selectUser(req.user.name)
            delete user.password
            res.status(200).send({user})
        }
        else {
            res.status(401).send({msg: "unauthorized access"})
        }
    } catch (err) {
        next(err);
    }
}