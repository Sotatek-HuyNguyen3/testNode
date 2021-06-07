const User = require('./../User');
const redis = require("redis");
const client = redis.createClient();
const bCrypt = require("bcrypt")

module.exports = {
    login: async (req, res) => {
        let email = req.body.email;
        await client.get(email, function (err, user) {
            if (err) throw err;
            if (user) {
                if (!checkPasswordConfirm(req.body.passwordConfirmation, req.body.password)) return res.json({
                    message: 'Email or password is incorrect!',
                });
                bCrypt.compare(JSON.parse(user).password, req.body.password, function (err, result) {
                    if (err || !result) return res.json({
                        message: 'Email or password is incorrect!',
                    });
                })

                return res.json({
                    message: 'Đăng nhập thành công',
                    data: JSON.parse(user)
                });
            }

            User.findOne({email: email}, function (err, userObj) {
                if (err || !userObj) return res.status(400).json({
                    message: 'User not exists',
                });

                client.set(email, JSON.stringify(userObj), 'EX', 60 * 60 * 24 * 30)
                return res.json({
                    message: 'Đăng nhập thành công',
                    data: userObj
                });
            });
        });
    },

    logout: async (req, res) => {
        let email = req.body.email
        client.del(email, function (err) {
            if (err) throw err
            return res.json({
                message: 'logout thành công',
            });
        });
    }
}

const checkPasswordConfirm = function (password, passwordConfirm) {
    return (password === passwordConfirm)
}