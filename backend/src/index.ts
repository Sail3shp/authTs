import "dotenv/config"
import express from 'express'
import connectToDatabase from './config/db.js'
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env.js"
import cors from 'cors'
import cookieParser from "cookie-parser"
import errorHandler from "./middleware/errorHandler.js"
import catchErrors from "./utils/catchErrors.js"
import { OK } from "./constants/http.js"
import authRoutes from "./routes/auth.routes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: APP_ORIGIN,
    credentials: true,
}))

app.use(cookieParser())

app.get('/health',
    catchErrors(async(req,res) => {
    return res.status(OK).json({
        status: 'healthy'
    })
}))

app.use('/auth',authRoutes)

app.use(errorHandler)

app.listen(PORT,async()=>{
    console.log(`server is running in  ${NODE_ENV} mode in port ${PORT}`)
    await connectToDatabase()
})
