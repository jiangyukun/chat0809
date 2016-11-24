/**
 * Created by jiangyukun on 2016/11/4.
 */
import {fromJS, List, Map} from 'immutable'

import actionConstants from '../../actions/actionConstants'

const defaultIState = fromJS([])
export function patients(state = [], action) {
    const iState = fromJS(state)
    return handle()

    function handle() {
        let newIState = iState
        switch (action.type) {
            case actionConstants.chat.INIT_PATIENT_SUCCESS:
                newIState = initPatientSuccess()
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
    }

    //------------------------------------------------------

    function initPatientSuccess() {
        let {patients, singleMessage} = action
        let curState = fromJS(patients.map(patient => {
            return {
                id: patient.id,
                name: patient.name,
                nickname: patient.nickname
            }
        }))

        singleMessage.forEach(msg => {
            curState = _sort(curState, msg.name)
        })
        return curState
    }

    function newMessage() {
        let {from} = action.msg
        return _sort(iState, from)
    }

    function exitChatSystem() {
        return defaultIState
    }

    //-----------------------------------------

    function _sort(curState, name) {
        let patient = curState.find(patient => patient.get('name') == name)
        if (!patient) {
            return curState
        }
        let index = curState.indexOf(patient)
        if (index == 0) {
            return curState
        }
        return curState.splice(index, 1).unshift(patient)
    }

}
