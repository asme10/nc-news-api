const express = require("express");
const app = express();

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/errors.controller");

const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  getAllArticles,
} = require("./controllers/articles.controller");
const { getCommentsForArticle } = require("./controllers/comments.controller");

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = { app };
