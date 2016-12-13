/**
 * Created by jiangyukun on 2016/8/8.
 */
import {ChatType} from '../constants/ChatConstants'
import util from '../core/utils/util'
import huanxinUtils from '../core/utils/huanxinUtils'

let Strophe = window.Strophe
let WebIM = window.WebIM
let USER_NOT_FOUND = 1, CONNECT_CLOSE = 8

let conn = new WebIM.connection({
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
    url: WebIM.config.xmppURL,
    isAutoLogin: false,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval
})
let curUserId
let receiveMessageCallback

function noop() {
}

function empty(message) {
    if (!message.type || message.type == CONNECT_CLOSE) {
        return
    }
    console.log('暂不支持的类型：' + message.type)
    if (process.env.NODE_ENV == 'dev') {
        // util.tip(NotificationType.ERROR, '暂不支持的类型：' + message.type)
    }
}

let loginSuccessList = [], loginFailureList = []

export function login(username, password, onReceiveMessage, onClose) {
    if (conn.isOpening()) {
        return
    }
    if (conn.isOpened()) {
        conn.onOpened()
        return
    }
    receiveMessageCallback = onReceiveMessage
    closeCallback = onClose

    conn.open({
        user: username,
        pwd: password,
        appKey: WebIM.config.appkey,
        apiUrl: WebIM.config.apiURL
    })

    return new Promise(function (resolve, reject) {
        loginSuccessList.push(function (userId) {
            resolve(userId)
        })
        loginFailureList.push(function () {
            reject()
        })
    })
}

export function isOpening() {
    return conn.isOpening()
}

export function reOpen(onReceiveMessage, onClose) {
    let accessToken = util.getSession('accessToken')
    let username = util.getSession('username')
    receiveMessageCallback = onReceiveMessage
    closeCallback = onClose
    conn.open({user: username, accessToken, appKey: WebIM.config.appkey})
    return new Promise(function (resolve, reject) {
        loginSuccessList.push(function (userId) {
            resolve(userId)
        })
        loginFailureList.push(function () {
            reject()
        })
    })
}

export function getRoster() {
    return new Promise(function (resolve, reject) {
        conn.getRoster({
            success (roster) {
                resolve(roster)
            },
            error() {
                reject()
            }
        })
    })
}

export function listRooms() {
    return new Promise(function (resolve, reject) {
        conn.listRooms({
            success (groups) {
                resolve(groups)
            },
            error() {
                reject()
            }
        })
    })
}

export function queryRoomMember(roomId) {
    return new Promise(function (resolve, reject) {
        conn.queryRoomMember({
            roomId: roomId,
            success(result) {
                resolve(result)
            },
            error(error) {
                reject(error)
            }
        })
    })
}

export function sendTextMessage({type, to, txt}) {
    let chatType = type == ChatType.CHAT ? 'singleChat' : 'groupChat'
    let msg = new WebIM.message('txt', conn.getUniqueId())
    msg.set({
        msg: txt,
        to,
        roomType: false
    })
    if (type == ChatType.GROUP_CHAT) {
        msg.setGroup('groupchat')
    }
    let body = msg.body
    body.chatType = chatType
    conn.send(body)
    return huanxinUtils.convertTextMessage(txt)
}

export function sendPicture(to, chatType, fileDom) {
    return new Promise(function (resolve, reject) {
        let msg = new WebIM.message('img', conn.getUniqueId())
        msg.set({
            file: WebIM.utils.getFileUrl(fileDom),
            to,
            apiUrl: WebIM.config.apiURL,
            onFileUploadError(error) {
                reject(error)
            },
            onFileUploadComplete(data) {
                resolve(data.uri + '/' + data.entities[0].uuid)
            }
        })
        if (chatType == ChatType.GROUP_CHAT) {
            msg.setGroup(ChatType.GROUP_CHAT)
        }
        conn.send(msg.body)
    })
}

export function sendAudio(msg) {
    conn.sendAudio(msg)
}

export function isOpened() {
    return conn.isOpened()
}

export function closeConn() {
    try {
        conn.close()
    } catch (e) {
        console.log('连接关闭')
    }
}

export function onLoginSuccess(callback) {
    loginSuccessList.push(callback)
}

export function onLoginFailure(callback) {
    loginFailureList.push(callback)
}

let error = empty
let closeCallback = empty

function init() {
    //初始化连接
    conn.listen({
        onOpened () {
            curUserId = conn.context.userId
            util.setSession('accessToken', conn.context.accessToken)
            // util.setSession('username', curUserId)
            conn.setPresence()
            loginSuccessList.map(loginSuccess => loginSuccess(curUserId))
        },
        onClosed () {
            loginSuccessList = []
            loginFailureList = []
            receiveMessageCallback = empty

            util.removeSession('accessToken')
            closeCallback()
            closeCallback = noop
        },
        onTextMessage (message) {
            receiveMessageCallback(message)
        },
        onEmojiMessage (message) {
            receiveMessageCallback(message)
        },
        onPictureMessage (message) {
            receiveMessageCallback(message)
        },
        onAudioMessage (message) {
            receiveMessageCallback(message)
        },
        onLocationMessage (message) {
            empty(message)
        },
        onFileMessage (message) {
            empty(message)
        },
        onVideoMessage (message) {
            empty(message)
        },
        onPresence (message) {
            empty(message)
        },
        onRoster (message) {
            empty(message)
        },
        onInviteMessage (message) {
            empty(message)
        },
        onError (message) {
            if (!message) {
                return
            }
            if (message.type == USER_NOT_FOUND) {
                loginFailureList.map(loginFailure => loginFailure())
                return
            }
            error(message)
        }
    })
}

Strophe.log = function (level, msg) {
    if (level >= 3) {
        empty(msg)
    }
}

init()
