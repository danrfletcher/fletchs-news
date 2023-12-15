import { JwtPayload } from "jsonwebtoken";

// Allow authenticated user to be placed on request
declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload | String;
    }
}