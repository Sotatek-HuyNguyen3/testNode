const User = require('./../User');
const bCrypt = require("bcrypt")

//use mongo
module.exports = {
    create: async (req, res) => {
        if (req.body.password !== req.body.passwordConfirmation) {
            return res.status(400).json({
                message: 'Email or password is incorrect!'
            });
        }

        let userData = {
            email: req.body.email,
            username: req.body.username,
            password: createHash(req.body.password),
            created_at: Date.now(),
            updated_at: Date.now()
        }
        User.create(userData, function (err, user) {
            if (err) throw err
            return res.json({
                data: user,
                message: 'Register successfully'
            });
        });
    },

    update: async (req, res) => {
        await User.findOne({_id: req.params.userId}, function (err, userObj) {
            if (err || !userObj) return res.status(400).json({
                message: 'User not exists'
            });
            for (let field in req.body) {
                userObj[field] = req.body[field]
            }
            userObj.updated_at = Date.now()

            userObj.save(function (err, user) {
                if (err) throw err
                return res.json({
                    data: user,
                    message: 'Updated successfully'
                });
            });
        });
    },

    detail: async (req, res) => {
        User.findOne({_id: req.params.userId}, function (err, userObj) {
            if (err || !userObj) return res.status(400).json({
                message: 'User not exists'
            });

            return res.json({
                data: userObj,
            });
        });
    },

    delete: async (req, res) => {
        User.findOne({_id: req.params.userId}, function (err, userObj) {
            if (err || !userObj) return res.status(400).json({
                message: 'User not exists'
            });

            userObj.delete(function (err) {
                if (err) throw err
                return res.json({
                    message: 'deleted successfully!'
                });
            });
        });
    },
}
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}