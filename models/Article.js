const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {type:String, required:true},
    slug: {type:String, required:true, unique:true},
    meta:{
        title: String,
        description : String,
        keywords: [String]
    },
    media: {
        images: [String],
        tweets: [String],
        videos: [String]
    },
    content: {type:String, required:true},
    createdAt: {type:Date, default:Date.now},
});

module.exports = mongoose.model('Article', articleSchema);