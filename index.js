const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "1234567890";

const cors = require("cors");
const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "data.json"));
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

// TODO: Add routing for login here

server.use(router);
router.render((req, res) => {});

server.listen(3000, () => {
  console.log("JSON Server is running");
});
