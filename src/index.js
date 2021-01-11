const { $, $radioValue } = require('./util/util.js');
const { ipcRenderer } = require('electron');

$('confirm').addEventListener('click', () => {
    const source = $radioValue('sourceRadios');
    ipcRenderer.send('open-download-page', source);
})