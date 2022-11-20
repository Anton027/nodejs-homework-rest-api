const { User } = require('../models/user.model');
const { Conflict,Unauthorized  } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

async function register(req, res, next) {
    const { email, password } = req.body;
    const user = new User({ email, password});

    try {
        await user.save();
    } catch (error) {
        if (error.message.includes('duplicate key error collection')) {
            throw new Conflict('Email in use')
        }
        throw error;
    }
    

    return res.status(201).json({
        data: {
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        },
    })
}

async function login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Unauthorized(" User does not exists");
    }
    const isPasswordTheSame = await bcrypt.compare(password, user.password);
    if (!isPasswordTheSame) {
        throw new Unauthorized("Email or password is wrong");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "15m",
    });
    return res.json({
        data: {
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        },
    });

}
module.exports = {
    register,
    login,
}