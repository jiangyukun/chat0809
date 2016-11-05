/**
 * Created by jiangyukun on 2016/11/2.
 */
import {fromJS} from 'immutable'

import actionConstants from '../actions/actionConstants'

export function groupMembers(state = [], action) {

    switch (action.type) {
        case actionConstants.chat.FETCH_GROUP_MEMBER_SUCCESS:
            return action.members

        default:
            return state
    }

}

let defaultState = {newMessage: false}

export function chat(state = defaultState, action) {
    switch (action.type) {

        case actionConstants.message.NEW_MSG:
            return newMessage()

        case actionConstants.chat.NEW_MESSAGE_HINT_COMPLETE:
            return newMessageHintComplete()

        case actionConstants.EXIT_CHAT_SYSTEM:
            return exitChatSystem()

        default:
            return state
    }

    function newMessage() {
        return fromJS(state).set('newMessage', true).toJS()
    }

    function newMessageHintComplete() {
        return fromJS(state).set('newMessage', false).toJS()
    }

    function exitChatSystem() {
        return defaultState
    }
}
