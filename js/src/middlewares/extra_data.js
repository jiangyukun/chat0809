/**
 * Created by jiangyukun on 2016/11/5.
 */

import actionConstants from '../actions/actionConstants'

export default ({dispatch, getState}) => next => action=> {


    const state = getState()
    switch (action.type) {
        case actionConstants.chat.INIT_PATIENT_SUCCESS:
        case actionConstants.chat.INIT_DOCTOR_SUCCESS:
            action.singleMessage = state.singleMessage
            break

        case actionConstants.chat.INIT_GROUP_SUCCESS:
            action.roomMessage = state.roomMessage
            break

        default:
            break

    }

    return next(action)
}
