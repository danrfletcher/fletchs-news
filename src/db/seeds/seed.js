const argon2 = require('argon2');
const format = require('pg-format');
const db = require('../connection');
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require('./utils');

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS article_votes;`)
    .then(()=> {
      return db.query(`DROP TABLE IF EXISTS refresh_tokens;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS comment_votes;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS comments;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      return Promise.all(userData.map(user => argon2.hash(user.password)))
    })
    .then((passwords) => {
      passwords.forEach((password, index) => {
        userData[index].password = password
      });
    })
    .then(() => {
      const usersTablePromise = db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR,
        password VARCHAR NOT NULL
      );`);

      const topicsTablePromise = db.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      );`);

      const refreshTokensPromise = db.query(`
      CREATE TABLE refresh_tokens (
        refresh_token_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL REFERENCES users(username),
        refresh_token VARCHAR NOT NULL,
        user_refresh_token_id INT NOT NULL
      )
      `)
      return Promise.all([usersTablePromise, topicsTablePromise, refreshTokensPromise]);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE article_votes (
        vote_id SERIAL PRIMARY KEY,
        article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
        username VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
        vote_type VARCHAR NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
        UNIQUE(article_id, username, vote_type)
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        article_id INT REFERENCES articles(article_id) NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        );`);
      })
    .then(() => {
      return db.query(`
      CREATE TABLE comment_votes (
        vote_id SERIAL PRIMARY KEY,
        comment_id INT NOT NULL REFERENCES comments(comment_id) ON DELETE CASCADE,
        username VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
        vote_type VARCHAR NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
        UNIQUE(comment_id, username, vote_type)
      );`);
    })
    .then(() => {
      const insertTopicsQueryStr = format(
        'INSERT INTO topics (slug, description) VALUES %L;',
        topicData.map(({ slug, description }) => [slug, description])
      );
      const topicsPromise = db.query(insertTopicsQueryStr);

      const insertUsersQueryStr = format(
        'INSERT INTO users ( username, name, avatar_url, password) VALUES %L;',
        userData.map(({ username, name, avatar_url, password }) => [
          username,
          name,
          avatar_url,
          password
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);

      return Promise.all([topicsPromise, usersPromise]);
    })
    .then(() => {
      const formattedArticleData = articleData.map(convertTimestampToDate);
      const insertArticlesQueryStr = format(
        'INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;',
        formattedArticleData.map(
          ({
            title,
            topic,
            author,
            body,
            created_at,
            votes = 0,
            article_img_url,
          }) => [title, topic, author, body, created_at, votes, article_img_url]
        )
      );
      return db.query(insertArticlesQueryStr);
    })
    .then(({ rows: articleRows }) => {
      const articleIdLookup = createRef(articleRows, 'title', 'article_id');
      const formattedCommentData = formatComments(commentData, articleIdLookup);

      const insertCommentsQueryStr = format(
        'INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;',
        formattedCommentData.map(
          ({ body, author, article_id, votes = 0, created_at }) => [
            body,
            author,
            article_id,
            votes,
            created_at,
          ]
        )
      );
      return db.query(insertCommentsQueryStr);
    })
    .then(() => {
      const promises = []
      userData.map(({ username, article_upvotes, article_downvotes, comment_upvotes, comment_downvotes }) => {
        const insertUserArticleUpvotes = format(
          `INSERT INTO article_votes (article_id, username, vote_type) VALUES %L;`,
          article_upvotes.map((article_id) => [article_id, username, 'upvote'])
          )
          promises.push(db.query(insertUserArticleUpvotes))
          
        const insertUserArticleDownvotes = format(
          `INSERT INTO article_votes (article_id, username, vote_type) VALUES %L;`,
          article_downvotes.map((article_id) => [article_id, username, 'downvote'])
          )
          promises.push(db.query(insertUserArticleDownvotes))
        
        const insertUserCommentUpvotes = format(
          `INSERT INTO comment_votes (comment_id, username, vote_type) VALUES %L;`,
          comment_upvotes.map((comment_id) => [comment_id, username, 'upvote'])
          )
          promises.push(db.query(insertUserCommentUpvotes))

        const insertUserCommentDownvotes = format(
          `INSERT INTO comment_votes (comment_id, username, vote_type) VALUES %L;`,
          comment_downvotes.map((comment_id) => [comment_id, username, 'downvote'])
          )
          promises.push(db.query(insertUserCommentDownvotes))
      });
      Promise.all(promises)
    })
};

module.exports = seed;
