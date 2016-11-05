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
        let key = curUserId + '-message'
        switch (action.type) {
            case actionConstants.LOGIN_SUCCESS:
                let previousMessage = util.getSession(key)
                if (previousMessage) {
                    state.message = previousMessage
                }
                break

            case actionConstants.message.NEW_MSG:
            case actionConstants.chat.START_SINGLE_CHAT:
            case actionConstants.chat.START_GROUP_CHAT:
            case actionConstants.message.SEND_IMAGE_MESSAGE_SUCCESS:
                util.setSession(key, state.message)
                break

            default:
                break
        }
    }
}
