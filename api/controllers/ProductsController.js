const db = require('./../db')
const rp = require("request-promise");
const redis = require("redis");
const client = redis.createClient();

// use mysql
module.exports = {
    get: (req, res) => {
        let sql = 'SELECT * FROM products';
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },

    detail: (req, res) => {
        let sql = 'SELECT * FROM products WHERE id = ?';
        db.query(sql, [req.params.productId], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },

    update: (req, res) => {
        let data = req.body;
        let productId = req.params.productId;
        let sql = 'UPDATE products SET ? WHERE id = ?'
        db.query(sql, [data, productId], (err, response) => {
            if (err) throw err
            res.json({message: 'Update success!'})
        })
    },

    store: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO products SET ?';
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({message: 'Insert success!'})
        })
    },

    delete: (req, res) => {
        let sql = 'DELETE FROM products WHERE id = ?';
        db.query(sql, [req.params.productId], (err, response) => {
            if (err) throw err
            res.json({message: 'Delete success!'})
        })
    },

    price: async (req, res) => {
        let data = req.body;

        client.get(data.id, function (err, price) {
            if (price) return res.json(JSON.parse(price))
            price = getPrice(data.id, data.vs_currencies);
            price.then(function (result) {
                return res.json(JSON.parse(result));
            });
        });
    },
}

async function getPrice(id, currencies) {
    let options = {
            uri: "https://api.coingecko.com/api/v3/simple/price?ids=" + id + "&vs_currencies=" + currencies,
        },
        response = await rp(options);
    client.set(id, response.toString(), 'EX', 60 * 60 * 24);
    return response.toString()
}
