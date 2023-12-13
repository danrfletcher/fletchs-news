const argon2 = require('argon2');

export const hash = async (password: String): Promise<string> => {
    try {
        const hashedPass = await argon2.hash(password);
        return hashedPass
    } catch (err) {
        return err
    }
}