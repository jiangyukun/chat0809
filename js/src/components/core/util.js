import moment from 'moment'

import notificationActions from '../../actions/NotificationActions'


function setSession(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
}

function getSession(key) {
    return JSON.parse(window.sessionStorage.getItem(key))
}

function removeSession(key) {
    window.sessionStorage.removeItem(key)
}

let uid = getSession('uid') || 1

export default  {
    setSession,

    getSession,

    removeSession,

    getDataUrl(file) {
        return new Promise(function (resolve, reject) {
            let fileReader = new FileReader()

            fileReader.readAsDataURL(file)
            fileReader.onload = (e)=> {
                resolve(e.target.result)
            }
        })
    },

    tip(...arg) {
        notificationActions.addNotification(...arg)
    },

    now() {
        return moment().format('MM-DD HH:mm')
    },

    getUID() {
        try {
            return '__uid__' + uid++
        } finally {
            setSession('uid', uid)
        }
    }
}
