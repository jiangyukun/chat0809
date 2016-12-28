/**
 * Created by jiangyukun on 2016/11/2.
 */
import {Map, List, fromJS} from 'immutable'

import {MessageType, ChatType} from '../constants/ChatConstants'
import actionConstants from '../actions/actionConstants'
import util from '../core/utils/util'
import webImUtil from '../core/utils/webImUtil'

let defaultState = []

export function singleMessage(state = defaultState, action) {
    const iState = fromJS(state)
    return nextState()

    function nextState() {
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

            case actionConstants.chat.HANDLE_CURRENT_CHAT:
                newIState = handleCurrentChat()
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
    }

    //-------------------------------------------------------------------

    function initPatientSuccess() {
        return iState.map(msg => msg.set('isStranger',
            action.patients.filter(patient => patient.name == msg.get('name')).length == 0)
        )
    }

    function initDoctorSuccess() {
        return iState.map(msg => msg.set('isStranger',
            action.doctors.filter(doctor => doctor.name == msg.get('name')).length == 0)
        )
    }

    function startSingleChat() {
        let {name} = action
        let matchMsg = iState.find(msg => msg.get('name') == name)
        if (!matchMsg) {
            return iState
        }
        return iState.update(iState.indexOf(matchMsg), msg => _readMsg(msg))
    }

    function sendTextMessage() {
        let curState = iState
        let {chatType, to, textContent, from} = action
        if (chatType != ChatType.CHAT) {
            return curState
        }
        curState = _update(curState, to, msg => _readMsg(msg))
        return _update(curState, to, msg => msg.update('reads', reads => reads.push(Map({
            id: util.getUID(), from, to, type: MessageType.TEXT, data: textContent, chatTime: util.now()
        }))))
    }

    function sendImageMessageSuccess() {
        let curState = iState
        let {from, to, chatType, url} = action
        if (chatType != ChatType.CHAT) {
            return curState
        }
        curState = _update(curState, to, msg => _readMsg(msg))
        return _update(curState, to, msg => msg.update('reads', reads => reads.push(Map({
            id: util.getUID(), from, to, type: MessageType.IMAGE, data: url, chatTime: util.now()
        }))))
    }

    function newMessage() {
        let {msg, patients, doctors} = action
        let curState = iState
        let {id, type, from, to} = msg
        if (type != ChatType.CHAT) {
            return curState
        }
        const {msgType, data} = webImUtil.handleMessage(msg)

        curState = _update(curState, from, msg => msg.update('unreads', unreads => unreads.push(Map({
            id, from, to, type: msgType, data, chatTime: util.now()
        }))))

        return _classifyNewMessage(curState, from, patients, doctors)
    }

    function handleCurrentChat() {
        let {chatType, selectedId} = action
        if (chatType != ChatType.CHAT) {
            return iState
        }
        let matchMsg = iState.find(msg => msg.get('name') == selectedId)
        if (!matchMsg) {
            return iState
        }
        return iState.update(iState.indexOf(matchMsg), msg => _readMsg(msg))
    }

    function exitChatSystem() {
        return fromJS(defaultState)
    }

    //-----------------------------------------------
    //inner function

    function _createMsg(iState, name) {
        return iState.push(Map({
            name: name,
            reads: List([]),
            unreads: List([]),
            isStranger: false
        }))
    }

    function _update(iState, name, callback) {
        let matchMsg = iState.find(msg => msg.get('name') == name)
        if (!matchMsg) {
            iState = _createMsg(iState, name)
            matchMsg = iState.find(msg => msg.get('name') == name)
        }
        if (!callback) {
            return iState
        }
        return iState.update(iState.indexOf(matchMsg), callback)
    }

    function _readMsg(msg) {
        let reads = msg.get('reads')
        msg.get('unreads').forEach(unread => {
            reads = reads.push(unread)
        })
        return msg.set('unreads', List([])).set('reads', reads)
    }

    function _classifyNewMessage(iState, from, patients, doctors) {
        return _update(iState, from, msg => msg.set('isStranger',
                patients.filter(patient => patient.name == msg.get('name')).length == 0 &&
                doctors.filter(doctor => doctor.name == msg.get('name')).length == 0
            )
        )
    }
}
