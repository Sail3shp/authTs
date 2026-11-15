import "dotenv/config"
import express from 'express'
import connectToDatabase from './config/db.js'
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env.js"
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: APP_ORIGIN,
    credentials: true,
}))

app.use(cookieParser())

app.get('/health',(req,res) => {
    return res.status(200).json({
        status: 'healthy'
    })
})

app.listen(7777,async()=>{
    console.log(`server is running in  ${NODE_ENV} mode in port ${PORT}`)
    await connectToDatabase()
})
