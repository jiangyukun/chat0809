/**
 * Created by jiangyukun on 2016/11/15.
 */
import {MessageType} from '../../constants/ChatConstants'
import huanxinUtils from '../../core/utils/huanxinUtils'

let emotions = WebIM.Emoji, emtMap = emotions.map, emtPath = emotions.path, title = emotions.title

export default {
    getEmojiUrl(key) {
        return emtPath + emtMap[key]
    },

    getEmojiStyle(key) {
        return {
            'background': 'url(' + this.getEmojiUrl(key) + ')', 'backgroundSize': 'cover'
        }
    },

    getEmojiTitle(key) {
        return title[key] || ''
    },

    handleMessage(msg) {
        let msgType = MessageType.TEXT
        let data = msg.data
        if (msg.hasOwnProperty('thumb')) {
            data = msg.url
            msgType = MessageType.IMAGE
        } else if (msg.hasOwnProperty('filename')) {
            let filename = msg.filename
            if (filename == 'audio' || filename.indexOf('.amr') != -1 || filename.indexOf('.mp3') != -1) {
                let extension = filename.substr(filename.lastIndexOf('.') + 1)
                data = {
                    url: msg.url, type: extension
                }
                msgType = MessageType.AUDIO
            }
        }
        return {
            msgType, data
        }
    },

    handleContent(type, data) {
        let lastContent
        if (type == MessageType.TEXT) {
            if (typeof data == 'string') {
                lastContent = huanxinUtils.parseProbablyEmojiTitle(data)
            } else {
                lastContent = huanxinUtils.parseEmojiObj(data)
            }
        } else if (type == MessageType.IMAGE) {
            lastContent = '[图片]'
        }
        return lastContent
    },

    getMessageContentTip(message) {
        const {msgType, data} = this.handleMessage(message)
        return this.handleContent(msgType, data)
    }
}
