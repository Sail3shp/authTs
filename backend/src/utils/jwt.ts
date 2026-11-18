import type { SignOptions, VerifyOptions } from "jsonwebtoken";
import type { SessionDocument } from "../model/session.model.js"
import type { UserDocument } from "../model/user.model.js";
import jwt from 'jsonwebtoken'
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";

export type RefreshTokenPayload = {
    sessionId: SessionDocument["_id"];
};

export type AccessTokenPayload = {
    userId: UserDocument['_id'],
    sessionId: SessionDocument['_id']
}

export type SignOptionsAndSecret = SignOptions & {
    secret: string
}
const defaults: SignOptions = {
    audience: ['user'],
}
export const accessTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: '15m',
    secret: JWT_SECRET,
}

export const refreshTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: '30d',
    secret: JWT_REFRESH_SECRET,
}

export const signToken = (payload: (RefreshTokenPayload | AccessTokenPayload), options?: SignOptionsAndSecret
) => {
    const { secret, ...signOpts } = options || accessTokenSignOptions
    return jwt.sign(payload, secret, {
        ...defaults,
        ...signOpts,
    })
}


export const verifyToken = <TPayload extends object = AccessTokenPayload>(token: string, options?: VerifyOptions & { secret: string }) => {
    const { secret = JWT_SECRET, ...verifyOpts } = options || {}

    try {
        const payload = jwt.verify(
            token, secret, {
            audience: ['user'],
            ...verifyOpts
        }) as TPayload
        return { payload };
    } catch (error: any) {
        return {
            error: error.message,
        }
    }
}