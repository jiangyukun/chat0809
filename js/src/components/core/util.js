import moment from 'moment'

function setSession(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
}

function getSession(key) {
    return JSON.parse(window.sessionStorage.getItem(key))
}

function removeSession(key) {
    window.sessionStorage.removeItem(key)
}

function setLocal(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

function getLocal(key) {
    return JSON.parse(window.localStorage.getItem(key))
}

let uid = getSession('uid') || 1

export default  {
    setSession,

    getSession,

    setLocal,

    getLocal,

    removeSession,

    getDataUrl(file) {
        return new Promise(function (resolve, reject) {
            let fileReader = new FileReader()

            fileReader.readAsDataURL(file)
            fileReader.onload = (e) => {
                resolve(e.target.result)
            }
        })
    },

    now() {
        return moment().format()
    },

    getUID() {
        try {
            return '__uid__' + uid++
        } finally {
            setSession('uid', uid)
        }
    }
}
