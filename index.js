const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "1234567890";

const cors = require("cors");
const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "data.json"));
const middlewares = jsonServer.defaults();

let peserta = undefined;
let hadiah = undefined;

const initializeData = () => {
  // Must use fs.readFile to get the newest data
  // Cannot use require (cached)
  const { entrants, gifts } = JSON.parse(
    fs.readFileSync("./data.json", "utf-8")
  );
  return [entrants, gifts];
};

[peserta, hadiah] = initializeData();

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if ((req.path === "/login") & (req.method === "POST")) {
    let isLoggedIn = false;
    let payload = undefined;

    const { username, password } = req.body;

    peserta.forEach((e) => {
      if (e.username === username && bcrypt.compareSync(password, e.password)) {
        isLoggedIn = true;
        payload = {
          id: e.id,
          email: e.email,
        };
      }
    });

    if (isLoggedIn) {
      res.status(200).jsonp({
        statusCode: 200,
        data: jwt.sign(payload, SECRET_KEY, {
          expiresIn: "1h",
        }),
      });
    } else {
      res.status(400).jsonp({
        statusCode: 400,
        error: "Invalid Username / Password",
      });
    }
  } else if (req.path === "/entrants" && req.method === "GET") {
    res.status(400).jsonp({
      statusCode: 400,
      error: "Peserta tidak boleh diintip !",
    });
  } else if (req.path !== "/entrants" && req.method !== "GET") {
    try {
      // Must be logged in first
      // header name is token_akses
      const { token_akses: token } = req.headers;

      if (!token) {
        throw new Error("AUTHN_ERROR");
      }

      const payload = jwt.verify(token, SECRET_KEY);

      // Additional Headers
      req.headers.access_given_id = payload.id;
      req.headers.access_given_email = payload.email;

      next();
    } catch (err) {
      console.log(err);

      res.status(401).jsonp({
        statusCode: 401,
        error: "Unauthenticated",
      });
    }
  } else {
    next();
  }
});

server.use(
  // Authorization Logic
  (req, res, next) => {
    // Method Logic
    if (
      req.method === "PUT" ||
      req.method === "PATCH" ||
      req.method === "DELETE"
    ) {
      // Path Logic (/entrants/:id)
      if (req.path.includes("/entrants/")) {
        const queryEntrantId = +req.path.substring(10, req.path.length);
        const headerEntrantId = +req.headers.access_given_id;

        if (queryEntrantId !== headerEntrantId) {
          res.status(403).jsonp({
            statusCode: 403,
            error: "Forbidden",
          });
        } else {
          next();
        }
      }
      // Path Logic (/gifts/:id)
      else if (req.path.includes("/gifts/")) {
        const queryGiftId = +req.path.substring(7, req.path.length);
        const headerEntrantId = +req.headers.access_given_id;

        const objHadiah = hadiah.find((e) => e.id === queryGiftId);

        if (objHadiah.entrantId !== headerEntrantId) {
          res.status(403).jsonp({
            statusCode: 403,
            error: "Forbidden",
          });
        } else {
          next();
        }
      } else {
        next();
      }
    } else if (req.method === "POST" && req.path.includes("/gifts")) {
      const headerEntrantId = +req.headers.access_given_id;
      req.body.entrantId = headerEntrantId;
      next();
    } else {
      next();
    }
  },
  // Renew File Logic
  (req, res, next) => {
    // Re-read file
    [peserta, hadiah] = initializeData();
    console.log("Success re-read file");
    next();
  },
  router
);

router.render = (req, res) => {
  if (req.method === "POST") {
    res.status(201).jsonp({
      statusCode: 201,
      data: res.locals.data,
    });
  } else if (
    req.method === "GET" ||
    req.method === "PUT" ||
    req.method === "PATCH" ||
    req.method === "DELETE"
  ) {
    res.status(200).jsonp({
      statusCode: 200,
      data: res.locals.data,
    });
  }
};

server.listen(3000, () => {
  console.log("JSON Server is running");
});
