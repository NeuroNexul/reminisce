const Router = require('express').Router();
const authModel = require('../../../models/auth');
const chalk = require("chalk");
const path = require("path");


Router.post("/getUser", (req, res) => {
      try {

            const userEmail = req.body.email;

            authModel.findOne({ email: userEmail }, (err, user) => {
                  if (err) {
                        console.error(chalk.red(">>===> Error: "), err);
                        return res.status(500).json({
                              status: 500,
                              type: "error",
                              message: err
                        });
                  }

                  if (user) {
                        return res.status(200).json({
                              status: 200,
                              type: "success",
                              message: "User found",
                              data: {
                                    name: user.name,
                                    email: user.email,
                                    avatar: user.avatar,
                                    bio: user.bio,
                              }
                        });
                  } else {
                        res.status(404).json({
                              status: 404,
                              type: "error",
                              message: "User not found"
                        });
                  }
            });

      } catch (err) {
            console.error(chalk.red(">>===> Error: "), err);
            return res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
});

Router.post("/getUsers", (req, res) => {
      try {

            const queryUsers = req.body.users;

            authModel.find({
                  email: { $in: queryUsers }
            }, (err, users) => {
                  if (err) {
                        console.error(chalk.red(">>===> Error: "), err);
                        return res.status(500).json({
                              status: 500,
                              type: "error",
                              message: err
                        });
                  }

                  const new_user_map = [];

                  for (const user of users) {
                        new_user_map.push({
                              name: user.name,
                              email: user.email,
                              avatar: user.avatar,
                              bio: user.bio,
                        });
                  }

                  // Sort users by queryUsers
                  const sorted_users = [];
                  for (const user of queryUsers) {
                        for (const new_user of new_user_map) {
                              if (new_user.email === user) {
                                    sorted_users.push(new_user);
                              }
                        }
                  }

                  return res.status(200).json({
                        status: 200,
                        type: "success",
                        message: "Successfully Fetched All Users",
                        data: sorted_users
                  });
            });

      } catch (err) {
            console.error(chalk.red(">>===> Error: "), err);
            return res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
})

Router.post("/getAllUsers", (req, res) => {
      try {

            authModel.find({}, (err, users) => {
                  if (err) {
                        console.error(chalk.red(">>===> Error: "), err);
                        return res.status(500).json({
                              status: 500,
                              type: "error",
                              message: err
                        });
                  }

                  const new_user_map = [];

                  for (const user of users) {
                        new_user_map.push({
                              name: user.name,
                              email: user.email,
                              avatar: user.avatar,
                              bio: user.bio,
                        });
                  }

                  return res.status(200).json({
                        status: 200,
                        type: "success",
                        message: "Successfully Fetched All Users",
                        data: new_user_map.sort((a, b) => a.name.localeCompare(b.name))
                  });
            });

      } catch (err) {
            console.error(chalk.red(">>===> Error: "), err);
            return res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
})



module.exports = Router;