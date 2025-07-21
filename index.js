const { Server } = require('./src/config/server')
require('dotenv').config();

const server = new Server();

const start = async () => {

  await server.dbConnection();
  server.listen();

}

start()