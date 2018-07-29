const mongoose = require('mongoose');
const CommentSchema = require('./Comment').schema;

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    require: false,
  },
  _id: {
    type: String,
    required: true,
  },
  comments: [CommentSchema],
});

module.exports = mongoose.model('Article', ArticleSchema);
