import mongoose from "mongoose"
import { MONGO_URI } from "../constants/env.js"

const connectToDatabase = async() => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("db connected")
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

export default connectToDatabase