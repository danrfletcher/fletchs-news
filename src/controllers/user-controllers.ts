const { selectUser, selectUsers, createUser, checkUsername, authenticateUser, selectUserDiscreetly } = require("../models/user-models");
import { saveRefreshToken, getLatestUserRefreshTokenId, removeRefreshToken, removeAllRefreshTokens } from '../models/token-models'
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const getUsers = (req: Request, res: Response, next: NextFunction): void => {
    selectUsers().then((users: any) => res.status(200).send({users}));
};

export const getUser = (req: Request, res: Response, next: NextFunction): void => {
    const { username } = req.params;
    selectUser(username).then((user: any) => {
        res.status(200).send({
            user: {
                username: user.username,
                name: user.name,
                avatar_url: user.avatar_url
            }
        })
    })
    .catch(next)
};

export const postUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const usernameAvailable = await checkUsername(req.body.username)
        if (usernameAvailable) {
            const user = await createUser(req.body)
            res.status(201).send({
                user: {
                    username: user.username,
                    name: user.name,
                    avatar_url: user.avatar_url
                }
            })
        } else {
            res.status(500).send({msg: "internal server error"})
        }
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validation = await selectUserDiscreetly(req.body.username)
        const authentication = await authenticateUser(req.body,validation.password)
        if (authentication) {
            const { username } = req.body;

            const tokenId = await getLatestUserRefreshTokenId(username);

            const user = {name: username, refresh_token_id: tokenId}
            
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
            const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
            
            const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '30m' });
            const refreshToken = jwt.sign(user, refreshTokenSecret)
            
            const save = await saveRefreshToken(username, refreshToken, tokenId)

            const env = process.env.NODE_ENV

            res.status(200)
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: env === 'development' || env === 'test' ? false : true, 
                sameSite: env === 'development' || env === 'test' ? 'lax' : 'none', 
                expires: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
            })
            .send({accessToken: accessToken})
        } else {
            res.status(500).send({msg: "internal server error"})
        }
    } catch (err) {
        next(err);
    }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //Delete refresh token from db
        const auth = req.headers.authorization as string;
        const revokeRefresh = await removeRefreshToken(auth)
    
        //Send 204 if successfully deleted.
        res.status(204).send()
    } catch (err) {
        next(err);
    }
}

export const logoutAllUserInstances = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //Delete all refresh tokens from db
        const auth = req.headers.authorization as string;
        const revokeRefresh = await removeAllRefreshTokens(auth)
    
        //Send 204 if successfully deleted.
        res.status(204).send()
    } catch (err) {
        next(err);
    }
};