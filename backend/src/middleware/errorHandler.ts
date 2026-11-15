import type { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http.js";
import { z } from "zod";

const handleZodError = (res: Response, err: z.ZodError) => {
    const errors = err.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
    }))
    return res.status(BAD_REQUEST).json({
        message: err.message,
        errors
    })

}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(`PATH: ${req.path}`, err);

    if (err instanceof z.ZodError) {
        return handleZodError(res, err)

    }
    return res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error")
}

export default errorHandler