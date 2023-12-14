const { selectUser, selectUsers, createUser, checkUsername, authenticateUser, selectUserDiscreetly } = require("../models/user-models");
import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

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
            const user = {name: username}

            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
            const accessToken = jwt.sign(user, accessTokenSecret)

            res.status(200).send({accessToken})
        } else {
            res.status(500).send({msg: "internal server error"})
        }
    } catch (err) {
        next(err);
    }
}