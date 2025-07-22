const express = require('express');
const cors = require('cors');
const { connect } = require('./dbConnection.js')

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT || 8080;

        this.path = {
            user: '/api/user',
            sell: '/api/sell',
            product: '/api/product',
        }

        this.middlewares()
        this.routes()

    }

    async dbConnection() {
        await connect()
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.path.user, require('../routes/user.routes.js'));
        this.app.use(this.path.sell, require('../routes/sell.routes.js'));
        this.app.use(this.path.product, require('../routes/product.routes.js'));
    }

    listen() {
        this.app.listen(this.port, '0.0.0.0',() => {
            console.log(`listening on port ${this.port}`);
        })
    }

}

module.exports = { Server }