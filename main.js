const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request=require('request');
const fs=require('fs');

//get html argument
//if not enough just return
//uh.. I write a monster

if(process.argv.length<=2){
    console.log("not enough arguments");
    return;
} 
else{

    let web='nhentai';
    let bookNumber=process.argv[2];
    let dir=createDir(web,bookNumber);
    let page=getPages(`https://nhentai.net/g/${bookNumber}/`);

    page.then(function(resolve,reject){
        console.log(resolve);
        downloadImage(resolve.galleryNumber,resolve.pageNumber,resolve.filetype,dir);
    });
}

//Create comic directory
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
            let pagesString=pagesElement.innerHTML.split('pages');
            console.log(pagesString);
            let pages=parseInt(pagesString[0]);
            
            let galleryElement=document.getElementsByClassName("gallerythumb")[2].childNodes[1].attributes["data-src"].value;
            let test=galleryElement.split('galleries/')[1];
            test=test.split('/')[0];
            let galleryNumber=parseInt(test);

            //get
            let Package={
                galleryNumber:galleryNumber,
                pageNumber:pages,
                filetype:[],
            };

            let galleryElementArray=document.getElementsByClassName("gallerythumb");
            
            for(let i=0;i<=pages-1;i++)
            {
                let element=galleryElementArray[i].childNodes[1].attributes["data-src"].value;
                element.split('.');
                Package.filetype[i]=element.split('.')[3];
            }

            resolve(Package);
        });
    });
}

function downloadImage(number,pages,type,targetDir){

    for(let i=1;i<=pages;i++)
    {
        //need to adjust array iterate
        //i from 1-25, type from 0-24
        let uri=`https://i.nhentai.net/galleries/${number}/${i}.${type[i-1]}`;
        request(uri).pipe(fs.createWriteStream(`${targetDir}/${i}.jpg`)).on('close',function(){
            console.log(i + 'done');
        });
    }
}
