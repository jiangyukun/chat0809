/*
 * jiangyukun on 2016-07-2x
 */
import keyMirror from 'keymirror'

export default keyMirror({
    LOGIN: null,
    CHECK_LOGIN_INFO: null,
    LOGIN_OUT: null,
    SEND_TEXT_MESSAGE: null,
    READ_MESSAGE: null,
    SEND_IMAGE_MESSAGE: null,
    SEND_AUDIO_MESSAGE: null,
    BEGIN_USER_CHAT: null,
    BEGIN_GROUP_CHAT: null,
    FETCH_HISTORY_MESSAGE: null
})

export let ChatType = {
    CHAT: 'chat',
    GROUP_CHAT: 'groupchat'
}

export let MessageType = {
    TEXT: 'txt',
    IMAGE: 'image',
    EMOTION: 'emotion',
    VOICE: 'voice',
    AUDIO: 'audio'
}

export let NotificationType = {
    ADD: 'add',
    REMOVE: 'remove',
    SUCCESS: 'success',
    ERROR: 'error'
}

export let ImagePreviewType = {
    SHOW: 'show',
    HIDE: 'hide'
}
