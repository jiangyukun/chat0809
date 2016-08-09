/*
 * jiangyukun on 2016-07-28 20:29
 */
import AppDispatcher from '../dispatcher/AppDispatcher'
import ChatConstants, {ChatType, NotificationType} from '../constants/ChatConstants'
import {EventEmitter} from 'events'
import util from '../components/core/util'
import MessageHelper from '../components/core/MessageHelper'

import chatService from '../services/chatService'
import * as conn from '../services/connApi'

let patientList = []
let patientGroupList = []
let doctorList = []
let message = []
let groupMembers = []
let CHANGE_EVENT = 'change'
let curUserId

let ChatStore = Object.assign({}, EventEmitter.prototype, {
    getLoginUser() {
        return curUserId
    },

    getPatientList() {
        return patientList
    },

    getDoctorList() {
        return doctorList
    },

    getPatientGroupList() {
        return patientGroupList
    },

    getMessage() {
        return message
    },

    getGroupMembers() {
        return groupMembers
    },

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback)
    },

    removeChangeListener(listener) {
        this.removeListener(CHANGE_EVENT, listener)
    }
})

function initMessage(msgInfo) {
    MessageHelper.initMessage(message, msgInfo)
}

AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case ChatConstants.LOGIN:
            conn.login(action.username, action.password)
            conn.onLoginSuccess(action.success)
            conn.onLoginFailure(action.error)
            break

        case ChatConstants.CHECK_LOGIN_INFO:
            if (conn.isOpened()) {
                return
            }
            let accessToken = util.getSession('accessToken')
            if (accessToken && !conn.isOpening()) {
                conn.reOpen()
                return
            }
            action.failCallback()
            break

        case ChatConstants.SEND_MESSAGE:
            let {to, content, type} = action

            conn.sendTextMessage({type, to, msg: content})
            MessageHelper.sendTextMessage(message, type, curUserId, to, content)

            ChatStore.emit(CHANGE_EVENT)
            break

        case ChatConstants.READ_MESSAGE:
            MessageHelper.readMessage(message, action.name, action.type)
            ChatStore.emit(CHANGE_EVENT)
            break

        case ChatConstants.SEND_IMAGE_MESSAGE:
            conn.sendPicture({
                file: action.image, to: action.to
            })
            MessageHelper.sendImageMessage(message, action.type, curUserId, action.to, action.image)
            ChatStore.emit(CHANGE_EVENT)
            break

        case ChatConstants.SEND_VOICE_MESSAGE:
            conn.sendPicture({
                file: action.voice, to: action.to
            })
            MessageHelper.sendVoiceMessage(message, action.type, curUserId, action.to, action.voice)
            ChatStore.emit(CHANGE_EVENT)
            break

        case ChatConstants.FETCH_HISTORY_MESSAGE:
            let {user1, user2} = action
            chatService.fetchHistoryMessage()
            break

        case ChatConstants.LOGIN_OUT:
            util.removeSession('accessToken')
            conn.closeConn()
            break

        case ChatConstants.BEGIN_GROUP_CHAT:
            conn.queryRoomMember(action.roomId).then((result)=> {
                result.map(member=> {
                    let jid = member.jid;
                    let from = (jid.indexOf('_') + 1)
                    let to = jid.indexOf('@')
                    let name = jid.substring(from, to)
                    groupMembers.push({
                        jid: jid,
                        name: name
                    })
                })
                groupMembers.unshift({
                    jid: curUserId,
                    name: curUserId
                })
                ChatStore.emit(CHANGE_EVENT)
            })
            break

        default:
            break
    }
})

export default ChatStore

// -------------------------------------------------------------

conn.onLoginSuccess((userId)=> {
    curUserId = userId
    fetchPatientListFromHuanXin()
    // fetchPatientListFromServer()

    fetchGroupListFromHuanXin()
    // fetchDoctorListFromServer()
})

conn.onTextMessage((textMessage)=> {
    let {type, from} = textMessage
    // console.log(pictureMessage)
    MessageHelper.receiveMessage(message, type, from, textMessage)

    ChatStore.emit(CHANGE_EVENT)
})

conn.onEmotionMessage(emotionMessage=> {
    console.log(emotionMessage);
})

conn.onPictureMessage((pictureMessage)=> {
    let {type, from} = pictureMessage
    // console.log(pictureMessage)
    MessageHelper.receiveMessage(message, type, from, pictureMessage)

    ChatStore.emit(CHANGE_EVENT)
})

function fetchPatientListFromHuanXin() {
    conn.getRoster().then((result)=> {
        patientList = result.map(user=> {
            initMessage({
                name: user.name,
                type: ChatType.CHAT
            })
            return {
                name: user.name,
                nickname: user.name
            }
        })
        ChatStore.emit(CHANGE_EVENT)
    })
}

function fetchGroupListFromHuanXin() {
    conn.listRooms().then(rooms=> {
        patientGroupList = rooms.map(group=> {
            initMessage({
                roomId: group.roomId,
                type: ChatType.GROUP_CHAT,
                name: group.name
            })
            return {
                roomId: group.roomId,
                name: group.name
            }
        })
        ChatStore.emit(CHANGE_EVENT)
    })
}

function fetchPatientListFromServer() {
    chatService.fetchPatientList().then(patients=> {
        // console.log(patients);
        patientList = patients.map(patient=> {
            let name = patient['user_Name']
            let nickname = patient['patient_Name']
            initMessage({
                name: name,
                type: ChatType.CHAT
            })
            return {
                name: name,
                nickname: nickname
            }
        })
        ChatStore.emit(CHANGE_EVENT)
    })
}

function fetchDoctorListFromServer() {
    chatService.fetchDoctorList().then((doctors) => {
        doctorList = doctors.map(doctor=> {
            let name = doctor['user_Name']
            let nickname = doctor['doctor_Name']
            initMessage({
                name: name,
                type: ChatType.CHAT
            })
            return {
                name: name,
                nickname: nickname
            }
        })
        ChatStore.emit(CHANGE_EVENT)
    })
}

// chatService.fetchHistoryMessage('test', 'test0')