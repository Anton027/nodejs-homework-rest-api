const express = require('express');
const { tryCatchWrapper } = require('../../helpers')
const authRouter = express.Router();
const users = require('../../models/authUser')

authRouter.post('/register', tryCatchWrapper(users.register));
authRouter.post('/login', tryCatchWrapper(users.login));

module.exports = authRouter;
    

