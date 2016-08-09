/**
 * Created by jiangyukun on 2016/8/5.
 */
import AppDispatcher from '../dispatcher/AppDispatcher'
import {NotificationType} from '../constants/ChatConstants'

export default {
    addNotification(type, content) {
        AppDispatcher.dispatch({
            actionType: NotificationType.ADD, type, content
        })
    },

    removeNotification(notificationId) {
        AppDispatcher.dispatch({
            actionType: NotificationType.REMOVE, notificationId
        })
    }
}
