const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;
const {BlogPosts} = require('./models');

BlogPosts.create('This is a sample title', 'This is sample content', 'Sample author', );

router.get('/', (req, res) => {
    BlogPosts
        .find()
        .limit(10)
        .then(blogPosts => {
            res.json({
                blogPosts: blogPosts.map(
                    (blogPosts) => blogPosts.apiRepr())
            });
        })
        .catch(
            err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error'})
        });
});

router.get('/:id', (req, res) => {
    BlogPosts
        .findById(req.params.id)
        .then(blogPosts => res.json(blogPosts.apiRepr()))
        .catch(err => {
            console.error(err);
                res.status(500).json({message: 'Internal server error'})
        });
});

router.post('/', jsonParser (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    BlogPosts
        .create({
            title: req.body.title, 
            content: req.body.content, 
            author: req.body.author, 
            publishDate: req.body.publishDate})
        .then(
            blogPosts => res.status(201).json(blogPosts.apiRepr())
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.delete('/:id', (req, res) => {
    BlogPosts
        .findByIdAndRemove(req.params.id)
        
        .then(blogPosts => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.put('/:id', jsonParser, (req, res) => {
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id} and request body id ` + 
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({message: message});
    }
    const toUpdate = {};
    const updateableFields = ['title', 'content', 'author', 'publishDate'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    BlogPosts
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(blogPosts => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.use('*', function(req, res) {
    res.status(404).json({message: 'Not Found'});
  });

module.exports = router;