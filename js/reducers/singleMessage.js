/**
 * Created by jiangyukun on 2016/11/2.
 */
import {Map, List, fromJS} from 'immutable'

import util from '../components/core/util'
import {MessageType, ChatType} from '../constants/ChatConstants'
import actionConstants from '../actions/actionConstants'

let defaultState = []

export function singleMessage(state = defaultState, action) {
    let iState = fromJS(state)
    let newIState = iState
    switch (action.type) {
        case actionConstants.chat.INIT_PATIENT_SUCCESS:
            newIState = initPatientSuccess()
            break

        case actionConstants.chat.INIT_DOCTOR_SUCCESS:
            newIState = initDoctorSuccess()
            break

        case actionConstants.chat.START_SINGLE_CHAT:
            newIState = startSingleChat()
            break

        case actionConstants.SEND_TEXT_MESSAGE:
            newIState = sendTextMessage()
            break

        case actionConstants.message.SEND_IMAGE_MESSAGE_SUCCESS:
            newIState = sendImageMessageSuccess()
            break

        case actionConstants.message.NEW_MSG:
            newIState = newMessage()
            break

        case actionConstants.message.FETCH_HISTORY_MESSAGE_SUCCESS:
            newIState = fetchHistoryMessageSuccess()
            break

        case actionConstants.EXIT_CHAT_SYSTEM:
            newIState = exitChatSystem()
            break

        default:
            break
    }
    if (newIState == iState) {
        return state
    }

    return newIState.toJS()

    //-------------------------------------------------------------------

    function initPatientSuccess() {
        return iState.map(msg=> msg.set('notStranger',
            action.patients.filter(patient=>patient.name == msg.get('name')).length > 0)
        )
    }

    function initDoctorSuccess() {
        return iState.map(msg=> msg.set('notStranger',
            action.doctors.filter(doctor=>doctor.name == msg.get('name')).length > 0)
        )
    }

    function startSingleChat() {
        let matchMsg = iState.find(msg=>msg.get('name') == action.currentSingle.name)
        if (!matchMsg) {
            return iState
        }

        return iState.update(iState.indexOf(matchMsg), msg=> {
            let reads = msg.get('reads')
            msg.get('unreads').forEach(unread=> {
                reads = reads.push(unread)
            })
            return msg.set('unreads', List([])).set('reads', reads)
        })
    }

    function sendTextMessage() {
        let {chatType, to, textContent, from} = action
        if (chatType != ChatType.CHAT) {
            return iState
        }
        let matchMsg = iState.find(msg=>msg.get('name') == to)
        if (!matchMsg) {
            return iState.push(Map({
                name: to,
                reads: [],
                unreads: [],
                historyMessages: []
            }))
        }
        return iState.update(iState.indexOf(matchMsg), msg=> msg.update('reads', reads=>reads.push(Map({
            id: util.getUID(), from, to, type: MessageType.TEXT, data: textContent, chatTime: util.now()
        }))))
    }

    function sendImageMessageSuccess() {
        let {from, to, chatType, url} = action
        if (chatType != ChatType.CHAT) {
            return iState
        }
        let matchMsg = iState.find(msg=>msg.get('name') == to)
        if (!matchMsg) {
            return iState.push(Map({
                name: to,
                reads: [],
                unreads: [],
                historyMessages: []
            }))
        }
        return iState.update(iState.indexOf(matchMsg), msg=>msg.update('reads', reads=>reads.push(Map({
            id: util.getUID(), from, to, type: MessageType.IMAGE, data: url, chatTime: util.now()
        }))))
    }

    function newMessage() {
        let msg = action.msg
        let {id, type, from, to} = msg
        if (type != 'chatroom') {
            return iState
        }
        let msgType = MessageType.TEXT
        let data = msg.data
        if (msg.hasOwnProperty('thumb')) {
            data = msg.url
            msgType = MessageType.IMAGE
        } else if (msg.hasOwnProperty('filename')) {
            let filename = msg.filename
            if (filename == 'audio' || filename.indexOf('.amr') != -1 || filename.indexOf('.mp3') != -1) {
                var extension = filename.substr(filename.lastIndexOf('.') + 1)
                data = {
                    url: msg.url, type: extension
                }
                msgType = MessageType.AUDIO
            }
        }

        let matchMsg = iState.find(msg=>msg.get('name') == from)
        if (matchMsg) {
            return iState.update(iState.indexOf(matchMsg), msg=> msg.update('unreads', unreads=> unreads.push(Map({
                id, from, to, type: msgType, data: data, newMessage: true, chatTime: util.now()
            }))))
        }
        return iState.push(Map({
            name: from, reads: [], historyMessages: [],
            unreads: [{id, from, to, type: msgType, data: data, chatTime: util.now(), newMessage: true}]
        }))
    }

    function fetchHistoryMessageSuccess() {
        let {currentSingle, historyMessages} = action
        let matchMsg = iState.find(msg=>msg.get('name') == currentSingle.name)
        if (!matchMsg) {
            return iState.push(Map({
                name: currentSingle.name,
                reads: [],
                unreads: [],
                historyMessages: historyMessages
            }))
        }
        return iState.update(iState.indexOf(matchMsg), msg=>msg.update('historyMessages', ()=>List(historyMessages)))
    }

    function exitChatSystem() {
        return fromJS(defaultState)
    }
}
