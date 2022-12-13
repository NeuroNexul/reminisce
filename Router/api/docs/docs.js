const Router = require("express").Router();
const authModel = require("../../../models/auth");
const chalk = require("chalk");
const path = require("path");
const uuidV4 = require("uuid").v4;
const jwt = require("jsonwebtoken");


Router.post("/create", (req, res) => {
      try {

            const { jwtAuthToken } = req.cookies;
            const { name, isPublic } = req.body;

            if (jwtAuthToken) {
                  const sub = jwt.verify(jwtAuthToken, process.env.PRIVATE_KEY).sub;

                  authModel.findOne({ sub: sub }).then(e => {

                        if (e) {

                              const id = uuidV4();
                              const createdAt = new Date();

                              const new_doc = {
                                    id,
                                    name,
                                    isPublic,
                                    owner: e.email,
                                    others: [],
                                    commits: [
                                          {
                                                id: uuidV4(),
                                                commiter: e.email,
                                                message: "Created the project",
                                                created_at: createdAt,
                                                last_modified: createdAt,
                                                content: `<h1>Welcome to the Reminisce</h1><h3>A Github For Writers. Create, Write, Save, Share and more…</h3><p>&nbsp;</p><h4>Available Features:</h4><ul class="todo-list"><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Create Documents, private or public.</span></label></li><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Share Documents over the web.</span></label></li><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Live time collaboration between team members</span></label></li><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Save Documents in commits.</span></label></li><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Edit, delete, create commits.</span></label></li><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Explore the changed between commits.</span></label></li></ul><hr><h2 style="text-align:center;">« The End »</h2><p style="text-align:center;">Copyrights © All Rights Reserved | ${new Date().getFullYear()}</p>`,
                                          }
                                    ],
                                    created_at: createdAt,
                                    last_modified: createdAt,
                              }

                              e.documents = [...e.documents, new_doc];

                              return e.save().then((e) => {
                                    return res.status(200).json({
                                          status: 200,
                                          type: "success",
                                          message: "Document created",
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
                              });

                        } else {
                              return res.status(404).json({
                                    status: 404,
                                    type: "error",
                                    message: "User not found"
                              });
                        }

                  }).catch(err => {
                        console.error(chalk.red(">>===> Error: "), err);
                        return res.status(500).json({
                              status: 500,
                              type: "error",
                              message: err
                        });
                  });

            }

      } catch (err) {
            console.error(chalk.red(">>===> Error: "), err);
            return res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
})

Router.post("/delete", (req, res) => {
      try {

            const { jwtAuthToken } = req.cookies;
            const { id } = req.body;

            if (jwtAuthToken) {
                  const sub = jwt.verify(jwtAuthToken, process.env.PRIVATE_KEY).sub;

                  authModel.findOne({ sub: sub }).then(e => {

                        if (e) {

                              const new_doc = e.documents.filter(e => e.id !== id);

                              e.documents = new_doc;

                              return e.save().then((e) => {
                                    return res.status(200).json({
                                          status: 200,
                                          type: "success",
                                          message: "Document deleted",
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
                              });

                        } else {
                              return res.status(404).json({
                                    status: 404,
                                    type: "error",
                                    message: "User not found"
                              });
                        }

                  }).catch(err => {
                        console.error(chalk.red(">>===> Error: "), err);
                        return res.status(500).json({
                              status: 500,
                              type: "error",
                              message: err
                        });
                  });

            }

      } catch (err) {
            console.error(chalk.red(">>===> Error: "), err);
            return res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
})


Router.post("/create/commit", (req, res) => {
      try {

            const { jwtAuthToken } = req.cookies;
            const { docId, message, content } = req.body;

            if (jwtAuthToken) {
                  const sub = jwt.verify(jwtAuthToken, process.env.PRIVATE_KEY).sub;

                  authModel.findOne({ sub: sub }).then(e => {

                        if (e) {
                              const doc = e.documents.find(e => e.id === docId);
                              // get the last commit
                              const lastCommit = doc.commits[doc.commits.length - 1];

                              const id = uuidV4();
                              const createdAt = new Date();

                              authModel.findOneAndUpdate({ sub: sub, 'documents.id': docId }, {
                                    $push: {
                                          'documents.$.commits': {
                                                id: id,
                                                commiter: e.email,
                                                message: message || `My Commit No ${doc.commits.length + 1}`,
                                                created_at: createdAt,
                                                last_modified: createdAt,
                                                content: content || lastCommit?.content || `<h1>Welcome to the Reminisce</h1><h3>A Github For Writers. Create, Write, Save, Share and more…</h3><p>&nbsp;</p><h4>Available Features:</h4><ul class="todo-list"><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Create Documents, private or public.</span></label></li><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Share Documents over the web.</span></label></li><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Live time collaboration between team members</span></label></li><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Save Documents in commits.</span></label></li><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Edit, delete, create commits.</span></label></li><li><label class="todo-list__label"><input type="checkbox" disabled="disabled" checked="checked"><span class="todo-list__label__description">Explore the changed between commits.</span></label></li></ul><hr><h2 style="text-align:center;">« The End »</h2><p style="text-align:center;">Copyrights © All Rights Reserved | ${new Date().getFullYear()}</p>`,
                                          }
                                    }
                              }, {
                                    new: true
                              }).then(e => {

                                    return res.status(200).json({
                                          status: 200,
                                          type: "success",
                                          message: "Document created",
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

                              });
                        } else {
                              return res.status(404).json({
                                    status: 404,
                                    type: "error",
                                    message: "User not found"
                              });
                        }

                  }).catch(err => {
                        console.error(chalk.red(">>===> Error: "), err);
                        return res.status(500).json({
                              status: 500,
                              type: "error",
                              message: err
                        });
                  });

            }

      } catch (err) {
            console.error(chalk.red(">>===> Error: "), err);
            return res.status(500).json({
                  status: 500,
                  type: "error",
                  message: err
            });
      }
})

Router.post("/delete/commit", (req, res) => {
      try {

            const { jwtAuthToken } = req.cookies;
            const { docId, commitId } = req.body;

            if (jwtAuthToken) {
                  const sub = jwt.verify(jwtAuthToken, process.env.PRIVATE_KEY).sub;


                  authModel.findOneAndUpdate({ sub: sub, 'documents.id': docId }, {
                        $pull: {
                              'documents.$.commits': {
                                    id: commitId
                              }
                        }
                  }, {
                        new: true
                  }).then(e => {

                        if (e) {
                              // return updated document

                              return res.status(200).json({
                                    status: 200,
                                    type: "success",
                                    message: "Document deleted",
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
                                    message: "User not found"
                              });
                        }

                  }).catch(err => {
                        console.error(chalk.red(">>===> Error: "), err);
                        return res.status(500).json({
                              status: 500,
                              type: "error",
                              message: err
                        });
                  });

            }


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