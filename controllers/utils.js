const mongoose = require('mongoose');
const cheerio = require('cheerio');
const request = require('request-promise-native');

const feedURL = 'https://www.engadget.com/rss.xml';

function addIfNonexistent(item, $, db) {
  return new Promise((resolve, reject) => {
    const id = $(item).find('guid').text();

    db.Article.findById(id, (err, article) => {
      if (err) {
        reject(err);
        return;
      }

      if (article) {
        resolve(article);
      } else {
        const headline = $(item).find('title').text();
        const desc = cheerio.load($(item).find('description').text());
        const url = $(item).find('link').text();

        const summary = desc.text().trim();
        const img = (() => {
          const imgs = desc('img');

          if (imgs.count === 0) {
            return null;
          }

          return cheerio(imgs[0]).attr('src');
        })();

        resolve(db.Article.create({
          headline, summary, url, img, _id: id,
        }));
      }
    });
  });
}

module.exports = {
  scrape(db) {
    return request(feedURL)
      .then((xml) => {
        const $ = cheerio.load(xml, { xmlMode: true });

        return Promise.all($('item').toArray().map(eachItem => addIfNonexistent(eachItem, $, db)));
      })
      .then(articles => articles.filter(article => article));
  },

  getArticle(db, id) {
    return db.Article.findById(id);
  },

  addComment(db, article, user, body) {
    return db.Comment.create({ user, body })
      .then((comment) => {
        article.comments.push(comment);
        return article.save();
      });
  },

  deleteComment(db, articleID, commentID) {
    return this.getArticle(db, articleID)
      .then((_article) => {
        const article = _article;
        article.comments = article.comments.filter(comment => String(comment._id) !== String(commentID));
        return article.save();
      });
  },
};
