const utils = require('./utils');

module.exports = (app, db) => {
  app.get('/', (req, res, next) => {
    utils.scrape(db)
      .then(articles => res.render('article', { articles }))
      .catch(next);
  });
};
