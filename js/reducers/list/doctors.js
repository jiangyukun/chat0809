/**
 * Created by jiangyukun on 2016/11/4.
 */
import {fromJS} from 'immutable'

import actionConstants from '../../actions/actionConstants'

export function doctors(state = [], action) {
    switch (action.type) {
        case actionConstants.chat.INIT_DOCTOR_SUCCESS:
            let doctor = action.doctors
            return doctor.map(doctor=> {
                return {
                    id: doctor.id,
                    name: doctor.name,
                    nickname: doctor.nickname
                }
            })

        case actionConstants.message.NEW_MSG:
            return sortDoctorList()

        case actionConstants.EXIT_CHAT_SYSTEM:
            return exitChatSystem()

        default:
            return state
    }

    function sortDoctorList() {
        let {from} = action.msg
        let iState = fromJS(state)
        let doctor = iState.find(doctor=>doctor.get('name') == from)
        if (!doctor) {
            return state
        }
        let index = iState.indexOf(doctor)
        if (index == 0) {
            return state
        }
        return iState.splice(index, 1).unshift(doctor).toJS()

    }

    function exitChatSystem() {
        return []
    }
}
