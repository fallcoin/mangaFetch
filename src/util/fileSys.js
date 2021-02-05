const { writeFile, mkdir, access } = require("fs");

module.exports = {
    writeFile(path, data, format) {
        return new Promise((resolve, reject) => {
            writeFile(path, data, format, (err) => {
                if (err) {
                    console.log(err, '写入失败');
                    reject()
                }
                resolve()
            })
        })
    },
    mkdir(path) {
        return new Promise((resolve, reject) => {
            mkdir(path, err => {
                if (err) {
                    console.log(err, '创建目录失败');
                    resolve(false);
                }
                resolve(true)
            })
        })
    },
    access(path) {
        return new Promise((resolve, reject) => {
            access(path, err => {
                if (err) {
                    resolve(false);
                }
                resolve(true);
            })
        })
    }
}