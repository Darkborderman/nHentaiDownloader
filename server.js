let express=require('express');
let server=express();

let directory=`${__dirname}/`;
let ehentai=require(`${directory}/ehentai.js`);
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request=require('request');
const fs=require('fs');

server.use('/', express.static(__dirname + '/'));

server.get('/', function(req, res) {
    console.log(ehentai.download);
    res.sendFile(`${__dirname}/index.html`);

});

server.get('/login',function(req,res){
    console.log(req.query.bookNumber);

    ehentai.download(parseInt(req.query.bookNumber));
    res.sendFile(`${__dirname}/index.html`);
});

server.listen(3000);