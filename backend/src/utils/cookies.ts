import type { CookieOptions, Response } from "express"
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date.js";

type Params = {
    res: Response,
    accessToken:string,
    refreshToken:string,
}
export const REFRESH_PATH = '/auth/refresh'
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
    path: REFRESH_PATH 
})

export const setAuthCookies = ({res,refreshToken,accessToken}:Params) => {
    return res.cookie('accessToken',accessToken,getAccessTokenCookieOptions()).cookie('refreshToken',refreshToken,getRefreshTokenCookieOptions())

}

export const clearAuthCookie = (res:Response) => {
    return res.clearCookie('accessToken').clearCookie('refreshToken',{path:REFRESH_PATH})
}