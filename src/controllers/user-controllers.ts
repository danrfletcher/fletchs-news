import { selectUser, selectUsers } from "../models/user-models";
import { Request, Response, NextFunction } from "express";

export const getUsers = (req: Request, res: Response, next: NextFunction): void => {
    selectUsers().then((users: any) => res.status(200).send({users}));
};

export const getUser = (req: Request, res: Response, next: NextFunction): void => {
    const { username } = req.params;
    selectUser(username).then((user: any) => {
        res.status(200).send({user})
    })
    .catch(next)
};

export const postUser = (req: Request, res: Response, next: NextFunction): void => {
    console.log("Hi from user controller")
}