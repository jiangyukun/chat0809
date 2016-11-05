/**
 * Created by jiangyukun on 2016/11/2.
 */
import {merge} from 'lodash'
import actionConstants from '../actions/actionConstants'

export function login(state = {failure: false, success: false, message: ''}, action) {
    if (action.type == actionConstants.LOGIN_START) {
        return merge({}, state, {loading: true})
    }

    switch (action.type) {
        case actionConstants.CONN_UN_OPEN:
            return merge({}, state, {failure: true, success: false})

        case  actionConstants.LOGIN_START:
            return merge({}, state, {loading: true})

        case  actionConstants.LOGIN_SUCCESS:
            return merge({}, state, {loading: false, success: true, failure: false})

        case  actionConstants.LOGIN_FAILURE:
            return merge({}, state, {loading: false, failure: true, success: false, message: '登录失败'})

        case  actionConstants.LOGIN_FAILURE_RESET:
            return merge({}, state, {failure: false, message: ''})

        case actionConstants.EXIT_CHAT_SYSTEM:
            return merge({}, state, {success: false, failure: false, message: ''})

        case actionConstants.CHECK_LOGIN_INFO:
            return

        default:
            break
    }

    return state
}

export function curUserId(state = '', action) {
    switch (action.type) {


        case actionConstants.LOGIN_SUCCESS:
            return action.userId

        case actionConstants.EXIT_CHAT_SYSTEM:
            return exitChatSystem()

        default:
            break
    }

    return state

    function exitChatSystem() {
        return ''
    }
}
