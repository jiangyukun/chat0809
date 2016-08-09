/**
 * jiangyukun on 2016
 */
import AppDispatcher from '../dispatcher/AppDispatcher'
import ChatConstants from '../constants/ChatConstants'

export default {

    login (username, password, success, error) {
        AppDispatcher.dispatch({
            actionType: ChatConstants.LOGIN, username, password, success, error
        })
    },

    checkLoginInfo(failCallback) {
        AppDispatcher.dispatch({
            actionType: ChatConstants.CHECK_LOGIN_INFO, failCallback
        })
    },

    exitChatSystem() {
        AppDispatcher.dispatch({
            actionType: ChatConstants.LOGIN_OUT
        })
    },

    sendTextMessage (to, type, content) {
        AppDispatcher.dispatch({
            actionType: ChatConstants.SEND_TEXT_MESSAGE, to, content, type
        })
    },

    readMessage (name, type)  {
        AppDispatcher.dispatch({
            actionType: ChatConstants.READ_MESSAGE, name, type
        })
    },

    beginGroupChat(roomId){
        AppDispatcher.dispatch({
            actionType: ChatConstants.BEGIN_GROUP_CHAT, roomId
        })
    },

    sendImageMessage(to, type, image)  {
        AppDispatcher.dispatch({
            actionType: ChatConstants.SEND_IMAGE_MESSAGE, to, type, image
        })
    },

    sendVoiceMessage(to, type, voice) {
        AppDispatcher.dispatch({
            actionType: ChatConstants.SEND_VOICE_MESSAGE, to, type, voice
        })
    },
    
    fetchHistoryMessage(user1, user2) {
        AppDispatcher.dispatch({
            actionType: ChatConstants.FETCH_HISTORY_MESSAGE, user1, user2
        })
    }
}
