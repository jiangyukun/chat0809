/**
 * Created by jiangyukun on 2016/8/8.
 */

import util from '../components/core/util'

let USER_NOT_FOUND = 3
let conn = new Easemob.im.Connection({
    multiResources: Easemob.im.config.multiResources,
    https: Easemob.im.config.https,
    url: Easemob.im.config.xmppURL
})
let curUserId

function empty() {
}

let loginSuccessList = [], loginFailureList = []

export function login(username, password) {
    if (conn.isOpening()) {
        return
    }
    if (conn.isOpened()) {
        conn.onOpened()
        return
    }
    conn.open({
        user: username,
        pwd: password,
        appKey: Easemob.im.config.appkey
    })
}

export function isOpening() {
    return conn.isOpening()
}

export function reOpen() {
    let accessToken = util.getSession('accessToken')
    let username = util.getSession('username')
    conn.open({user: username, accessToken, appKey: Easemob.im.config.appkey})
}

export function getUserId() {
    return curUserId
}

export function getRoster() {
    return new Promise(function (resolve, reject) {
        conn.getRoster({
            success (roster) {
                resolve(roster)
            }
        })
    })
}

export function listRooms() {
    return new Promise(function (resolve, reject) {
        conn.listRooms({
            success (groups) {
                resolve(groups)
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
            }
        })
    })
}

export function sendTextMessage(msg) {
    conn.sendTextMessage(msg)
}

export function sendPicture(msg) {
    conn.sendPicture({
        onFileUploadError(error) {
            console.log(error);
        },
        onFileUploadComplete(data) {
            console.log(data);
        },
        ...msg
    })
}

export function isOpened() {
    return conn.isOpened()
}

export function closeConn() {
    conn.close()
}

export function onLoginSuccess(callback) {
    loginSuccessList.push(callback)
}

export function onLoginFailure(callback) {
    loginFailureList.push(callback)
}

let error = empty
function onError(callback) {
    error = callback
}

let close = empty
function onClose(callback) {
    close = callback
}

let textMessage = empty
export function onTextMessage(callback) {
    textMessage = callback
}

let emotionMessage = empty

export function onEmotionMessage(callback) {
    emotionMessage = callback
}

let pictureMessage = empty
export function onPictureMessage(callback) {
    pictureMessage = callback
}

function handleAudioMessage(audioMessageInfo) {
    console.log(audioMessageInfo)
}

function init() {
    //初始化连接
    conn.listen({
        onOpened () {
            curUserId = conn.context.userId
            util.setSession('accessToken', conn.context.accessToken)
            util.setSession('username', curUserId)
            conn.setPresence();
            loginSuccessList.map(loginSuccess=>loginSuccess(curUserId))
        },
        onClosed () {
            util.removeSession('accessToken')
            close()
        },
        onTextMessage (message) {
            textMessage(message)
        },
        onEmotionMessage (message) {
            emotionMessage(message)
        },
        onPictureMessage (message) {
            pictureMessage(message)
        },
        onAudioMessage (message) {
            handleAudioMessage(message)
        },
        onLocationMessage (message) {
            handleLocationMessage(message)
        },
        onFileMessage (message) {
            handleFileMessage(message)
        },
        onVideoMessage (message) {
            handleVideoMessage(message)
        },
        onPresence (message) {
            handlePresence(message)
        },
        onRoster (message) {
            handleRoster(message)
        },
        onInviteMessage (message) {
            handleInviteMessage(message)
        },
        onError (message) {
            if (error.type == USER_NOT_FOUND) {
                loginFailureList.map(loginFailure=>loginFailure())
            }
            error(message)
        }
    })
}
init()

function initEmotion() {
    Easemob.im.EMOTIONS = {
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
    };

}

initEmotion()

// 测试 roomId 225659018968826308
// login('bkts1', '198811');
// login('11111111111', 'tiger123456');
// login('15381080789', 'tiger123456');
