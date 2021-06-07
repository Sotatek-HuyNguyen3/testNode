const {body} = require('express-validator');
const rp = require("request-promise");
const productsCtrl = require('./controllers/ProductsController');
const uploadCtrl = require('./controllers/UploadController');
const userCtrl = require('./controllers/UserController');
const authCtrl = require('./controllers/AuthController');
const ValidateCtrl = require('./controllers/ValidateController');

module.exports = function (app) {
    //crud
    app.route('/products')
        .get(productsCtrl.get)
        .post(productsCtrl.store);

    app.route('/products/:productId')
        .get(productsCtrl.detail)
        .put(productsCtrl.update)
        .delete(productsCtrl.delete);

    // get price
    app.get('/price',
        ValidateCtrl.validate([
            body('id').not().isEmpty(),
            body('vs_currencies').not().isEmpty(),
        ]),
        productsCtrl.price
    );

    app.get('/api/price', ValidateCtrl.validate([
        body('id').not().isEmpty(),
        body('vs_currencies').not().isEmpty(),
    ]), async (req, res) => {
        let options = {
                uri: "https://api.coingecko.com/api/v3/simple/price?ids=" + req.body.id + "&vs_currencies=" + req.body.vs_currencies,
            },
            response = await rp(options);

        return res.json(JSON.parse(response.toString()));
    });

    // upload
    app.route('/upload')
        .post(uploadCtrl.upload)
        .get(ValidateCtrl.validate([
                body('path').not().isEmpty().isString(),
            ]),
            uploadCtrl.getFile
        );
    app.route('/download/:image')
        .get(uploadCtrl.download)

    // User
    app.route('/register')
        .post(ValidateCtrl.validate([
                body('email').not().isEmpty().isEmail(),
                body('username').not().isEmpty(),
                body('password').not().isEmpty(),
            ]),
            userCtrl.create
        );

    app.route('/register/:userId')
        .put(
            userCtrl.update
        )
        .get(
            userCtrl.detail
        )
        .delete(
            userCtrl.delete
        );

    // Auth
    app.route('/login')
        .post(ValidateCtrl.validate([
                body('email').not().isEmpty().isEmail(),
                body('password').not().isEmpty(),
                body('passwordConfirmation').not().isEmpty(),
            ]),
            authCtrl.login
        )

    app.route('/logout')
        .get(authCtrl.logout);
};
