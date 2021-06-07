const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('./api/uploads'));

let routes = require('./api/routes') //importing route
routes(app)

app.use(function (request, response) {
    response.status(404).send({url: request.originalUrl + ' not found'})
})

app.listen(port)

console.log('RESTful API server started on: ' + port)