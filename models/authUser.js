const { User } = require('../models/user.model');
const { Conflict,Unauthorized  } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const { JWT_SECRET } = process.env;

async function register(req, res, next) {
    const { email, password } = req.body;
    const user = new User({ email, password });

    try {
        await user.save();
        const avatar = gravatar.url(email, { s: '100', r: 'x', d: 'retro' }, true);
        user.avatarURL = avatar;
        console.log(user);
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
        expiresIn: "120m",
    });
    user.token = token;
    await User.findByIdAndUpdate(user._id, user);

    return res.json({
        data: {
            token,
            user: {
                _id: user._id,
                email: user.email,
                subscription: user.subscription,
            }
        },
    });

}

async function logout(req, res, next) {
    console.log("logout");
    const { user } = req;
    user.token = null;
    await User.findByIdAndUpdate(user._id, user);

    return res.json({
        
    })
}

module.exports = {
    register,
    login,
    logout,
}