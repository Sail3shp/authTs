import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";
import { CONFLICT, UNAUTHORIZED } from "../constants/http.js";
import VerificationCodeType from "../constants/verificationCodeType.js";
import SessionModel from "../model/session.model.js";
import UserModel from "../model/user.model.js";
import VerificationCodeModel from "../model/verification.model.js";
import appAssert from "../utils/appAssert.js";
import { oneYearFromNow } from "../utils/date.js";
import jwt from 'jsonwebtoken'
import { accessTokenSignOptions, refreshTokenSignOptions, signToken } from "../utils/jwt.js";

export type CreateAccountParams = {
    email: string;
    password: string;
    userAgent?: string;
}


export const createAccount = async (data: CreateAccountParams) => {
    const existingUser = await UserModel.exists({
        email: data.email
    })

    appAssert(!existingUser,CONFLICT,'Email already in use')

    /*if (existingUser) {
        throw new Error("User already exists")
    }*/

    const user = await UserModel.create({
        email: data.email,
        password: data.password,
    })

    const verificationCode = await VerificationCodeModel.create({
        userId: user._id,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow()
    })

    const session = await SessionModel.create({
        userId: user._id,
        ...(data.userAgent !== undefined && {
            userAgent: data.userAgent,
        })
    })

    const refreshToken = signToken(
        {
            sessionId: session._id
        },
        refreshTokenSignOptions
    )

    const accessToken = signToken(
        {
            sessionId: session._id,
            userId: user._id,
        },
    )

    return {
        user,
        accessToken,
        refreshToken
    }
}

export const loginUser = async(data:CreateAccountParams) => {
    const user = await UserModel.findOne({email:data.email})

    appAssert(user,UNAUTHORIZED,'Invalid email or password');

    const isValid = await user.comparePassword(data.password)
    console.log(data.password,isValid)

    appAssert(isValid,UNAUTHORIZED,'Invalid eamil or password')

    const session = await SessionModel.create({
        userId: user._id,
        ...(data.userAgent !== undefined && {
            userAgent: data.userAgent,
        })
    })

    const refreshToken = signToken(
        {
            sessionId: session._id
        },
        refreshTokenSignOptions
    )

    const accessToken = signToken(
        {
            sessionId: session._id,
            userId: user._id,
        },
        accessTokenSignOptions
    )
    console.log(user,'is here')

    return {
        user,
        refreshToken,
        accessToken
    }
}