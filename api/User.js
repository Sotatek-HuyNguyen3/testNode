const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeApi', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        default: Date,
    },
    updated_at: {
        type: String,
        default: Date,
    },
});
const User = mongoose.model('User', UserSchema);

module.exports = User;
