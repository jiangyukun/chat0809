/**
 * Created by jiangyukun on 2016/11/2.
 */
import {merge} from 'lodash'
import moment from 'moment'
import Immutable from 'immutable'

import {MessageType, ChatType} from '../constants/ChatConstants'
import actionConstants from '../actions/actionConstants'

let defaultState = Immutable.fromJS({singles: [], groups: []})
export function message(state = defaultState, action) {
    switch (action.type) {
        case actionConstants.chat.INIT_PATIENT_SUCCESS:
            return initPatientSuccess()

        case actionConstants.chat.INIT_GROUP_SUCCESS:
            return initGroupSuccess()

        case actionConstants.chat.START_SINGLE_CHAT:
            return startSingleChat()

        case actionConstants.chat.READ_SINGLE_MESSAGE:
            return readSingleMessage()

        case actionConstants.SEND_TEXT_MESSAGE:
            return sendTextMessage()

        case actionConstants.message.NEW_SINGLE_MSG:
            return newSingleMessage()

        case actionConstants.message.NEW_GROUP_MSG:

            return state

        default:
            return state
    }

    //-------------------------------------------------------------------

    function initPatientSuccess() {
        let patients = action.patients
        patients.forEach(patient=> {
            let r = state.get('singles').filter(single=> {
                return single.get('id') == patient.id
            })
            if (!r.size) {
                let newSingles = state.get('singles').push(Immutable.Map({
                    id: patient.id,
                    name: patient.name,
                    reads: [],
                    unreads: [],
                    historyMessages: [],
                    mark: false
                }))
                state = state.set('singles', newSingles)
            }
        })
        return state
    }

    function initGroupSuccess() {
        let rooms = action.rooms

        let groups = state.groups.map(room=>room)
        rooms.forEach(room=> {
            let match = state.groups.filter(group=>group.id == room.roomId)
            if (match.length == 0) {
                groups.push({
                    id: room.roomId,
                    name: room.name,
                    reads: [],
                    unreads: [],
                    historyMessages: []
                })
            }
        })
        return merge({}, state, {groups})
    }

    function startSingleChat() {
        let currentSingle = action.currentSingle

        let singles = state.singles.map(single=> {
            if (single.id == currentSingle.id) {
                let reads = []
                let unreads = single.unreads.map(unread=>unread)
                Array.prototype.push.apply(unreads, reads)
                return merge({}, single, {reads, unreads})
            }
            return single
        })
        return merge({}, state, {singles})
    }

    function readSingleMessage() {
        let currentSingle = action.single

        let singles = state.singles.map(single=> {
            if (single.id == currentSingle.id) {
                let reads = single.reads.map(read=>read)
                Array.prototype.push(reads, single.unreads)
                let r = merge({}, single, {reads})
                r.unreads = []
                return merge(r)
            }
            return single
        })
        console.log(state)
        // console.log(merge({}, state, {singles}));
        return state
    }

    function sendTextMessage() {
        let {chatType, to, textContent, from} = action
        if (chatType == ChatType.CHAT) {
            let match = state.singles.filter(single=>single.id == to)[0]
            let reads = match.reads.map(single=>single)
            reads.push({
                from, to,
                type: MessageType.TEXT,
                data: textContent,
                chatTime: moment().format('MM-DD HH:mm')
            })
            let singles = state.singles.map(single=> {
                if (single.id == to) {
                    return merge({}, single, {reads})
                }
                return single
            })
            return merge({}, state, {singles})
        }
    }

    function newSingleMessage() {
        let msg = action.msg, data
        let {type, from, to} = msg


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
            let match = state.singles.filter(single=>single.name == from)
            if (match.length == 0) {
                let singles = state.singles.map(single=>single)
                singles.push({
                    id: from,
                    name: from,
                    reads: [],
                    unreads: [{
                        from, to,
                        type: msgType,
                        data: data,
                        chatTime: moment().format('MM-DD HH:mm')
                    }],
                    historyMessages: [],
                    mark: false
                })
                return merge({}, state, {singles})
            } else {
                let singles = state.singles.map(single=> {
                    if (single.name == from) {
                        let unreads = single.unreads.map(unread=>unread)
                        unreads.push({
                            from, to,
                            type: msgType,
                            data: data,
                            chatTime: moment().format('MM-DD HH:mm')
                        })
                        return merge({}, single, {unreads})
                    }
                    return single
                })
                return merge({}, state, {singles})
            }
        } else {
            let room = state.groups.filter(group=>group.id == from)[0]

        }

    }
}
