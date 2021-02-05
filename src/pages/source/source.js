const { $ } = require('../../util/domOpt.js');
const dmzj = require('../../source/dmzj.js');
const { ipcRenderer } = require('electron');
const { getQueryVariable } = require('../../util/util');
const coco = require('../../source/coco.js');

let downloading = false;

const source = getQueryVariable('source');

$('download').addEventListener('click', async () => {
    if (downloading) {
        alert('正在下载中...');
    } else {
        const url = $('entry').value;
        if (!url) {
            window.alert('您未输入任何url');
            return;
        }
        downloading = true;
        $('tip').classList.remove('visi');
        switch (source) {
            case 'dmzj':
                await dmzj(url);
                break;
            case 'coco':
                await coco(url);
            default:
                break;
        }
        $('tip').classList.add('visi')
        downloading = false;
        window.alert('下载完成');
    }
})

$('cancel').addEventListener('click', () => {
    if (downloading) {
        window.alert('正在下载中...');
    } else {
        ipcRenderer.send('close-source-page');
    }
})