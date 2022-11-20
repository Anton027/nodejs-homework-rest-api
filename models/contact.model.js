const { Schema, model } = require('mongoose');

const contactShema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    // owner: {
    //     type: SchemaTypes.ObjectId,
    //     ref: 'user',
    // }
});

const Contact = model('contacts', contactShema);

module.exports = {
    Contact
};