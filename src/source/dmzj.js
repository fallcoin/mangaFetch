/*
 * @Author: your name
 * @Date: 2021-01-04 18:59:52
 * @LastEditTime: 2021-02-05 13:23:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mangaFetch\src\source\dmzj.js
 */
const puppeteer = require('puppeteer');
const { mkdir, access } = require('../util/fileSys');
const { createRequest } = require('../util/util')
const { resolve } = require('path');
const { save } = require('../file/save');

module.exports = async function (url) {
    await toMangaPage(url);
}

async function toMangaPage(url) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);
    page.waitForSelector('div.cartoon_online_border');
    const manga = await page.evaluate(() => {
        const as = document.querySelectorAll('.cartoon_online_border > ul > li > a');
        const links = Array.prototype.map.call(as, (item) => {
            return {
                href: item.href,
                chapterName: item.innerText
            };
        });
        const title = document.querySelector('.anim_title_text > a > h1').innerText;
        return {
            links,  // 每一话的链接
            title   // 漫画名
        };
    })
    const dir = resolve(__dirname, `../../download/${manga.title}`);

    let isExist = await access(dir);
    if (!isExist) {
        await mkdir(dir);
    }

    const tasks = []
    for (let i = 0; i < manga.links.length; i++) {
        tasks.push(() => scrape(manga.links[i], dir, browser));
    }
    return new Promise((resolve) => {
        createRequest(tasks, 3, async (results) => {
            await browser.close();
            resolve(results);
        })
    });
}

// 对每一话的图片进行抓取
function scrape(link, dir, browser) {
    return new Promise(async (resolve, reject) => {
        const page = await browser.newPage();
        await page.goto(link.href);
        const chapter = await page.evaluate(() => {
            // const src = document.querySelector('#center_box > img').src
            const a = document.querySelectorAll('#page_select > option');
            const imageURLs = Array.prototype.map.call(a, (item) => {
                return 'http:' + item.value;
            })
            return { imageURLs };
        })
        chapter.chapterName = link.chapterName;
        save(dir, chapter.imageURLs, chapter.chapterName, {
            header: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                Referer: 'http://manhua.dmzj.com/'
            }
        }, () => {
            page.close();
            resolve(link)
        });
    })
}
