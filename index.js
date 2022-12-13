console.clear();
/**
 * Configure Environment Variables
 */
require("dotenv").config();

/**
 * Import the dependencies
 */
const chalk = require("chalk");
const path = require("path");
console.log(chalk.cyanBright(">>===> Starting the application..."));

/**
 * Create the server
 */
const express = require("express");
const app = express();
const http = require("http");
const https = require("https");

const server = process.env.NODE_ENV === "production" ? https.createServer(app) : http.createServer(app);
const io = require("socket.io")(server, {
      cookie: true,
      cors: {
            origin: '*',
            methods: ['GET', 'POST']
      }
});

require('./socket/main')(io);

/**
 * Connect to the database
 */
const database = require("./database");

/**
 * Install All Middlewares
 */
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
      origin: "http://localhost:3000",
      credentials: true
}, {
      origin: "*",
      credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * Install All Routes
 */
app.use("/api", require(path.resolve(__dirname, "./Router", "./api", "./api.js")));

/**
 * Start the server
 */
const port = process.env.PORT || 5000;
database.connect(process.env.MONGODB_URI, (err) => {

      server.listen(port, (err) => {
            if (err) {
                  console.error(chalk.redBright(">>===> An error occured while starting the server"), err);
            } else {
                  console.log(chalk.greenBright(`>>===> Server started on port ${port}`));
            }
      });
});
