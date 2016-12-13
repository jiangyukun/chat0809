/**
 * jiangyukun on 2016/8/8.
 */
import moment from 'moment'

import {MessageType} from '../constants/ChatConstants'
import huanxinUtils from '../core/utils/huanxinUtils'

export default {
    fetchHistoryMessage(user1, user2, start = 0) {
        return new Promise(function (resolve, reject) {
            let url = 'res/history-message.json'
            if (user2 == 'test0') {
                url = 'res/history-message1.json'
            }
            if (process.env.NODE_ENV == 'production') {
                url = `../chat/getSingleChatMessages/${user1}/${user2}/${start}`
            }

            fetch(url).then(response => response.json()).then(function (serverHistoryMessage) {
                if (serverHistoryMessage.status != 0) {
                    reject('获取历史记录失败！')
                    return
                }
                let historyMessageList = serverHistoryMessage.data.map(historyItem => {
                    let type = historyItem.chat_Msg_Type
                    let chatTime
                    try {
                        chatTime = moment(parseInt(historyItem.chat_Time)).format()
                    } catch (e) {
                    }
                    let history = {
                        id: historyItem.chat_Id,
                        from: historyItem.chat_From,
                        to: historyItem.chat_To,
                        chatType: historyItem.chat_Type,
                        type: type,
                        chatTime: chatTime
                    }
                    if (type == MessageType.TEXT) {
                        history.data = huanxinUtils.convertTextMessage(historyItem.chat_Msg_Content)
                    } else if (type == MessageType.AUDIO) {
                        history.data = historyItem.chat_File_Url
                    } else if (type == 'img') {
                        history.data = historyItem.chat_File_Url
                        history.type = MessageType.IMAGE
                    } else {
                        history.data = '[' + type + ']'
                    }
                    return history
                })
                resolve(historyMessageList || [])
            })
        })
    },

    fetchDoctorList() {
        let url = 'res/doctor-list.json'
        if (process.env.NODE_ENV == 'production') {
            url = `../chat/getDoctorImList`
        }
        return new Promise(function (resolve, reject) {
            fetch(url).then(response => response.json()).then(function (result) {
                if (result.status != 0) {
                    reject('获取医生列表失败！')
                    return
                }
                resolve(result.data)
            })
        })
    },

    fetchPatientList() {
        return new Promise(function (resolve, reject) {
            let url = 'res/patient-list.json'
            if (process.env.NODE_ENV == 'production') {
                url = `../chat/getPatientImList`
            }
            fetch(url).then(response => response.json()).then(function (result) {
                if (result.status != 0) {
                    reject('获取患者列表失败！')
                    return
                }

                resolve(result.data)
            })
        })
    }
}
