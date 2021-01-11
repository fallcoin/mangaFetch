const http = require('http');
const https = require('https')
const fs = require('fs');
const path = require('path');
const { writeFile } = require('../util/util');
const request = require('request');

const urlToImage = function (url, dir, filename) {
    return new Promise((resolve, reject) => {
        const mod = /^https:/.test(url) ? https : http;
        const ext = path.extname(url);
        const file = path.join(dir, `${filename}${ext}`);
        console.log(file);
        request({
            method: 'GET',
            url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                Referer: 'http://manhua.dmzj.com/'
            }
        }, (err, res, body) => {
            console.log(err);
        }).pipe(fs.createWriteStream(file))
            .on('finish', () => {
                resolve();
            })
    })
}

const base64ToImage = async function (base64Str, dir, filename) {
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);
    const ext = matches[1].split('/')[1].replace('jpeg', 'jpg');
    const file = path.join(dir, `${filename}.${ext}`);

    await writeFile(file, content, 'base64');

}

module.exports = {
    urlToImage,
    base64ToImage
}