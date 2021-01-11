const puppeteer = require('puppeteer');
const { mkdir, createRequest, access } = require('../util/util');
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
            links,
            title
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
        save(dir, chapter.imageURLs, chapter.chapterName, () => {
            page.close();
            resolve(link)
        });
    })
}
