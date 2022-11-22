const { User } = require('./user.model')

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

module.exports = {
    getContact,
    getCurrent,
    createContact
}