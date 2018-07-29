const utils = require('./utils');

module.exports = (app, db) => {
  app.get('/api/scrape', (req, res, next) => {
    utils.scrape(db)
      .then(articles => res.json(articles))
      .catch(next);
  });

  app.post('/api/comment', (req, res, next) => {
    const { id, user, body } = req.body;

    utils.getArticle(db, id)
      .then(article => utils.addComment(db, article, user, body))
      .then(article => res.json(article))
      .catch(next);
  });

  app.delete('/api/comment', (req, res, next) => {
    const { commentID, articleID } = req.body;

    utils.deleteComment(db, articleID, commentID)
      .then(next(null))
      .catch(next);
  });
};
