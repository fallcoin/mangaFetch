const { $ } = require('../util/util.js');
const dmzj = require('../source/dmzj.js');
const { ipcRenderer } = require('electron');

let downloading = false;

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
        await dmzj(url);
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