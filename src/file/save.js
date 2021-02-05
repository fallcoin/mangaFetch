/*
 * @Author: your name
 * @Date: 2021-01-06 13:28:53
 * @LastEditTime: 2021-02-05 16:30:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mangaFetch\src\file\save.js
 */
const { urlToImage } = require("./toImage");
const { mkdir, access } = require("../util/fileSys");
const { writeFile } = require('fs');
const { resolve } = require("path");
/**
 * @description: 
 * @param {String} dir  // 每一话的存储路径
 * @param {String} imageURLs    // 该话中的所有图片路径（有序
 * @param {String} chapterName  // 章节名
 * @param {Object} option  // 请求参数
 * @param {Function} callback   // 存储完后调用的函数
 * @return {*}
 */
async function save(dir, imageURLs, chapterName, option, callback) {
    const isExist = await access(`${dir}/${chapterName}`);
    if (!isExist) {
        await mkdir(`${dir}/${chapterName}`);
    }

    for (let i = 0; i < imageURLs.length; i++) {
        try {
            await urlToImage(imageURLs[i], `${dir}/${chapterName}`, i, option);
        } catch (error) {
            console.log('***', error);
        }

    }
    callback();
}

function bufferSave(path, buffer) {
    return new Promise((resolve, reject) => {
        writeFile(path, buffer, (err) => {
            if (err) {
                reject()
                return;
            }
            resolve();
        })
    })
}

module.exports = {
    save,
    bufferSave
}