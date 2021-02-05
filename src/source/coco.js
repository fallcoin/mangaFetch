/*
 * @Author: your name
 * @Date: 2021-02-04 19:37:09
 * @LastEditTime: 2021-02-05 16:34:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mangaFetch\src\source\coco.js
 */
const puppeteer = require('puppeteer');
const { createRequest } = require('../util/util');
const { access, mkdir } = require('../util/fileSys');
const { resolve } = require('path');
const { save, bufferSave } = require('../file/save');

module.exports = async function (url) {
    await toMangaPage(url);
}

async function toMangaPage(url) {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(url);
    page.setDefaultNavigationTimeout(1000 * 60)
    await page.waitForSelector('div.fed-play-item.fed-drop-item.fed-visible');
    const manga = await page.evaluate(() => {
        const as = document.querySelectorAll('div.fed-play-item.fed-drop-item.fed-visible ul.fed-part-rows > li.fed-padding.fed-col-xs6.fed-col-md3.fed-col-lg3 > a.fed-btns-info.fed-rims-info.fed-part-eone');
        const links = Array.prototype.map.call(as, (item) => {
            return {
                href: item.href,
                chapterName: item.innerText
            };
        });
        const title = document.querySelector('h1.fed-part-eone.fed-font-xvi').innerText;

        return {
            links,
            title
        }
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
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        const chapterName = link.chapterName;
        const isExist = await access(`${dir}/${chapterName}`);
        if (!isExist) {
            await mkdir(`${dir}/${chapterName}`);
        }
        await page.on('response', (response) => {
            if (response.url().indexOf(`https://img.cocomanhua.com/comic/`) !== -1) {
                // 由于懒加载机制，会有相同的url被监听到
                let sectionUrl = response.url().substring(response.url().length - 20);
                let index = sectionUrl.indexOf('/');
                let name = sectionUrl.substring(index + 1);
                console.log(name);
                response.buffer().then(async buffer => {
                    await bufferSave(`${dir}/${chapterName}/${name}`, buffer)
                })
            }
        })
        await autoScroll(page);

        // const chapter = await page.evaluate(() => {
        //     const imgs = document.querySelectorAll('div.mh_comicpic > img');
        //     const urls = Array.prototype.map.call(imgs, x => x.src);
        //     console.log(urls);
        //     return {
        //         urls
        //     }
        // });

        // chapter.chapterName = link.chapterName;
        // await save(dir, chapter.urls, chapter.chapterName, {
        //     header: {
        //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36',
        //         Referer: 'https://www.cocomanhua.com/'
        //     }
        // }, () => {
        //     page.close();
        //     resolve(link)
        // });
    })
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}