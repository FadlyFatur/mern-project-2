import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.status(200).json({
        statusCode:200,
        message: "API users is connected!"
    });
};

export const getUser = async(req, res, next) => {
    if(!req.params.id){
        return next(errorHandler(404, 'ID not set up yet!'))
    }

    try {
        const dataUser = await User.findById(
            req.params.id
        );
    
        const {password, ...data} = dataUser._doc;
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        next(error);
    };
}

export const updateProfile = async(req, res, next) => {
    if(req.user.id != req.params.id){
        return next(errorHandler(401, 'Can only update your Profile!'))
    }

    console.log(req.body);
    
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        console.log("TRY UPDATE");
        console.log(req.body);
        
        const updatedProfile = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePic: req.body.profilePic,
                }
            },
            {
                new:true
            },
        );
        console.log("AFTER UPDATED");
        console.log(updatedProfile);

        const { password, ...data } = updatedProfile    ._doc;
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

export const deleteProfile = async(req, res, next) => {
    if(req.user.id != req.params.id){
        return next(errorHandler(401, 'Can only delete own Profile!'))
    }
    
    try {
        const updatedProfile = await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted');
    } catch (err) {
        next(err);
    }
};