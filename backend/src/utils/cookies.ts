import type { CookieOptions, Response } from "express"
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date.js";

type Params = {
    res: Response,
    accessToken:string,
    refreshToken:string,
}

const secure = process.env.NODE_ENV !== 'development';

const defaults:CookieOptions = {
    sameSite:"strict",
    httpOnly:true,
    secure
}

const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow()
})

const getRefreshTokenCookieOptions = ():CookieOptions => ({
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: '/auth/refresh'
})

export const setAuthCookies = ({res,refreshToken,accessToken}:Params) => {
    return res.cookie('accessToken',accessToken,getAccessTokenCookieOptions()).cookie('refreshToken',refreshToken,getRefreshTokenCookieOptions())

}