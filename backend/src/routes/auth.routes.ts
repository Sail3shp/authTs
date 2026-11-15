import { Router } from "express";
import { registerHandler } from "../controller/auth.controller.js";


const authRoutes = Router()

authRoutes.post('/register',registerHandler)

export default authRoutes