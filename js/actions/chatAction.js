/**
 * Created by jiangyukun on 2016/11/2.
 */
import * as conn from '../services/huanxinApi'
import actionConstants from './actionConstants'
import util from '../components/core/util'

export function fetchPatientListFromHuanXin() {

    return dispatch=> {
        dispatch({
            type: actionConstants.chat.INIT_PATIENT_START
        })
        conn.getRoster().then((patients)=> {
            patients = patients.map(patient=> {
                return {
                    id: patient.jid,
                    name: patient.name
                }
            })
            dispatch({
                type: actionConstants.chat.INIT_PATIENT_SUCCESS,
                patients
            })
        })
    }
}

export function fetchGroupListFromHuanXin() {

    return dispatch=> {
        dispatch({
            type: actionConstants.chat.INIT_GROUP_START
        })
        conn.listRooms().then(rooms=> {
            dispatch({
                type: actionConstants.chat.INIT_GROUP_SUCCESS,
                rooms
            })
        })
    }
}

export function startSingleChat(single) {
    return {
        type: actionConstants.chat.START_SINGLE_CHAT,
        currentSingle: single
    }
}

export function startRoomChat(room) {
    return {
        type: actionConstants.chat.START_GROUP_CHAT,
        currentRoom: room
    }
}

export function readSingleMessage(single) {
    return {
        type: actionConstants.chat.READ_SINGLE_MESSAGE,
        single
    }
}

export function exitChatSystem() {
    util.removeSession('accessToken')
    conn.closeConn()
    return {
        type: actionConstants.EXIT_CHAT_SYSTEM
    }
}

export function sendTextMessage(from, to, chatType, content) {
    let textContent = conn.sendTextMessage({type: chatType, to: to.name, msg: content})
    return {
        type: actionConstants.SEND_TEXT_MESSAGE,
        from,
        to: to.id,
        chatType,
        textContent
    }
}

export function sendImageMessage() {

}

export function sendAudioMessage() {

}

// ------------------------------------------

/*

 export function exitChatSystem() {
 return {
 type: actionConstants.LOGIN_OUT
 }
 }

 export function sendTextMessage(to, chatType, content) {
 return {
 type: actionConstants.SEND_TEXT_MESSAGE, to, content, chatType
 }
 }

 export function readMessage(name, chatType) {
 return {
 type: actionConstants.READ_MESSAGE, name, chatType
 }
 }

 export function beginGroupChat(roomId) {
 return {
 type: actionConstants.BEGIN_GROUP_CHAT, roomId
 }
 }

 export function beginUserChat(name) {
 return {
 type: actionConstants.BEGIN_USER_CHAT, name
 }
 }

 export function sendImageMessage(to, chatType, image) {
 return {
 type: actionConstants.SEND_IMAGE_MESSAGE, to, chatType, image
 }
 }

 export function sendAudioMessage(to, chatType, audio) {
 return {
 type: actionConstants.SEND_AUDIO_MESSAGE, to, chatType, audio
 }
 }

 export function fetchHistoryMessage(user1, user2) {
 return {
 type: actionConstants.FETCH_HISTORY_MESSAGE, user1, user2
 }
 }
 */
