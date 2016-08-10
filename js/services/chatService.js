/**
 * jiangyukun on 2016/8/8.
 */
import {NotificationType, MessageType} from '../constants/ChatConstants'
import util from '../components/core/util'

export default {
    fetchHistoryMessage(user1, user2, start) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: `../chat/getSingleChatMessages/${user1}/${user2}/${start}`,
                type: 'get',
                success(result) {
                    // console.log(result);
                    if (result.status != 0) {
                        util.tip(NotificationType.ERROR, '获取历史记录失败！')
                    }
                    // console.log(result.data);
                    let historyMessageList = result.data.map(historyItem=> {
                        let type = historyItem.chat_Msg_Type
                        let history = {
                            from: historyItem.chat_From,
                            to: historyItem.chat_To,
                            datetime: historyItem.chat_Time,
                            chatType: historyItem.chat_Type,
                            type: historyItem.chat_Msg_Type
                        }
                        if (type == MessageType.TEXT) {
                            history.data = historyItem.chat_Msg_Content
                        } else if (type == MessageType.AUDIO) {
                            history.data = historyItem.chat_File_Url
                        } else {
                            history.data = '[' + type + ']'
                        }

                        return history
                    })
                    resolve(historyMessageList || [])
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
                        util.tip(NotificationType.ERROR, '获取医生列表失败！')
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
                        util.tip(NotificationType.ERROR, '获取患者列表失败！')
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
