/**
 * Created by jiangyukun on 2016/8/8.
 */
import {NotificationType} from '../constants/ChatConstants'
import Env from '../constants/Env'
import util from '../components/core/util'

let Strophe = window.Strophe
let WebIM = window.WebIM
let USER_NOT_FOUND = 1, CONNECT_CLOSE = 7

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
    if (Env.isDev()) {
        util.tip(NotificationType.ERROR, '暂不支持的类型：' + message.type)
    } else {
        console.log('暂不支持的类型：' + message.type)
    }
}

let loginSuccessList = [], loginFailureList = []

export function login(username, password, onReceiveMessage) {
    if (conn.isOpening()) {
        return
    }
    if (conn.isOpened()) {
        conn.onOpened()
        return
    }
    receiveMessageCallback = onReceiveMessage

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

export function reOpen(onReceiveMessage) {
    let accessToken = util.getSession('accessToken')
    let username = util.getSession('username')
    receiveMessageCallback = onReceiveMessage
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
            error() {
                reject()
            }
        })
    })
}

export function sendTextMessage({type, to, txt}) {
    let msg = new WebIM.message('txt', conn.getUniqueId())
    msg.set({
        msg: txt,
        to,
        roomType: type
    })
    conn.send(msg.body)
    return convertTextMessage(txt)
}

export function sendPicture(to, fileDom) {
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
        console.log('连接关闭');
    }
}

export function onLoginSuccess(callback) {
    loginSuccessList.push(callback)
}

export function onLoginFailure(callback) {
    loginFailureList.push(callback)
}

let error = empty
let close = empty
export function onClose(callback) {
    close = callback
}

function init() {
    //初始化连接
    conn.listen({
        onOpened () {
            curUserId = conn.context.userId
            util.setSession('accessToken', conn.context.accessToken)
            util.setSession('username', curUserId)
            conn.setPresence()
            loginSuccessList.map(loginSuccess=>loginSuccess(curUserId))
        },
        onClosed () {
            loginSuccessList = []
            loginFailureList = []
            receiveMessageCallback = empty

            util.removeSession('accessToken')
            close()
            close = noop
        },
        onTextMessage (message) {
            receiveMessageCallback(message)
        },
        onEmotionMessage (message) {
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
                loginFailureList.map(loginFailure=>loginFailure())
                // util.tip(NotificationType.ERROR, '登录失败!')
                return
            }
            error(message)
        }
    })
}

function initEmoji() {
    WebIM.Emoji = {
        path: 'res/images/faces/'
        , map: {
            '[):]': 'ee_1.png',
            '[:D]': 'ee_2.png',
            '[;)]': 'ee_3.png',
            '[:-o]': 'ee_4.png',
            '[:p]': 'ee_5.png',
            '[(H)]': 'ee_6.png',
            '[:@]': 'ee_7.png',
            '[:s]': 'ee_8.png',
            '[:$]': 'ee_9.png',
            '[:(]': 'ee_10.png',
            '[:\'(]': 'ee_11.png',
            '[:|]': 'ee_12.png',
            '[(a)]': 'ee_13.png',
            '[8o|]': 'ee_14.png',
            '[8-|]': 'ee_15.png',
            '[+o(]': 'ee_16.png',
            '[<o)]': 'ee_17.png',
            '[|-)]': 'ee_18.png',
            '[*-)]': 'ee_19.png',
            '[:-#]': 'ee_20.png',
            '[:-*]': 'ee_21.png',
            '[^o)]': 'ee_22.png',
            '[8-)]': 'ee_23.png',
            '[(|)]': 'ee_24.png',
            '[(u)]': 'ee_25.png',
            '[(S)]': 'ee_26.png',
            '[(*)]': 'ee_27.png',
            '[(#)]': 'ee_28.png',
            '[(R)]': 'ee_29.png',
            '[({)]': 'ee_30.png',
            '[(})]': 'ee_31.png',
            '[(k)]': 'ee_32.png',
            '[(F)]': 'ee_33.png',
            '[(W)]': 'ee_34.png',
            '[(D)]': 'ee_35.png'
        }
    }
}

function encode(str) {
    if (!str || str.length === 0) return "";
    var s = '';
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/<(?=[^o][^)])/g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    //s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    return s;
}

export function convertTextMessage(msg) {
    return WebIM.utils.parseLink(WebIM.utils.parseEmoji(encode(msg)))
}

Strophe.log = function (level, msg) {
    if (level >= 3) {
        empty(msg)
    }
}

init()
initEmoji()


