/**
 * Created by jiangyukun on 2016/11/2.
 */
import {Map, List, fromJS} from 'immutable'

import util from '../core/utils/util'
import {MessageType, ChatType} from '../constants/ChatConstants'
import actionConstants from '../actions/actionConstants'

let defaultState = []

export function roomMessage(state = defaultState, action) {
    const iState = fromJS(state)
    return nextState()

    function nextState() {
        let newIState = iState
        switch (action.type) {

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

    function startGroupChat() {
        let matchMsg = iState.find(msg => msg.get('id') == action.roomId)
        if (!matchMsg) {
            return iState
        }
        return iState.update(iState.indexOf(matchMsg), msg => _readMsg(msg))
    }

    function sendTextMessage() {
        let curState = iState
        const {chatType, to, textContent, from} = action
        if (chatType != ChatType.GROUP_CHAT) {
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
        if (chatType != ChatType.GROUP_CHAT) {
            return curState
        }
        curState = _update(curState, to, msg => _readMsg(msg))
        return _update(curState, to, msg => msg.update('reads', reads => reads.push(Map({
            id: util.getUID(), from, to, type: MessageType.IMAGE, data: url, chatTime: util.now()
        }))))
    }

    function newMessage() {
        let curState = iState
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
                let extension = filename.substr(filename.lastIndexOf('.') + 1)
                data = {
                    url: msg.url, type: extension
                }
                msgType = MessageType.AUDIO
            }
        }

        return _update(curState, to, msg => msg.update('unreads', unreads => unreads.push(Map({
            id, from, to, type: msgType, data: data, chatTime: util.now()
        }))))
    }

    function handleCurrentChat() {
        let {chatType, selectedId} = action
        if (chatType != ChatType.GROUP_CHAT) {
            return iState
        }
        let matchMsg = iState.find(msg => msg.get('id') == selectedId)
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

    function _createMsg(id) {
        return iState.push(Map({
            id: id,
            reads: List([]),
            unreads: List([])
        }))
    }

    function _update(iState, id, callback) {
        let matchMsg = iState.find(msg => msg.get('id') == id)
        if (!matchMsg) {
            iState = _createMsg(id)
            matchMsg = iState.find(msg => msg.get('id') == id)
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

}
