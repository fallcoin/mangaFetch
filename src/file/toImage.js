const http = require('http');
const https = require('https')
const fs = require('fs');
const path = require('path');
const { writeFile } = require('../util/fileSys');
const request = require('request');

const urlToImage = function (url, dir, filename, option) {
    return new Promise((resolve, reject) => {
        const mod = /^https:/.test(url) ? https : http;
        const ext = path.extname(url);
        const file = path.join(dir, `${filename}${ext}`);
        request({
            method: 'GET',
            url,
            ...option
        }, (err, res, body) => {
            if (err) {
                reject('request error' + err)
            }
        })
            .pipe(fs.createWriteStream(file))
            .on('finish', () => {
                resolve();
            })
            .on('error', () => {
                reject('pipe error');
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