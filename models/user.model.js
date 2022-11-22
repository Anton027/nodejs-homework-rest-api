const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    contacts: [
        {
            _id: Schema.Types.ObjectId,
        }
    ],
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
},{
    timestamps: true,
    versionKey: false
});

userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) next();

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
});

const User = model('users', userSchema);

module.exports = {
    User
};