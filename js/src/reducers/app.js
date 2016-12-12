/**
 * Created by jiangyukun on 2016/11/2.
 */
import {fromJS} from 'immutable'

import actionConstants from '../actions/actionConstants'

let defaultState = {
    autoLogin: false,
    connClosed: false,
    username: '',
    newMessage: false,
    from: '',
    to: '',
    chatType: null,
}

export function app(state = defaultState, action) {
    const iState = fromJS(state)
    return handle()

    function handle() {
        let nextIState = iState
        switch (action.type) {
            case actionConstants.app.INIT_SYSTEM:
                nextIState = initSystem()
                break

            case actionConstants.app.AUTO_LOGIN:
                nextIState = autoLogin()
                break

            case actionConstants.LOGIN_SUCCESS:
                nextIState = loginSuccess()
                break

            case actionConstants.message.NEW_MSG:
                nextIState = newMessage()
                break

            case actionConstants.chat.NEW_MESSAGE_HINT_COMPLETE:
                nextIState = newMessageHintComplete()
                break

            case actionConstants.EXIT_CHAT_SYSTEM:
                nextIState = exitChatSystem()
                break

            case actionConstants.CONN_CLOSED:
                nextIState = connClosed()
                break


            default:
                break
        }
        if (nextIState == iState) {
            return state
        }
        return nextIState.toJS()
    }

    //-----------------------------------------

    function initSystem() {
        let {username} = action
        return iState.set('username', username)
    }

    function autoLogin() {
        let {username} = action
        return iState.set('autoLogin', true).set('username', username)
    }

    function loginSuccess() {
        return iState.set('autoLogin', false).set('connClosed', false)
    }

    function newMessage() {
        let curState = iState
        let {type, from, to} = action.msg

        return curState.set('newMessage', true).set('chatType', type).set('from', from).set('to', to)
    }

    function newMessageHintComplete() {
        return iState.set('newMessage', false)
    }

    function exitChatSystem() {
        return fromJS(defaultState).set('connClosed', false)
    }

    function connClosed() {
        return iState.set('connClosed', true)
    }
}
