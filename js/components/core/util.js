/*
 *
 */
import notificationActions from '../../actions/NotificationActions'

export default  {
    setSession (key, value) {
        window.sessionStorage.setItem(key, JSON.stringify(value))
    },

    getSession(key) {
        return JSON.parse(window.sessionStorage.getItem(key))
    },

    removeSession(key) {
        window.sessionStorage.removeItem(key)
    },

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
    }
}
