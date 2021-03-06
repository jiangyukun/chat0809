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
let RE_LOGIN_EVENT = 're_login'
let NEW_MESSAGE_EVENT = 'new_message'
let curUserId
let chatInfo

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
    addReLoginListener(callback) {
        this.on(RE_LOGIN_EVENT, callback)
    },
    addNewMessageListener(callback) {
        this.on(NEW_MESSAGE_EVENT, callback)
    },
    removeChangeListener(listener) {
        this.removeListener(CHANGE_EVENT, listener)
    },
    removeReLoginListener(listener) {
        this.removeListener(RE_LOGIN_EVENT, listener)
    },
    removeNewMessageListener(listener) {
        this.removeListener(NEW_MESSAGE_EVENT, listener)
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

        case ChatConstants.SEND_TEXT_MESSAGE:
            let {to, content, type} = action

            let convertMsg = conn.sendTextMessage({type, to, msg: content})
            console.log(convertMsg);

            MessageHelper.sendTextMessage(message, type, curUserId, to, convertMsg)

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

        case ChatConstants.SEND_AUDIO_MESSAGE:
            conn.sendPicture({
                file: action.audio, to: action.to
            })
            MessageHelper.sendAudioMessage(message, action.type, curUserId, action.to, action.audio)
            ChatStore.emit(CHANGE_EVENT)
            break

        case ChatConstants.FETCH_HISTORY_MESSAGE:
            let {user1, user2} = action
            chatService.fetchHistoryMessage(user1, user2)
            break

        case ChatConstants.LOGIN_OUT:
            util.removeSession('accessToken')
            conn.closeConn()
            break

        case ChatConstants.BEGIN_USER_CHAT:
            chatInfo = {id: action.name, type: ChatType.CHAT}
            MessageHelper.readMessage(message, action.name, ChatType.CHAT)
            chatService.fetchHistoryMessage(curUserId, action.name, 0).then(historyMessageList=> {
                let msg = MessageHelper.getMessageByName(message, action.name, ChatType.CHAT)
                msg.historyMessages = historyMessageList
                ChatStore.emit(CHANGE_EVENT)
            })
            ChatStore.emit(CHANGE_EVENT)
            break

        case ChatConstants.BEGIN_GROUP_CHAT:
            chatInfo = {id: action.roomId, type: ChatType.GROUP_CHAT}
            MessageHelper.readMessage(message, action.roomId, ChatType.GROUP_CHAT)
            conn.queryRoomMember(action.roomId).then(result=> {
                groupMembers = result.map(member=> {
                    let jid = member.jid;
                    let from = (jid.indexOf('_') + 1)
                    let to = jid.indexOf('@')
                    let name = jid.substring(from, to)
                    return {jid, name}
                })
                groupMembers.unshift({
                    jid: curUserId,
                    name: curUserId
                })
                ChatStore.emit(CHANGE_EVENT)
            })
            ChatStore.emit(CHANGE_EVENT)
            break

        default:
            break
    }
})

export default ChatStore

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

conn.onLoginSuccess((userId)=> {
    curUserId = userId
    if (userId == 'zxys') {
        fetchPatientListFromServer()
    } else if (userId == 'test0' || userId == 'test' || userId == 'test1') {
        fetchPatientListFromHuanXin()
        fetchGroupListFromHuanXin()
    } else {
        fetchPatientListFromServer()
        fetchGroupListFromHuanXin()
        fetchDoctorListFromServer()
    }
})

const onMessage = msg=> {
    let {type, from} = msg
    if (type == ChatType.CHAT) {
        MessageHelper.receiveMessage(message, type, from, msg)
    } else {
        MessageHelper.receiveMessage(message, type, from, msg)
    }
    if (chatInfo) {
        MessageHelper.readMessage(message, chatInfo.id, chatInfo.type)
    }

    ChatStore.emit(CHANGE_EVENT)
    ChatStore.emit(NEW_MESSAGE_EVENT)
}

conn.onTextMessage(onMessage)
conn.onEmotionMessage(onMessage)
conn.onPictureMessage(onMessage)
conn.onAudioMessage(onMessage)
conn.onClose(()=>ChatStore.emit(RE_LOGIN_EVENT))

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
        patientList = patients.map(patient=> {
            let name = patient['user_Name']
            let nickname = patient['patient_Name']
            initMessage({name, type: ChatType.CHAT})
            return {name, nickname}
        })
        ChatStore.emit(CHANGE_EVENT)
    })
}

function fetchDoctorListFromServer() {
    chatService.fetchDoctorList().then((doctors) => {
        doctorList = doctors.map(doctor=> {
            let name = doctor['user_Name']
            let nickname = doctor['doctor_Name']
            initMessage({name, type: ChatType.CHAT})
            return {name, nickname}
        })
        ChatStore.emit(CHANGE_EVENT)
    })
}
