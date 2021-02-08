/*
 * @Author: your name
 * @Date: 2021-01-04 18:44:04
 * @LastEditTime: 2021-02-08 22:22:43
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \mangaFetch\main.js
 */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    })

    win.loadFile(path.resolve(__dirname, './src/index.html'))
}

let sourcePage
ipcMain.on('open-download-page', (e, source) => {
    sourcePage = new BrowserWindow({
        width: 400,
        height: 200,
        webPreferences: {
            nodeIntegration: true,
        },
        frame: false,
        parent: win,
        modal: true
    })
    sourcePage.loadFile(path.resolve(__dirname, `./src/pages/source/source.html`), {
        query: { source }
    });
})
ipcMain.on('close-source-page', () => {
    sourcePage.close();
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})