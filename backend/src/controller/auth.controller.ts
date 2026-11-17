import {z} from 'zod'
import catchErrors from "../utils/catchErrors.js";
import { createAccount } from '../services/auth.service.js';
import { CREATED } from '../constants/http.js';
import { setAuthCookies } from '../utils/cookies.js';

const registerSchema = z.object({
    email: z.email().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional()
}).refine(
    (data)=> data.password === data.confirmPassword,
    {
        error:'passwords do not match'
    }
)
export const registerHandler = catchErrors(async(req,res)=>{
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    })

    const {userAgent,confirmPassword,...rest} = request

    const {user,accessToken,refreshToken} = await createAccount({...rest,...(userAgent !== undefined && { userAgent })})
//here setAuthCookies return type Response of express so we can chain .status


    return setAuthCookies({res,refreshToken,accessToken}).status(CREATED).json(user)

})