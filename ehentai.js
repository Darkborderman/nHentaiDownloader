const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request=require('request');
const fs=require('fs');


async function download (page,bookNumber,pageStart,pageEnd)
{
    let web='nhentai';
    let dir=createDir(web,bookNumber);
    for(let i=pageStart;i<=pageEnd;i++)
    {
        await downloadImage(page.galleryNumber,i,page.filetype,dir);
    }
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
            //console.log(pagesString);
            let pages=parseInt(pagesString[0]);
            
            let galleryElement=document.getElementsByClassName("gallerythumb")[2].childNodes[1].attributes["data-src"].value;
            let test=galleryElement.split('galleries/')[1];
            test=test.split('/')[0];
            let galleryNumber=parseInt(test);

            let bookName=document.getElementById("info").childNodes[3].innerText;
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

async function downloadImage(number,i,type,targetDir){

    let uri=`https://i.nhentai.net/galleries/${number}/${i}.${type[i-1]}`;

    const res=await request(uri).pipe(fs.createWriteStream(`${targetDir}/${i}.jpg`));
    

    return new Promise((resolve,reject)=>{
        res.on(`close`,()=>{
            console.log(`${i} done`);
            resolve(`done`);
        });
    });
}

module.exports={
    download:download,
    getPages:getPages
};