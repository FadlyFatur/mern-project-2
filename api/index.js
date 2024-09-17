import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB Server!');
    }).catch((err) => {
        console.log(err);
});

const app = express();
app.use(express.json());
app.use(cookieParser());


// ROUTE 
app.get('/', (req, res) => {
    res.status(200).json({
        statusCode:200,
        message: 'API is Connected!',
    });
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.log(err.statusCode, err.message);
    return res.status(statusCode).json({
        success: false,
        message,
    });
});

app.listen(3000, ()=>{
    console.log('Server listen on port 3000!!');
});