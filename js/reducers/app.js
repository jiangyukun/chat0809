/**
 * Created by jiangyukun on 2016/11/2.
 */
import {fromJS} from 'immutable'

import actionConstants from '../actions/actionConstants'

let defaultState = {
    newMessage: false,
    from: '',
    to: '',
    chatType: null,

    patientInit: false,
    roomInit: false,
    doctorInit: false
}

export function app(state = defaultState, action) {
    const iState = fromJS(state)
    return handle()

    function handle() {
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

            case actionConstants.message.NEW_MSG:
                newIState = newMessage()
                break

            case actionConstants.chat.NEW_MESSAGE_HINT_COMPLETE:
                newIState = newMessageHintComplete()
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

    //-----------------------------------------

    function initPatientSuccess() {
        return iState.set('patientInit', true)
    }

    function initGroupSuccess() {
        return iState.set('roomInit', true)
    }

    function initDoctorSuccess() {
        return iState.set('doctorInit', true)
    }

    function newMessage() {
        let curState = iState
        let {id, type, from, to} = action.msg

        return curState.set('newMessage', true).set('chatType', type).set('from', from).set('to', to)
    }

    function newMessageHintComplete() {
        return iState.set('newMessage', false)
    }

    function exitChatSystem() {
        return fromJS(defaultState)
    }
}
