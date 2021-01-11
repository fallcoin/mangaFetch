const { urlToImage } = require("./toImage");
const { mkdir, access } = require("../util/util.js");

async function save(dir, imageURLs, chapterName, callback) {
    const isExist = await access(`${dir}/${chapterName}`);
    if (!isExist) {
        await mkdir(`${dir}/${chapterName}`);
    }
    for (let i = 0; i < imageURLs.length; i++) {
        await urlToImage(imageURLs[i], `${dir}/${chapterName}`, i)
    }
    callback();
}

module.exports = {
    save
}