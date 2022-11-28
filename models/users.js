const { User } = require('./user.model')
const fs = require('fs/promises');
const path = require('path');

async function getContact(req, res, next) {
    const { user } = req;
    return res.status(200).json({
        data: {
            contacts: user.contacts,
        }
    })
};
async function createContact(req, res, next) {
    const { _id } = req.body;
    const { user } = req; 
    user.contacts.push(_id)

    await User.findByIdAndUpdate(user._id, user);

    return res.status(201).json({
        data: {
            contacts: user.contacts,
        }
    })
};

async function getCurrent(req, res, next) {
    const { _id } = req.body;
    const { user } = req; 

    await User.findById(_id);

    return res.status(200).json({
        data: {
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        }
    })
}

async function changeAvatarUrl(req, res, next) {

    const newPath = path.join(__dirname,
        '../public/avatars/', req.file.filename);
    await fs.rename(req.file.path, newPath);
    
    const userId = req.params.id;
    const userAvatar = 'public/avatars/' + req.file.filename;

    const userSearch = await User.findById(userId);
    console.log(userSearch);

    const savedUserAvatarUrl = await User.findByIdAndUpdate(userId,
        { avatarURL: userAvatar }, { new: true });

    return res.status(200).json({
        data: {
            user: 
                savedUserAvatarUrl
            
        }
    })
    
}

module.exports = {
    getContact,
    getCurrent,
    createContact,
    changeAvatarUrl
}