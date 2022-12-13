const Router = require('express').Router();
const authModel = require('../../../models/auth');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const chalk = require("chalk");
const path = require("path");
const multer = require('multer');

Router.post("/login", async (req, res) => {
      try {
            const { token } = req.body;

            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

            const ticket = await client.verifyIdToken({
                  idToken: token,
                  audience: process.env.CLIENT_ID
            });
            const payload = ticket.getPayload();

            const new_jwtToken = jwt.sign({ sub: payload.sub }, process.env.PRIVATE_KEY);

            authModel.findOne({ sub: payload.sub }).then(async userExist => {
                  if (userExist) { // login
                        userExist.name = payload.name;
                        userExist.email = payload.email;
                        userExist.avatar = payload.picture;

                        return userExist.save().then(async e => {
                              return res.status(200).cookie("jwtAuthToken", new_jwtToken).json({
                                    status: 200,
                                    type: "success",
                                    message: "Sccessfully LoggedIn",
                                    data: {
                                          name: e.name,
                                          email: e.email,
                                          avatar: e.picture,
                                          bio: e.bio,
                                          uploads: e.uploads,
                                          documents: e.documents,
                                          token: token,
                                    }
                              })
                        });
                  } else { // register

                        let newUser = new authModel({
                              sub: payload.sub,
                              idToken: token,
                              name: payload.name,
                              email: payload.email,
                              avatar: payload.picture,
                              bio: "",
                        })
                        return newUser.save().then(async e => {
                              console.log(chalk.green(">>===> New Account Registered: ", e.email));

                              return res.status(201).cookie("jwtAuthToken", new_jwtToken).json({
                                    status: 201,
                                    type: "success",
                                    message: "Successfully Registered",
                                    data: {
                                          name: e.name,
                                          email: e.email,
                                          avatar: e.avatar,
                                          bio: "",
                                          uploads: [],
                                          documents: [],
                                          token: token,
                                    }
                              });
                        })
                  }
            })
      } catch (err) {
            console.error(chalk.red(">>===> Error: "), err);
            res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
});

Router.post('/login_with_cookie', (req, res) => {
      try {
            const { jwtAuthToken } = req.cookies;

            if (jwtAuthToken) {
                  const sub = jwt.verify(jwtAuthToken, process.env.PRIVATE_KEY).sub;

                  authModel.findOne({ sub: sub }).then(e => {
                        if (e) {
                              const new_jwtToken = jwt.sign({ sub: sub }, process.env.PRIVATE_KEY);

                              return res.status(200).cookie("jwtAuthToken", new_jwtToken).json({
                                    status: 200,
                                    type: "success",
                                    message: "Successfully LoggedIn",
                                    data: {
                                          name: e.name,
                                          email: e.email,
                                          avatar: e.avatar,
                                          bio: e.bio,
                                          uploads: e.uploads,
                                          documents: e.documents,
                                          token: e.idToken
                                    }
                              });
                        } else {
                              return res.status(404).json({
                                    status: 404,
                                    type: "error",
                                    message: "Failed To LoggedIn",
                              });
                        }
                  });
            } else {
                  return res.status(404).json({
                        status: 404,
                        type: "error",
                        message: "Failed To LoggedIn",
                  });
            }

      } catch (err) {
            console.error(chalk.red(">>===> Error: "), err);
            res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
})

Router.post("/logout", (req, res) => {
      try {
            return res.status(200).clearCookie("jwtAuthToken").json({
                  status: 200,
                  type: "success",
                  message: "Successfully Loggedout",
            })
      } catch (err) {
            console.error(chalk.red(">>===> Error: "), err);
            res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
})

Router.post("/setAbout", (req, res) => {
      try {
            const { about } = req.body;

            if (about && typeof about === "string" && about.length < 300) {

                  const jwtAuthToken = req.cookies.jwtAuthToken;
                  const sub = jwt.verify(jwtAuthToken, process.env.PRIVATE_KEY).sub;

                  authModel.findOne({ sub: sub }).then(e => {
                        e.bio = about;
                        e.save().then(e => {
                              res.status(200).json({
                                    status: 200,
                                    type: "success",
                                    message: "Successfully Updated",
                                    data: {
                                          bio: e.bio
                                    }
                              });
                        })
                  })

            } else {
                  if (!about || typeof about !== "string") {
                        res.status(400).json({
                              status: 400,
                              type: "error",
                              message: "Please Enter About"
                        });
                  } else if (about.length > 300) {
                        res.status(400).json({
                              status: 400,
                              type: "error",
                              message: "About can not be more than 300 characters"
                        });
                  }
            }

      } catch (err) {
            console.error(chalk.red(">>===> Error: ", err));
            res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
})

const dest = path.join(__dirname, "../../../uploads");
var storage = multer.diskStorage({
      destination: function (req, file, cb) {
            cb(null, dest)
      },
      filename: function (req, file, cb) {
            cb(null, file.originalname + "-" + Date.now() + (path.extname(file.originalname) || ".jpg"))
      },
});
const upload = multer({ storage: storage });
Router.post("/upload", upload.single('upload'), (req, res) => {
      try {
            // If file uploaded, then store the path of the uploaded file in the user's profile
            if (req.file) {
                  const jwtAuthToken = req.cookies.jwtAuthToken;
                  const sub = jwt.verify(jwtAuthToken, process.env.PRIVATE_KEY).sub;

                  authModel.findOne({ sub: sub }).then(async e => {
                        if (e) {
                              e.uploads = [...e.uploads, `/uploads/${req.file.filename}`];
                              return await e.save().then(e => {
                                    return res.status(200).json({
                                          default: `/uploads/${req.file.filename}`,
                                    });
                              })
                        } else {
                              return res.status(404).json({
                                    default: "",
                              });
                        }
                  })

            } else {
                  return res.json({
                        default: "",
                  })
            }

      } catch (err) {
            console.error(chalk.red(">>===> Error: ", err));
            return res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
});


module.exports = Router;