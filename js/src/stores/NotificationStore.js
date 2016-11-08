/**
 * jiangyukun on 2016/8/5 10:40
 */
import AppDispatcher from '../dispatcher/AppDispatcher'
import {NotificationType} from '../constants/ChatConstants'
import {EventEmitter} from 'events'

let nid = 1
let notificationList = []
let CHANGE_EVENT = 'change'

let NotificationStore = Object.assign({}, EventEmitter.prototype, {
    getNotificationList() {
        return notificationList
    },

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback)
    }
})

export default NotificationStore

AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case NotificationType.ADD:
            let title = '提示'
            let {content, type} = action
            notificationList.push({
                id: nid++,
                type: type,
                title: title,
                content: content
            })
            NotificationStore.emit(CHANGE_EVENT)
            break

        case NotificationType.REMOVE:
            let notificationId = action.notificationId
            notificationList = notificationList.filter(item=> {
                return item.id != notificationId
            })
            NotificationStore.emit(CHANGE_EVENT)
            break

        default:
            break
    }
})
