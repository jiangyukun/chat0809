/**
 * Created by jiangyukun on 2016/11/2.
 */
import {Map, List, fromJS} from 'immutable'

import util from '../components/core/util'
import {MessageType, ChatType} from '../constants/ChatConstants'
import actionConstants from '../actions/actionConstants'

let defaultState = {singles: [], groups: []}

export function message(state = defaultState, action) {
    let iState = fromJS(state)
    let newIState = iState
    switch (action.type) {
        case actionConstants.chat.INIT_PATIENT_SUCCESS:
            newIState = initPatientSuccess()
            break

        case actionConstants.chat.INIT_GROUP_SUCCESS:
            newIState = initGroupSuccess()
            break

        case actionConstants.chat.INIT_DOCTOR_SUCCESS:
            newIState = initDoctorSuccess()
            break

        case actionConstants.chat.START_SINGLE_CHAT:
            newIState = startSingleChat()
            break

        case actionConstants.chat.START_GROUP_CHAT:
            newIState = startGroupChat()
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
        return iState.update('singles', singles=>singles.map(single=> single.set('notStranger',
            action.patients.filter(patient=>patient.name == single.get('name')).length > 0)
        ))
    }

    function initGroupSuccess() {
        return iState.update('groups', groups=>groups.map(group=> group.set('notStranger',
            action.rooms.filter(room=>room.id == group.get('id')).length > 0)
        ))
    }

    function initDoctorSuccess() {
        return iState.update('singles', singles=>singles.map(single=> single.set('notStranger',
            action.doctors.filter(doctor=>doctor.name == single.get('name')).length > 0)
        ))
    }

    function startSingleChat() {
        return iState.update('singles', singles=> {
            let single = singles.find(iSingle=>iSingle.get('name') == action.currentSingle.name)
            return singles.update(singles.indexOf(single), single=> {
                let reads = single.get('reads')
                single.get('unreads').forEach(unread=> {
                    reads = reads.push(unread)
                })
                return single.set('unreads', List([])).set('reads', reads)
            })
        })
    }

    function startGroupChat() {
        return iState.update('groups', groups=> {
            let group = groups.find(group=>group.get('id') == action.currentRoom.id)
            return groups.update(groups.indexOf(group), group=> {
                return group.set('unreads', List([])).set('reads', group.get('reads').merge(group.get('unreads')))
            })
        })
    }

    function sendTextMessage() {
        let {chatType, to, textContent, from} = action
        if (chatType == ChatType.CHAT) {
            return iState.update('singles', singles=> {
                let single = singles.find(single=>single.get('name') == to)
                return singles.update(singles.indexOf(single), single=> single.update('reads', reads=>reads.push(Map({
                    id: util.getUID(), from, to, type: MessageType.TEXT, data: textContent, chatTime: util.now()
                }))))
            })
        }
        return iState.update('groups', groups=> {
            let group = groups.find(groups=>groups.get('id') == to)
            return groups.update(groups.indexOf(group), group=> group.update('reads', reads=>reads.push(Map({
                id: util.getUID(), from, to, type: MessageType.TEXT, data: textContent, chatTime: util.now()
            }))))
        })
    }

    function sendImageMessageSuccess() {
        let {from, to, chatType, url} = action
        if (chatType == ChatType.CHAT) {
            return iState.update('singles', singles=> {
                let single = singles.find(single=>single.get('name') == to)
                return singles.update(singles.indexOf(single), single=>single.update('reads', reads=>reads.push(Map({
                    id: util.getUID(), from, to, type: MessageType.IMAGE, data: url, chatTime: util.now()
                }))))
            })
        }
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
            return iState.update('singles', singles=> {
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
            })
        }
        return iState.update('groups', groups=> {
            let group = groups.find(group=>group.get('id') == to)
            return groups.update(groups.indexOf(group), group=>group.update('unreads', unreads=>unreads.push(Map({
                id, from, to, type: msgType, data: data, newMessage: true, chatTime: util.now()
            }))))
        })
    }

    function fetchHistoryMessageSuccess() {
        let {currentSingle, historyMessages} = action
        return iState.update('singles', singles=> {
            let single = singles.find(single=>single.get('name') == currentSingle.name)
            return singles.update(singles.indexOf(single), single=>single.update('historyMessages', ()=>List(historyMessages)))
        })
    }

    function exitChatSystem() {
        return fromJS(defaultState)
    }
}
