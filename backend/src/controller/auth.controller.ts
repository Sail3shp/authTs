import { z } from 'zod'
import catchErrors from "../utils/catchErrors.js";
import { createAccount, loginUser } from '../services/auth.service.js';
import { CREATED, OK } from '../constants/http.js';
import { clearAuthCookie, setAuthCookies } from '../utils/cookies.js';
import { loginSchema, registerSchema } from './auth.schema.js';
import { verifyToken } from '../utils/jwt.js';
import SessionModel from '../model/session.model.js';




export const registerHandler = catchErrors(async (req, res) => {
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    })

    const { userAgent, confirmPassword, ...rest } = request

    const { user, accessToken, refreshToken } = await createAccount({ ...rest, ...(userAgent !== undefined && { userAgent }) })
    //here setAuthCookies return type Response of express so we can chain .status


    return setAuthCookies({ res, refreshToken, accessToken }).status(CREATED).json(user)

})

export const loginHandler = catchErrors(async (req, res) => {
    const request = loginSchema.parse({...req.body,
        userAgent: req.headers['user-agent']
    })

    const {userAgent,...rest} = request

    const {accessToken,refreshToken} = await loginUser({ ...rest, ...(userAgent !== undefined && { userAgent })})

    return setAuthCookies({res,refreshToken,accessToken}).status(OK).json({
        message:'Login Successful'
    })

})

export const logoutHandler = catchErrors(async(req,res) => {
    const accessToken = req.cookies.accessToken;
    const {payload,error} = verifyToken(accessToken)

    if(payload){
        await SessionModel.findByIdAndDelete(payload.sessionId)
    }

    return clearAuthCookie(res).status(OK).json({
        message:'Logout successful'
    })

})