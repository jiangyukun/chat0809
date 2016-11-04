/**
 * Created by jiangyukun on 2016/11/2.
 */
import {Map, List, fromJS} from 'immutable'

import util from '../components/core/util'
import {MessageType, ChatType} from '../constants/ChatConstants'
import actionConstants from '../actions/actionConstants'

export function message(state = {singles: [], groups: []}, action) {
    switch (action.type) {
        case actionConstants.chat.INIT_PATIENT_SUCCESS:
            return initPatientSuccess()

        case actionConstants.chat.INIT_GROUP_SUCCESS:
            return initGroupSuccess()

        case actionConstants.chat.INIT_DOCTOR_SUCCESS:
            return initDoctorSuccess()

        case actionConstants.chat.START_SINGLE_CHAT:
            return startSingleChat()

        case actionConstants.chat.START_GROUP_CHAT:
            return startGroupChat()

        case actionConstants.SEND_TEXT_MESSAGE:
            return sendTextMessage()

        case actionConstants.message.NEW_MSG:
            return newMessage()

        case actionConstants.message.FETCH_HISTORY_MESSAGE_SUCCESS:
            return fetchHistoryMessageSuccess()

        default:
            return state
    }

    //-------------------------------------------------------------------

    function initPatientSuccess() {
        let iState = fromJS(state)
        action.patients.forEach(patient=> {
            iState = iState.update('singles', singles=> {
                if (singles.find(single=>single.get('id') == patient.id)) {
                    return singles
                }
                return singles.push(Map({
                    id: patient.id,
                    name: patient.name,
                    reads: [],
                    unreads: [],
                    historyMessages: [],
                    mark: false
                }))
            })
        })
        return iState.toJS()
    }

    function initGroupSuccess() {
        let iState = fromJS(state)

        action.rooms.forEach(room=> {
            iState = iState.update('groups', groups=> {
                if (groups.find(group=>group.get('id') == room.roomId)) {
                    return groups
                }
                return groups.push(Map({
                    id: room.roomId,
                    reads: [],
                    unreads: [],
                    historyMessages: []
                }))
            })
        })
        return iState.toJS()
    }

    function initDoctorSuccess() {
        let iState = fromJS(state)

        action.doctors.forEach(doctor=> {
            iState = iState.update('singles', singles=> {
                if (singles.find(single=>single.get('id') == doctor.id)) {
                    return singles
                }
                return singles.push(Map({
                    id: doctor.id,
                    name: doctor.name,
                    reads: [],
                    unreads: [],
                    historyMessages: []
                }))
            })
        })
        return iState.toJS()
    }

    function startSingleChat() {
        return fromJS(state).update('singles', singles=> {
            let single = singles.find(iSingle=>iSingle.get('id') == action.currentSingle.id)
            return singles.update(singles.indexOf(single), single=> {
                return single.set('unreads', List([])).set('reads', single.get('reads').merge(single.get('unreads')))
            })
        }).toJS()
    }

    function startGroupChat() {
        return fromJS(state).update('groups', groups=> {
            let group = groups.find(group=>group.get('id') == action.currentRoom.id)
            return groups.update(groups.indexOf(group), group=> {
                return group.set('unreads', List([])).set('reads', group.get('reads').merge(group.get('unreads')))
            })
        }).toJS()
    }

    function sendTextMessage() {
        let {chatType, to, textContent, from} = action
        if (chatType == ChatType.CHAT) {
            return fromJS(state).update('singles', singles=> {
                let single = singles.find(single=>single.get('id') == to)
                return singles.update(singles.indexOf(single), single=> single.update('reads', reads=>reads.push(Map({
                    id: util.getUID(), from, to, type: MessageType.TEXT, data: textContent, chatTime: util.now(), newMessage: false
                }))))
            }).toJS()
        }
        return fromJS(state).update('groups', groups=> {
            let group = groups.find(groups=>groups.get('id') == to)
            return groups.update(groups.indexOf(group), group=> group.update('reads', reads=>reads.push(Map({
                id: util.getUID(), from, to, type: MessageType.TEXT, data: textContent, chatTime: util.now(), newMessage: false
            }))))
        }).toJS()
    }

    function newMessage() {
        let msg = action.msg, data
        let {id, type, from, to} = msg
        let msgType = MessageType.TEXT
        data = msg.data
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

        if (type == ChatType.CHAT) {
            return fromJS(state).update('singles', singles=> {
                let single = singles.find(single=>single.get('name') == from)
                if (single) {
                    return singles.update(singles.indexOf(single), single=> single.update('unreads', unreads=> unreads.push(Map({
                        id, from, to, type: msgType, data: data, newMessage: true, chatTime: util.now()
                    }))))
                }
                return singles.push(Map({
                    id: from, reads: [], historyMessages: [], mark: false,
                    unreads: [{id, from, to, type: msgType, data: data, chatTime: util.now(), newMessage: true}]
                }))
            }).toJS()
        }
        return fromJS(state).update('groups', groups=> {
            let group = groups.find(group=>group.get('id') == to)
            return groups.update(groups.indexOf(group), group=>group.update('unreads', unreads=>unreads.push(Map({
                id, from, to, type: msgType, data: data, newMessage: true, chatTime: util.now()
            }))))
        }).toJS()
    }

    function fetchHistoryMessageSuccess() {
        let {currentSingle, historyMessages} = action
        let iState = fromJS(state).update('singles', singles=> {
            let single = singles.find(single=>single.get('name') == currentSingle.name)
            return singles.update(singles.indexOf(single), single=>single.update('historyMessages', ()=>List(historyMessages)))
        })
        return iState.toJS()
    }
}
