const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request=require('request');
const fs=require('fs');

//get html argument
//if not enough just return
//uh.. I write a monster

if(process.argv.length<=2){
    console.log("not enough arguments");
    console.log(process.argv[0]);
    return;
} 
else{

    let web='nhentai';
    let bookNumber=process.argv[2];
    let dir=createDir(web,bookNumber);
    let page=getPages(`https://nhentai.net/g/${bookNumber}/`);

    page.then(function(resolve,reject){
        console.log(resolve);
        downloadImage(resolve.galleryNumber,resolve.pages,resolve.type,dir);
    });
}

function createDir(mainDir,targetDir){

    if (!fs.existsSync(`./${mainDir}/`)){
        fs.mkdirSync(`./${mainDir}/`);
    }
    if (!fs.existsSync(`./${mainDir}/${targetDir}/`)){
        fs.mkdirSync(`./${mainDir}/${targetDir}/`);
    }
    return `./${mainDir}/${targetDir}`;
}

function getPages(uri){
    return new Promise(function(resolve,reject){
        request(uri, function(err, res, body){

            console.log('get pages');
            let html=new JSDOM(body);
            let document=html.window.document;

            let pagesElement=document.getElementById('tags').nextElementSibling;
            let pagesString=pagesElement.innerHTML.replace ( /[^\d.]/g, '' );
            document.getElementsByClassName("gallerythumb")[0].attribute
            let pages=parseInt(pagesString);
            
            let galleryElement=document.getElementsByClassName("gallerythumb")[2].childNodes[1].attributes["data-src"].value;
            let test=galleryElement.split('galleries/')[1];
            test=test.split('/')[0];
            let galleryNumber=parseInt(test);

            let type=galleryElement.split('galleries/')[1];
            type=type.split('.')[1];
            resolve({galleryNumber,pages,type});
        });
    });
}

function downloadImage(number,pages,type,targetDir){

    for(let i=1;i<=pages;i++)
    {
        let uri=`https://i.nhentai.net/galleries/${number}/${i}.${type}`;
        request(uri).pipe(fs.createWriteStream(`${targetDir}/${i}.jpg`)).on('close',function(){
            console.log(i + 'done');
        });
    }
}
