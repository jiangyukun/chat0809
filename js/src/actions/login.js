/**
 * Created by jiangyukun on 2016/11/2.
 */
import * as conn from '../services/huanxinApi'
import actionConstants from './actionConstants'
import util from '../components/core/util'

export function checkAutoLogin() {
    return (dispatch, getState) => {
        let accessToken = util.getSession('accessToken')
        let username = util.getSession('username')
        if (accessToken && !conn.isOpening()) {
            conn.reOpen(onReceiveMessage).then(userId => {
                dispatch({
                    type: actionConstants.LOGIN_SUCCESS, userId
                })
            }, () => {
                dispatch({
                    type: actionConstants.LOGIN_FAILURE
                })
            })
            dispatch({
                type: actionConstants.app.AUTO_LOGIN, username
            })

            function onReceiveMessage(msg) {
                let {patients, doctors} = getState()
                dispatch({
                    type: actionConstants.message.NEW_MSG,
                    msg, patients, doctors
                })
            }
        }
    }
}

export function loginToHuanxin(username, password) {
    return (dispatch, getState) => {
        dispatch({
            type: actionConstants.LOGIN_START
        })

        function onReceiveMessage(msg) {
            let {patients, doctors} = getState()
            dispatch({
                type: actionConstants.message.NEW_MSG,
                msg, patients, doctors
            })
        }

        conn.login(username, password, onReceiveMessage).then(userId => {
            util.setSession('username', userId)
            dispatch({type: actionConstants.LOGIN_SUCCESS, userId})
        }, () => {
            dispatch({type: actionConstants.LOGIN_FAILURE})
        })
    }
}

export function clearLoginFailure() {
    return {
        type: actionConstants.LOGIN_FAILURE_RESET
    }
}
