/**
 * Created by jiangyukun on 2016/11/11.
 */
import {fromJS, Map, List} from 'immutable'

import actionConstants from '../actions/actionConstants'

let defaultState = []

export default function chatList(state = defaultState, action) {
    let iState = fromJS(state)

    return nextState()

    function nextState() {
        let nextIState = iState
        switch (action.type) {
            case actionConstants.chat.START_SINGLE_CHAT:
                nextIState = startSingleChat()
                break

            default:
                break
        }

        if (nextIState == iState) {
            return state
        }
        return nextIState.toJS()
    }

    //--------------------------------------

    function startSingleChat() {
        let {name} = action.currentSingle

        return _sort(iState, name)
    }

    // ----------------------------

    function _createMsg(iState, id) {
        return iState.push(Map({
            id,
            txt: ''
        }))
    }

    function _sort(curState, id) {
        let patient = curState.find(patient=>patient.get('id') == id)
        if (!patient) {
            curState = _update(curState, id)
        }
        let index = curState.indexOf(patient)
        if (index == 0) {
            return curState
        }
        return curState.splice(index, 1).unshift(patient)
    }

    function _update(iState, id, callback) {
        let matchMsg = iState.find(msg=>msg.get('id') == id)
        if (!matchMsg) {
            iState = _createMsg(iState, id)
            if (!callback) {
                return iState
            }
            matchMsg = iState.find(msg=>msg.get('id') == id)
        }
        return iState.update(iState.indexOf(matchMsg), callback)
    }
}
