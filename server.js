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
    let thread=2;
    let pageinfo=ehentai.getPages(`https://nhentai.net/g/${req.query.bookNumber}/`);

    pageinfo.then((resolve,reject)=>{
        console.log(resolve);
        let page=resolve;
        ehentai.download(page,req.query.bookNumber,1,Math.floor(page.pageNumber/2));
        ehentai.download(page,req.query.bookNumber,Math.floor(page.pageNumber/2)+1,page.pageNumber);
    });
    //ehentai.download(parseInt(req.query.bookNumber));
    //res.sendFile(`${__dirname}/index.html`);
});

server.listen(3000);