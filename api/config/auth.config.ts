import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Replace with a strong, random secret in production

export const hash_pass = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    return hashed;
}

export const compare_pass = (password: string, hashed: string) => {
    return bcrypt.compareSync(password, hashed);
}

interface JwtPayload extends Object {
    [key: string]: any;
}

export const generateToken = (payload: JwtPayload, expiresIn: any = "1h") => {
    const options: SignOptions = { expiresIn: expiresIn };
    return jwt.sign(payload, JWT_SECRET as string, options);
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export { JWT_SECRET };
