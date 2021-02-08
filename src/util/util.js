/*
 * @Author: your name
 * @Date: 2021-01-04 18:55:35
 * @LastEditTime: 2021-02-08 21:28:07
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \mangaFetch\src\util\util.js
 */
module.exports = {
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
    },
    getQueryVariable(variable) {
        let query = window.location.search.substring(1)
        let vars = query.split("&")
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=")
            if (pair[0] == variable) {
                return pair[1]
            }
        }
        return false
    }
}