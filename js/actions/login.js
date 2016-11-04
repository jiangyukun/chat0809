/**
 * Created by jiangyukun on 2016/11/2.
 */
import * as conn from '../services/huanxinApi'
import actionConstants from './actionConstants'
import util from '../components/core/util'

export function checkAutoLogin() {
    return dispatch=> {
        let accessToken = util.getSession('accessToken')
        if (accessToken && !conn.isOpening()) {
            conn.reOpen(onReceiveMessage).then(function (userId) {
                dispatch({
                    type: actionConstants.LOGIN_SUCCESS, userId
                })
            }, function () {
                dispatch({
                    type: actionConstants.LOGIN_FAILURE
                })
            })
            dispatch({
                type: actionConstants.CONN_RE_OPEN
            })
        }

        function onReceiveMessage(msg) {
            dispatch({
                type: actionConstants.message.NEW_MSG,
                msg
            })
        }
    }
}

export function loginToHuanxin(username, password) {
    return dispatch=> {
        dispatch({
            type: actionConstants.LOGIN_START
        })

        function onReceiveMessage(msg) {
            dispatch({
                type: actionConstants.message.NEW_MSG,
                msg
            })
        }

        conn.login(username, password, onReceiveMessage).then(function (userId) {
            dispatch({type: actionConstants.LOGIN_SUCCESS, userId})
        }, function () {
            dispatch({type: actionConstants.LOGIN_FAILURE})
        })
    }
}

export function clearLoginFailure() {
    return {
        type: actionConstants.LOGIN_FAILURE_RESET
    }
}
