/**
 * Created by jiangyukun on 2016/11/2.
 */
import * as conn from '../services/huanxinApi'
import actionConstants from './actionConstants'
import util from '../core/utils/util'

const Notification = window.Notification

export function checkAutoLogin() {
    return (dispatch, getState) => {
        let accessToken = util.getSession('accessToken')
        let username = util.getSession('username')
        if (accessToken && !conn.isOpening()) {
            dispatch({
                type: actionConstants.app.AUTO_LOGIN, username
            })

            conn.reOpen(onReceiveMessage, onClose).then(onLoginSuccess, () => {
                dispatch({
                    type: actionConstants.LOGIN_FAILURE
                })
            })

            //----------------------------------

            function onLoginSuccess(userId) {
                dispatch({
                    type: actionConstants.LOGIN_SUCCESS, userId
                })
                if (Notification) {
                    Notification.requestPermission(status => {
                        dispatch({
                            type: actionConstants.NOTIFICATION_PERMISSION_CHANGE, status
                        })
                    })
                }
            }

            function onReceiveMessage(msg) {
                let {patients, doctors} = getState()
                dispatch({type: actionConstants.message.NEW_MSG, msg, patients, doctors})
            }

            function onClose() {
                dispatch({
                    type: actionConstants.CONN_CLOSED
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

        conn.login(username, password, onReceiveMessage, onClose).then(onLoginSuccess, () => {
            dispatch({type: actionConstants.LOGIN_FAILURE})
        })

        //----------------------------------

        function onLoginSuccess(userId) {
            util.setSession('username', userId)
            dispatch({type: actionConstants.LOGIN_SUCCESS, userId})
            if (Notification) {
                Notification.requestPermission(status => {
                    dispatch({
                        type: actionConstants.NOTIFICATION_PERMISSION_CHANGE, status
                    })
                })
            }
        }

        function onReceiveMessage(msg) {
            let {patients, doctors} = getState()
            dispatch({
                type: actionConstants.message.NEW_MSG,
                msg, patients, doctors
            })
        }

        function onClose() {
            dispatch({
                type: actionConstants.CONN_CLOSED
            })
        }
    }
}

export function clearLoginFailure() {
    return {
        type: actionConstants.LOGIN_FAILURE_RESET
    }
}
