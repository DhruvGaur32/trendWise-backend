const express = require('express');
const Article = require('../models/Article');
const router =express.Router();

router.get('/',async(req,res)=>{
    try{
        const articles= await Article.find().sort({createdAt:-1});
        res.json(articles);
    }
    catch(error){
        res.status(500).json({error: 'Server Error'});
    }
    }
);

router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(article); // content field will contain HTML
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
  

module.exports =router;