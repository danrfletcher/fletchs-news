const db = require('../db/connection.js');
const format = require('pg-format');
const argon2 = require('argon2');
import jwt from 'jsonwebtoken';

export const saveRefreshToken = async (username: string, refreshToken: string, tokenId: number) => {
    try {
        if (!username || ! refreshToken) return Promise.reject({status: 400, msg: "bad request"});
        
        const hashedToken: string = await argon2.hash(refreshToken)

        const tokenInserted = await db.query(format(`INSERT INTO refresh_tokens (username, refresh_token, user_refresh_token_id) VALUES (%L, %L, %L) RETURNING *;`, username, hashedToken, tokenId));

        return tokenInserted.rows[0];

    } catch (err) {
        throw err;
    }
}

export const getLatestUserRefreshTokenId = async (username: string) => {
    try {
        if (!username) return Promise.reject({status: 400, msg: "bad request"});
        const userTokenIds = await db.query(`SELECT user_refresh_token_id FROM refresh_tokens WHERE username = $1;`, [username])

        let tokenId;
        if (userTokenIds.rows.length === 0) {
            tokenId = 1;
        } else {
            interface TokenID {
                user_refresh_token_id: number;
            }
            const tokenIdValues = userTokenIds.rows.map((tokenId: TokenID) => tokenId.user_refresh_token_id)
            tokenId = Math.max(...tokenIdValues) + 1;
        }
        return tokenId;
    } catch (err) {
        throw err;
    }
}

export const authenticateRefreshToken = async (refreshToken: string) => {
    try {
        if (!refreshToken) return Promise.reject({status: 401, msg: "unauthorized access"});
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string;

        interface TokenPayload {
            name: string;
            iat: number;
            refresh_token_id: number;
        }

        const decodedRefreshToken = jwt.verify(refreshToken, refreshSecret) as TokenPayload;
        const { name, refresh_token_id } = decodedRefreshToken;
        if (!name || !refresh_token_id) return Promise.reject({status:401, msg: "unauthorized access"});
        
        const validateTokenExists = await getSpecifiedRefreshToken(name, refresh_token_id);
        if (validateTokenExists) {
            const validHash = await argon2.verify(validateTokenExists.refresh_token, refreshToken)
            if (validHash) {
                return {username: name, refresh_token_id: refresh_token_id}
            } else {
                return Promise.reject({status:401, msg: "unauthorized access"});
            }
        } else {
            return Promise.reject({status: 500, msg: "internal server error"});
        }
        
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return Promise.reject({ status: 401, msg: "unauthorized access" });
        } else {
            throw err
        }
    }
}

export const getSpecifiedRefreshToken = async (username: string, id: number) => {
    try {
        if (!username || !id) return Promise.reject({status:401, msg: "unauthorized access"});
        const token = await db.query(`SELECT username, refresh_token, user_refresh_token_id FROM refresh_tokens WHERE username = $1 AND user_refresh_token_id = $2`, [username, id])
        return token.rows[0] ? token.rows[0] : Promise.reject({status:403, msg: "forbidden"});
    } catch (err) {
        throw err
    }
}