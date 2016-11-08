/**
 * Created by jiangyukun on 2016/11/4.
 */
import {fromJS, List} from 'immutable'

import actionConstants from '../../actions/actionConstants'

const defaultIState = fromJS([])

export function rooms(state = [], action) {
    const iState = fromJS(state)

    return nextState()

    function nextState() {
        let nextIState = iState
        switch (action.type) {
            case actionConstants.chat.INIT_GROUP_SUCCESS:
                nextIState = initGroupSuccess()
                break

            case actionConstants.message.NEW_MSG:
                nextIState = sortRoomList()
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

    //----------------------------------------------------

    function initGroupSuccess() {
        let {rooms, roomMessage} = action
        let curIState = fromJS(rooms.map(room=> {
            return {
                id: room.id,
                name: room.name
            }
        }))
        roomMessage.forEach(msg=> {
            curIState = _sort(curIState, msg.id)
        })
        return curIState
    }

    function sortRoomList() {
        let {to} = action.msg
        return _sort(iState, to)
    }

    function exitChatSystem() {
        return defaultIState
    }

    //-------------------------------

    function _sort(curState, id) {
        let room = curState.find(room=>room.get('id') == id)
        if (!room) {
            return curState
        }
        let index = curState.indexOf(room)
        if (index == 0) {
            return curState
        }
        return curState.splice(index, 1).unshift(room)
    }
}
