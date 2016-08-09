/**
 * jiangyukun on 2016/8/8.
 */
import {NotificationType, ChatType} from '../constants/ChatConstants'
import notificationActions from '../actions/NotificationActions'

export default {
    fetchHistoryMessage(user1, user2) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: `../chat/getSingleChatMessages/${user1}/${user2}`,
                type: 'get',
                success(result) {
                    if (result.status != 0) {
                        notificationActions.addNotification(NotificationType.ERROR, '获取历史记录失败！')
                    }
                    resolve(result.data)
                },
                error() {
                    reject()
                }
            })
        })
    },

    fetchDoctorList() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: '../chat/getDoctorImList',
                type: 'get',
                success  (result) {
                    // console.log(result);
                    if (result.status != 0) {
                        notificationActions.addNotification(NotificationType.ERROR, '获取医生列表失败！')
                    }

                    resolve(result.data)
                },
                error() {
                    reject()
                }
            })
        })
    },

    fetchPatientList() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: '../chat/getPatientImList',
                type: 'get',
                success  (result) {
                    // console.log(result);
                    if (result.status != 0) {
                        notificationActions.addNotification(NotificationType.ERROR, '获取患者列表失败！')
                    }

                    resolve(result.data)
                },
                error() {
                    reject()
                }
            })
        })
    }
}
