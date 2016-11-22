/**
 * Created by jiangyukun on 2016/11/11.
 */
import {fromJS, Map, List} from 'immutable'

import actionConstants from '../actions/actionConstants'
import {ChatType} from '../constants/ChatConstants'

let defaultState = [], defaultIState = fromJS(defaultState)

export default function chatList(state = defaultState, action) {
    let iState = fromJS(state)

    return nextState()

    function nextState() {
        let nextIState = iState
        switch (action.type) {
            case actionConstants.chat.START_SINGLE_CHAT:
                nextIState = startSingleChat()
                break

            case actionConstants.chat.START_GROUP_CHAT:
                nextIState = startGroupChat()
                break

            case actionConstants.message.NEW_MSG:
                nextIState = newMessage()
                break

            case actionConstants.EXIT_CHAT_SYSTEM:
                nextIState = exitChatSystem()
                break

            default:
                break
        }

        if (nextIState == iState) {
            return state
        }
        return nextIState.toJS()
    }

    //--------------------------------------

    function startSingleChat() {
        let {name, isSort} = action
        if (!isSort && iState.find(chat => chat.get('id') == name)) {
            return iState
        }
        return _sort(iState, name, ChatType.CHAT)
    }

    function startGroupChat() {
        let {roomId, isSort} = action
        if (!isSort && iState.find(chat => chat.get('id') == roomId)) {
            return iState
        }
        return _sort(iState, roomId, ChatType.GROUP_CHAT)
    }

    function newMessage() {
        let {from, to, type} = action.msg
        if (type == ChatType.CHAT) {
            return _sort(iState, from, type)
        }
        return _sort(iState, to, type)
    }

    function exitChatSystem() {
        return defaultIState
    }

    // ------------------------------------------

    function _createMsg(curState, id, chatType) {
        return curState.push(Map({
            id,
            chatType,
            txt: ''
        }))
    }

    function _sort(curState, id, chatType) {
        let chat = curState.find(chat => chat.get('id') == id)
        if (!chat) {
            curState = _update(curState, id, chatType)
            chat = curState.find(chat => chat.get('id') == id)
        }
        let index = curState.indexOf(chat)
        if (index == 0) {
            return curState
        }
        return curState.splice(index, 1).unshift(chat)
    }

    function _update(curState, id, chatType, callback) {
        let matchChat = curState.find(chat => chat.get('id') == id)
        if (!matchChat) {
            curState = _createMsg(curState, id, chatType)
            matchChat = curState.find(msg => msg.get('id') == id)
        }
        if (!callback) {
            return curState
        }
        return curState.update(curState.indexOf(matchChat), callback)
    }
}
