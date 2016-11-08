/**
 * Created by jiangyukun on 2016/11/4.
 */
import {fromJS, List} from 'immutable'

import actionConstants from '../../actions/actionConstants'

const defaultIState = fromJS([])
export function doctors(state = [], action) {
    const iState = fromJS(state)
    return nextState()

    function nextState() {
        let nextIState = iState
        switch (action.type) {
            case actionConstants.chat.INIT_DOCTOR_SUCCESS:
                nextIState = initDoctorSuccess()
                break

            case actionConstants.message.NEW_MSG:
                nextIState = sortDoctorList()
                break

            case actionConstants.EXIT_CHAT_SYSTEM:
                nextIState = exitChatSystem()
                break

            default:
                break
        }
        if (nextIState == iState) {
            return state
        }
        return nextIState.toJS()
    }

    //-----------------------------

    function initDoctorSuccess() {
        let {doctors, singleMessage} = action
        let curIState = fromJS(doctors.map(doctor=> {
            return {
                id: doctor.id,
                name: doctor.name,
                nickname: doctor.nickname
            }
        }))
        singleMessage.forEach(msg=> {
            curIState = _sort(curIState, msg.name)
        })
        return curIState
    }

    function sortDoctorList() {
        let {from} = action.msg
        return _sort(iState, from)
    }

    function exitChatSystem() {
        return defaultIState
    }

    //-------------------------------------------------------

    function _sort(curState, name) {
        let doctor = curState.find(doctor=>doctor.get('name') == name)
        if (!doctor) {
            return curState
        }
        let index = curState.indexOf(doctor)
        if (index == 0) {
            return curState
        }
        return curState.splice(index, 1).unshift(doctor)
    }
}
