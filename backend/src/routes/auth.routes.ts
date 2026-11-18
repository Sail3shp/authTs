import { Router } from "express";
import { loginHandler, registerHandler } from "../controller/auth.controller.js";


const authRoutes = Router()

authRoutes.post('/register',registerHandler)
authRoutes.post('/login',loginHandler)

export default authRoutes