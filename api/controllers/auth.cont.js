import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import  jwt  from "jsonwebtoken";

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
        next(err);
    };
};

export const signIn = async (req, res, next) => {
    console.log(req.body);

    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({email});
        if (!validUser) return next(errorHandler(401, "Wrong crendentials"));
        //crypt and compare
        const comparePass = bcryptjs.compareSync(password,validUser.password);
        if(comparePass === false) return next(errorHandler(401, "Wrong crendentials"));
        //jwt sign
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password: hashPass, ...data} = validUser._doc;
        const expiredDate = new Date(Date.now() + parseInt(process.env.EXPIREDDATECOOKIE));
        res.cookie('access_token', token, { 
                httpOnly:true, 
                expires: expiredDate
            })
            .status(201) 
            .json(data);
    } catch (err) {
        console.log(err.message);
        next(err);
    };
};

export const google = async (req, res, next) => {
    let token = '';
    let data;

    try {
        const user = await User.findOne({email: req.body.email});
        if(user){
            token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password, ...userData } = user._doc; //destructuring
            data = userData;
        }else{
            const generatePass = Math.random().toString(36).slice(-8); //generate 8 digit pass
            const hashPass = bcryptjs.hashSync(generatePass, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 10000).toString(),
                email: req.body.email,
                password : hashPass,
                profilePic: req.body.photo
            });
            
            const resUser = await newUser.save();
            token = jwt.sign({ id: resUser._id }, process.env.JWT_SECRET);
            const { password, ...resUserData } = resUser._doc;
            data = resUserData;
        }
        const expiredDate = new Date(Date.now() + parseInt(process.env.EXPIREDDATECOOKIE)) // 1hour
        res.cookie('access_token', token, { 
                httpOnly:true, 
                expires: expiredDate
            }).status(200).json(data);
    
    } catch (err) {
        console.log(err.message);
        next(err);
    };
};

export const signOut = async (req, res) => {
    res.clearCookie('access_token').status(200).json('Sign out sucess');
}
