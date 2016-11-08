/**
 * Created by jiangyukun on 2016/11/5.
 */

import actionConstants from '../actions/actionConstants'
import util from '../components/core/util'

export default ({dispatch, getState}) => next => action=> {
    try {
        return next(action)
    } finally {
        let state = getState()
        let curUserId = state.curUserId
        let key1 = curUserId + '-single-message'
        let key2 = curUserId + '-room-message'
        switch (action.type) {
            case actionConstants.LOGIN_SUCCESS:
                let previousSingleMessage = util.getSession(key1)
                if (previousSingleMessage && previousSingleMessage.length) {
                    state.singleMessage = previousSingleMessage
                }

                let previousRoomMessage = util.getSession(key2)
                if (previousRoomMessage && previousRoomMessage.length) {
                    state.roomMessage = previousRoomMessage
                }
                break

            case actionConstants.message.NEW_MSG:
            case actionConstants.chat.START_SINGLE_CHAT:
            case actionConstants.chat.START_GROUP_CHAT:
            case actionConstants.SEND_TEXT_MESSAGE:
            case actionConstants.message.SEND_IMAGE_MESSAGE_SUCCESS:
                if (state.singleMessage.length) {
                    util.setSession(key1, state.singleMessage)
                }
                if (state.roomMessage.length) {
                    util.setSession(key2, state.roomMessage)
                }
                break

            default:
                break
        }
    }
}
