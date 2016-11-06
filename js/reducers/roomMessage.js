/**
 * Created by jiangyukun on 2016/11/2.
 */
import {Map, List, fromJS} from 'immutable'

import util from '../components/core/util'
import {MessageType, ChatType} from '../constants/ChatConstants'
import actionConstants from '../actions/actionConstants'

let defaultState = []

export function roomMessage(state = defaultState, action) {

    let iState = fromJS(state)
    let newIState = iState
    switch (action.type) {

        case actionConstants.chat.INIT_GROUP_SUCCESS:
            newIState = initGroupSuccess()
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

    function initGroupSuccess() {
        return iState.map((msg=> msg.set('notStranger', action.rooms.filter(room=>room.id == msg.get('id')).length > 0)))
    }

    function startGroupChat() {
        let matchMsg = iState.find(msg=>msg.get('id') == action.currentRoom.id)
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
        if (chatType != ChatType.GROUP_CHAT) {
            return iState
        }
        let matchMsg = iState.find(msg=>msg.get('id') == to)
        if (!matchMsg) {
            return _createMsg(to)
        }
        return iState.update(iState.indexOf(matchMsg), msg=> msg.update('reads', reads=>reads.push(Map({
            id: util.getUID(), from, to, type: MessageType.TEXT, data: textContent, chatTime: util.now()
        }))))
    }

    function sendImageMessageSuccess() {
        let {from, to, chatType, url} = action
        if (chatType != ChatType.GROUP_CHAT) {
            return iState
        }
    }

    function newMessage() {
        let msg = action.msg
        let {id, type, from, to} = msg
        if (type != ChatType.GROUP_CHAT) {
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

        let matchMsg = iState.find(msg=>msg.get('id') == to)
        return iState.update(iState.indexOf(matchMsg), msg=>msg.update('unreads', unreads=>unreads.push(Map({
            id, from, to, type: msgType, data: data, newMessage: true, chatTime: util.now()
        }))))
    }

    function exitChatSystem() {
        return fromJS(defaultState)
    }

    function _createMsg(id) {
        return iState.push(Map({
            id: id,
            reads: [],
            unreads: [],
            historyMessages: []
        }))
    }
}
