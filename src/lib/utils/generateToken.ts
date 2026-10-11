import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
	throw new Error('JWT_SECRET environment variable is not defined');
}

type TokenPayload = {
	userId: string;
	email: string;
	role: 'ADMIN' | 'USER';
};

export function generateToken(payload: TokenPayload) {
	const secret = process.env.JWT_SECRET as string;
	return jwt.sign(payload, secret, { expiresIn: '1h' });
}
