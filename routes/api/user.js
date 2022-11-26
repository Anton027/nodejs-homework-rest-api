const express = require('express');
const { tryCatchWrapper } = require('../../helpers')
const userRouter = express.Router();
const users = require('../../models/users');
const { auth } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/uploadFile')

userRouter.get('/contacts', tryCatchWrapper(auth),
    tryCatchWrapper(users.getContact));
userRouter.get('/current', tryCatchWrapper(auth),
    tryCatchWrapper(users.getCurrent));
userRouter.post('/contacts', tryCatchWrapper(auth),
    tryCatchWrapper(users.createContact));
userRouter.patch('/:id/avatars', tryCatchWrapper(upload.single('avatarURL')) ,
    tryCatchWrapper(auth), tryCatchWrapper(users.changeAvatarUrl));

module.exports = userRouter;