const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog', function() {

    before(function(){
        return runServer();
    });

    after(function() {
        return closeServer();
    });
    it('should list blogs on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length.of.at.least(1);
                const expectedKeys = ['id', 'content', 'author', 'title', 'publishDate']
                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });
    it('should add a blog entry on POST', function() {
        const newItem = {content: 'blah blah', author: 'Kevin', title: 'blog title', publishDate: };
        return chai.request(app)
            .post('/blog-posts')
            .send(newItem)
            .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys('content', 'author', 'title', 'publishDate');
                res.body.id.should.not.be.null;
                res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
            });
    });
    it('should update blog on PUT', function() {
        const updateData = {content: 'blah', author: 'Finn', title: 'frog title', publishDate: };
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData);
            })
            .then(function(res) {
                res.should.have.status(204);
            });
    });
    it('should delete blog post on DELETE', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`)
            })
            .then(function(res) {
                res.should.have.status(204);
            });
    });
});