/**
 * Created by jiangyukun on 2016/11/4.
 */
import {fromJS, List, Map} from 'immutable'

import actionConstants from '../../actions/actionConstants'

export function patients(state = [], action) {
    const iState = fromJS(state)
    return handle()

    function handle() {
        let newIState = iState
        switch (action.type) {
            case actionConstants.chat.INIT_PATIENT_SUCCESS:
                newIState = initPatientSuccess()
                break

            case actionConstants.app.SORT_PATIENT_LIST:
                newIState = sortPatientList()
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
        let patients = action.patients
        return List(patients.map(patient=> {
            return {
                id: patient.id,
                name: patient.name,
                nickname: patient.name
            }
        }))
    }

    function newMessage() {
        let {from} = action.msg
        return _sort(iState, from)
    }

    function sortPatientList() {
        let curState = iState
        let {singleMessage} = action
        singleMessage.forEach(msg=> {
            curState = _sort(curState, msg.name)
        })
        return curState
    }

    function exitChatSystem() {
        return List([])
    }

    //-----------------------------------------

    function _sort(curState, name) {
        let patient = curState.find(patient=>patient.get('name') == name)
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
