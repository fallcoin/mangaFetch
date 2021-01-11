const { writeFile, mkdir, access } = require("fs");

module.exports = {
    $(id) {
        return document.getElementById(id);
    },
    $radioValue(radiosName) {
        const radios = document.getElementsByName(radiosName);
        const radio = Array.prototype.find.call(radios, radio => {
            console.log(radio);
            return radio.checked === true;
        })
        return radio.value;
    },
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
    },
    createRequest(tasks, pool, callback) {
        const defaultPool = 3;
        if (typeof pool === 'function') {
            callback = pool;
            pool = defaultPool;
        }
        if (typeof pool !== 'number') {
            pool = defaultPool;
        }
        if (typeof callback != 'function') {
            callback = function () { };
        }
        class TaskQueue {
            constructor() {
                this.running = 0;
                this.queue = [];
                this.results = [];
            }
            pushTask(task) {
                this.queue.push(task);
                this.next();
            }
            next() {
                while (this.running < pool && this.queue.length) {
                    this.running++;
                    const task = this.queue.shift();
                    task().then(result => {
                        this.results.push(result)
                    }).finally(() => {
                        this.running--;
                        this.next();
                    })
                }
                if (this.running === 0) {
                    callback(this.results);
                }
            }
        }
        const TQ = new TaskQueue;
        tasks.forEach(task => {
            TQ.pushTask(task);
        });
    }
}