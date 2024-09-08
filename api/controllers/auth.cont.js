import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const    test = (req, res) => {
    res.status(200).json({
        statusCode:200,
        message: "API auth is connected!"
    });
};

export const signUp = async (req, res, next) => {
    console.log(req.body);

    const { username, email, password } = req.body;
    const hashPass = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password:hashPass });

    try {
        const resUser = await newUser.save()
        res.status(201).json({message : "Success created user!", data: resUser});
    } catch (err) {
        console.log(err.message);
        // res.status(500).json({message : err.message});
        next(err);
    };
};