const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    title: { type: String },
    summary: { type: String },
    content: { type: String },
    image: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
},
{
    timestamps: true
});

module.exports = mongoose.model('Post', PostSchema); 