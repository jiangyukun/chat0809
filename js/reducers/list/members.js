/**
 * Created by jiangyukun on 2016/11/7.
 */
import actionConstants from '../../actions/actionConstants'

export function members(state = [], action) {

    switch (action.type) {
        case actionConstants.chat.FETCH_GROUP_MEMBER_SUCCESS:
            return action.members

        default:
            return state
    }

}