const express = require('express');
const { tryCatchWrapper } = require('../../helpers')
const userRouter = express.Router();
const users = require('../../models/users');
const { auth } = require('../../middlewares/auth');

userRouter.get('/contacts',tryCatchWrapper(auth), tryCatchWrapper(users.getContact));
userRouter.get('/current',tryCatchWrapper(auth), tryCatchWrapper(users.getCurrent));
userRouter.post('/contacts',tryCatchWrapper(auth), tryCatchWrapper(users.createContact));

module.exports = userRouter;