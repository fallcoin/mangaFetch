const { $, $radioValue } = require('./util/domOpt');
const { ipcRenderer } = require('electron');

$('confirm').addEventListener('click', () => {
    const source = $radioValue('sourceRadios');
    ipcRenderer.send('open-download-page', source);
})