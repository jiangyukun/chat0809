/**
 * Created by jiangyukun on 2016/11/4.
 */
import {fromJS} from 'immutable'

import actionConstants from '../../actions/actionConstants'

export function rooms(state = [], action) {
    switch (action.type) {
        case actionConstants.chat.INIT_GROUP_SUCCESS:
            let rooms = action.rooms
            return rooms.map(room=> {
                return {
                    id: room.id,
                    name: room.name
                }
            })

        case actionConstants.message.NEW_MSG:
            return sortRoomList()

        case actionConstants.EXIT_CHAT_SYSTEM:
            return exitChatSystem()

        default:
            return state
    }

    function sortRoomList() {
        let {to} = action.msg
        let iState = fromJS(state)
        let room = iState.find(room=>room.get('id') == to)
        if (!room) {
            return state
        }
        let index = iState.indexOf(room)
        if (index == 0) {
            return state
        }
        return iState.splice(index, 1).unshift(room).toJS()

    }

    function exitChatSystem() {
        return []
    }
}
