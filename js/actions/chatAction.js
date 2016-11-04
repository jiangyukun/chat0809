/**
 * Created by jiangyukun on 2016/11/2.
 */
import actionConstants from './actionConstants'
import {ChatType} from '../constants/ChatConstants'
import util from '../components/core/util'

import chatService from '../services/chatService'
import * as conn from '../services/huanxinApi'

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

        conn.listRooms().then(rooms=> {
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

export function fetchDoctorListFromServer() {
    return dispatch=> {
        chatService.fetchDoctorList().then((result) => {
            let doctors = result.map(doctor=> {
                let name = doctor['user_Name']
                let nickname = doctor['doctor_Name']
                return {id: name, name: name, nickname}
            })
            dispatch({
                type: actionConstants.chat.INIT_DOCTOR_SUCCESS, doctors
            })

        }, ()=> {
            dispatch({
                type: actionConstants.chat.INIT_DOCTOR_FAILURE
            })
        })

        dispatch({
            type: actionConstants.chat.INIT_DOCTOR_START
        })

    }
}

export function startSingleChat(curUserId, single) {
    return dispatch=> {
        chatService.fetchHistoryMessage(curUserId, single.name).then(result=> {
            // console.log(result)
            dispatch({
                type: actionConstants.message.FETCH_HISTORY_MESSAGE_SUCCESS,
                currentSingle: single,
                historyMessages: result
            })
        })

        dispatch({
            type: actionConstants.chat.START_SINGLE_CHAT,
            currentSingle: single
        })
    }

}

export function startRoomChat(room) {

    return dispatch=> {

        conn.queryRoomMember(room.id).then(result=> {

            let groupMembers = result.map(member=> {
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
        })

        dispatch({
            type: actionConstants.chat.START_GROUP_CHAT,
            currentRoom: room
        })
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
    if (chatType == ChatType.CHAT) {
        let textContent = conn.sendTextMessage({type: chatType, to: to.name, msg: content})
        return {
            type: actionConstants.SEND_TEXT_MESSAGE,
            from,
            to: to.id,
            chatType,
            textContent
        }
    }

    let textContent = conn.sendTextMessage({type: chatType, to: to, msg: content})
    return {
        type: actionConstants.SEND_TEXT_MESSAGE,
        from,
        to,
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


 */
