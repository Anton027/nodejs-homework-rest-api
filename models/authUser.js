const { User } = require('../models/user.model');
const { Conflict,Unauthorized  } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const { JWT_SECRET } = process.env;
const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');

async function sendRegisterEmail({email, token}) {
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "aa686821b981f9",
            pass: "bb7903f98c5f2d"
        }
    });
    const url = `localhost:3000/api/auth/verify/${token}`;

    const emailBody = {
        from: "info@db-contacts.com",
        to: email,
        subject: "Please verify your email",
        html: `<a> Please open this link: ${url} <a>`,
        text: "Hello my friend please verify email first"
    }
    const response = await transport.sendMail(emailBody);
    console.log("email.send: ", response);
};

async function verifyEmail(req, res, next) {
    const { verificationToken } = req.params;

    const user = await User.findOne({
        verificationToken
    })

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    if (!user.verify) {
        await User.findByIdAndUpdate(user._id, {
            verify: true
        })
        return res.status(200).json({
            message: 'Verification successful',
        })
    }

    if (user.verify) {
        return res.status(200).json({
            message: 'Verification successful',
        })
    }
}

async function verify(req, res, next) {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!email) {
        return res.status(400).json({
            message:"missing required field email"
        })
    }

    if (email && !user.verify) {
        const verificationToken = nanoid();
        await sendRegisterEmail({ email, verificationToken });

        return res.status(200).json({
            message: "Please verify",
            user,
        })
    }

    if (user.verify) {
        return res.status(400).json({
            message: "Verification has already been passed",
            
        })
    }
}

async function register(req, res, next) {
    const { email, password } = req.body;
    const avatarURL = gravatar.url(email,
        { s: '100', r: 'x', d: 'retro' },
        true);
    
    const verificationToken = nanoid();

    const user = new User({
        email, password, verificationToken, avatarURL
    });
    
    try {
        await user.save();
        await sendRegisterEmail({ email, token: verificationToken });
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

    if (!user.verify) {
        return res.status(404).json({
            message: 'Email is not verify'
        })
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
    verifyEmail,
    verify
}