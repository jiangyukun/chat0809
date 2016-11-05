/**
 * Created by jiangyukun on 2016/11/4.
 */
import {fromJS} from 'immutable'

import actionConstants from '../../actions/actionConstants'

export function patients(state = [], action) {
    switch (action.type) {
        case actionConstants.chat.INIT_PATIENT_SUCCESS:
            return initPatientSuccess()

        case actionConstants.message.NEW_MSG:
            return sortPatientList()

        case actionConstants.EXIT_CHAT_SYSTEM:
            return exitChatSystem()

        default:
            return state
    }

    //------------------------------------------------------

    function initPatientSuccess() {
        let patients = action.patients
        return patients.map(patient=> {
            return {
                id: patient.id,
                name: patient.name,
                nickname: patient.name
            }
        })
    }

    function sortPatientList() {
        let {from} = action.msg
        let iState = fromJS(state)
        let patient = iState.find(patient=>patient.get('name') == from)
        if (!patient) {
            return state
        }
        let index = iState.indexOf(patient)
        if (index == 0) {
            return state
        }
        return iState.splice(index, 1).unshift(patient).toJS()

    }

    function exitChatSystem() {
        return []
    }
}
