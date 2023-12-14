const { selectUser, selectUsers, createUser, checkUsername } = require("../models/user-models");
import { Request, Response, NextFunction } from "express";

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
            console.log("HI")
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

export const loginUser = async () => {}