/**
 * Created by jiangyukun on 2016/11/2.
 */
import actionConstants from './actionConstants'
import {ChatType} from '../constants/ChatConstants'
import util from '../core/utils/util'
import busHelper from '../core/busHelper'

import chatService from '../services/chatService'
import * as conn from '../services/huanxinApi'

export function fetchPatientListFromHuanXin() {
    return dispatch => {
        conn.getRoster().then((patients) => {
            patients = patients.map(patient => {
                return {
                    id: patient.jid,
                    name: patient.name,
                    nickname: busHelper.getDisplayName(patient.name)
                }
            })
            dispatch({
                type: actionConstants.chat.INIT_PATIENT_SUCCESS, patients
            })
        })

        dispatch({
            type: actionConstants.chat.INIT_PATIENT_START
        })
    }
}

export let fetchPatientListFromServer = dispatch => () => {
    dispatch({
        type: actionConstants.chat.INIT_PATIENT_START
    })
    return new Promise((resolve, reject) => {
        chatService.fetchPatientList().then((result) => {
            let patients = result.map(patient => {
                let name = patient['user_Name']
                let nickname = busHelper.getDisplayName(patient['patient_Name'])
                return {
                    id: name, name, nickname
                }
            })
            dispatch({
                type: actionConstants.chat.INIT_PATIENT_SUCCESS, patients
            })
        }, () => {
            dispatch({
                type: actionConstants.chat.INIT_PATIENT_FAILURE
            })
        })
    })
}

export function fetchGroupListFromHuanXin() {
    return dispatch => {
        conn.listRooms().then(result => {
            let rooms = result.map(room => {
                return {
                    id: room.roomId,
                    name: room.name
                }
            })
            dispatch({
                type: actionConstants.chat.INIT_GROUP_SUCCESS,
                rooms
            })
        })

        dispatch({
            type: actionConstants.chat.INIT_GROUP_START
        })
    }
}

export let fetchDoctorListFromServer = dispatch => () => {
    dispatch({
        type: actionConstants.chat.INIT_DOCTOR_START
    })
    return new Promise((resolve, reject) => {
        chatService.fetchDoctorList().then((result) => {
            let doctors = result.map(doctor => {
                let name = doctor['user_Name'] || ''
                let nickname = doctor['doctor_Name'] || ''
                return {id: name, name: name, nickname}
            })
            dispatch({
                type: actionConstants.chat.INIT_DOCTOR_SUCCESS, doctors
            })
        }, err => reject(err))
    })
}

export let startSingleChat = dispatch => (from, to, isSort) => {
    dispatch({
        type: actionConstants.chat.START_SINGLE_CHAT,
        name: to, isSort
    })
    return new Promise((resolve, reject) => {
        chatService.fetchHistoryMessage(from, to).then(result => {
            dispatch({
                type: actionConstants.message.FETCH_HISTORY_MESSAGE_SUCCESS,
                historyMessages: result
            })
        }, err => {
            reject(err)
        })
    })
}

export function startRoomChat(roomId, isSort) {
    return dispatch => {
        conn.queryRoomMember(roomId).then(result => {
            let groupMembers = result.map(member => {
                let jid = member.jid;
                let from = (jid.indexOf('_') + 1)
                let to = jid.indexOf('@')
                let name = jid.substring(from, to)
                return {jid, name}
            })

            dispatch({
                type: actionConstants.chat.FETCH_GROUP_MEMBER_SUCCESS,
                members: groupMembers
            })
        }, error => {
            console.log(error)
        })

        dispatch({
            type: actionConstants.chat.START_GROUP_CHAT,
            roomId, isSort
        })
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
    if (chatType == ChatType.CHAT) {
        let textContent = conn.sendTextMessage({type: chatType, to: to, txt: content})
        return {
            type: actionConstants.SEND_TEXT_MESSAGE,
            from,
            to,
            chatType,
            textContent: content
        }
    }

    conn.sendTextMessage({type: chatType, to: to, txt: content})
    return {
        type: actionConstants.SEND_TEXT_MESSAGE,
        from,
        to,
        chatType,
        textContent: content
    }
}

export function sendImageMessage(from, to, chatType, fileInput) {
    return dispatch => {
        conn.sendPicture(to, chatType, fileInput).then(url => {
            dispatch({
                type: actionConstants.message.SEND_IMAGE_MESSAGE_SUCCESS,
                from,
                to,
                chatType,
                url
            })
        }, error => {
            console.log(error)
            dispatch({
                type: actionConstants.message.SEND_IMAGE_MESSAGE_FAILURE,
                chatType,
                error
            })
        })

        dispatch({
            type: actionConstants.message.SEND_IMAGE_MESSAGE,
            from,
            to,
            chatType,
            fileInput
        })
    }
}

export function newMessageHinted() {
    return {
        type: actionConstants.chat.NEW_MESSAGE_HINT_COMPLETE
    }
}

export function handleCurrentChat(chatType, selectedId) {
    return {
        type: actionConstants.chat.HANDLE_CURRENT_CHAT,
        chatType, selectedId
    }
}

export function sendAudioMessage() {

}
