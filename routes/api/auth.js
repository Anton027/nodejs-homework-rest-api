const express = require('express');
const { tryCatchWrapper } = require('../../helpers')
const authRouter = express.Router();
const users = require('../../models/authUser')
const { auth } = require('../../middlewares/auth')

authRouter.post('/register', tryCatchWrapper(users.register));
authRouter.post('/login', tryCatchWrapper(users.login));
authRouter.post('/logout', tryCatchWrapper(auth), tryCatchWrapper(users.logout));


module.exports = authRouter;
    

