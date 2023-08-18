const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
};

// All Articles with comment_count
exports.getArticles = () => {
  return db
    .query(
      `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
};

// update article votes
exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article with article_id ${article_id} not found`,
        });
      }
      return rows[0];
    });
};

exports.getAllArticles = (sort_by, order) => {
  return db
    .query(
      `
    SELECT articles.*, count(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.getArticlesByTopic = (topic, sort_by, order) => {
  return db
    .query(
      `
    SELECT articles.*, count(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE topic = $1
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
    `,
      [topic]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article with ID ${article_id} not found`,
        });
      }
      return articles[0];
    });
};

exports.fetchArticleComments = (article_id) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", article_id);
};
