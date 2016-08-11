/**
 * jiangyukun on 2016/8/1
 */
import {ChatType, MessageType} from '../../constants/ChatConstants'
export default class MessageHelper {

    static initMessage(message, msgInfo) {
        let {roomId, type, name} = msgInfo
        let msg
        if (type == ChatType.CHAT) {
            msg = {
                name, type,
                reads: [],
                unreads: [],
                mark: false,
                historyMessages: []
            }
        } else {
            msg = {
                roomId, name, type,
                reads: [],
                unreads: [],
                mark: false,
                historyMessages: []
            }
        }
        message.push(msg)
        return msg
    }

    static getMessageByName(message, key, type) {
        for (let i = 0; i < message.length; i++) {
            let msg = message[i]
            if (msg.type != type) {
                continue
            }
            if (type == ChatType.CHAT && msg.name == key) {
                return msg
            }
            if (type == ChatType.GROUP_CHAT && msg.roomId == key) {
                return msg
            }
        }
        throw new Error('name not found !')
    }

    static receiveMessage(message, type, from, msgInfo) {
        let msg, data;
        try {
            if (type == ChatType.GROUP_CHAT) {
                msg = MessageHelper.getMessageByName(message, msgInfo.to, type)
            } else {
                msg = MessageHelper.getMessageByName(message, from, type)
            }
        } catch (e) {
            msg = MessageHelper.initMessage(message, {name: msgInfo.from, type: msgInfo.type})
        }
        let msgType = MessageType.TEXT
        data = msgInfo.data
        if (msgInfo.hasOwnProperty('thumb')) {
            data = msgInfo.url
            msgType = MessageType.IMAGE
        } else if (msgInfo.hasOwnProperty('filename')) {
            if (msgInfo.filename == 'audio' || msgInfo.filename.indexOf('.amr') != -1 || msgInfo.filename.indexOf('.mp3') != -1) {
                data = msgInfo.url
                msgType = MessageType.AUDIO
            }
        }

        msg.unreads.push({
            from, data, type: msgType
        })
    }

    static sendTextMessage(message, type, from, to, data) {
        let msg = MessageHelper.getMessageByName(message, to, type)
        msg.reads.push({
            from, to,
            type: MessageType.TEXT,
            data: data
        })
    }

    static sendImageMessage(message, type, from, to, image) {
        let msg = MessageHelper.getMessageByName(message, to, type)
        msg.reads.push({
            from, to,
            type: MessageType.IMAGE,
            data: image
        })
    }

    static sendAudioMessage(message, type, from, to, audio) {
        let msg = MessageHelper.getMessageByName(message, to, type)
        msg.reads.push({
            from, to,
            type: MessageType.AUDIO,
            data: audio
        })
    }

    static readMessage(message, key, type) {
        let msg = MessageHelper.getMessageByName(message, key, type)
        msg.unreads.map(unread=> {
            msg.reads.push(unread)
        })
        msg.unreads = []
    }

    static showMessageToUI(message, key, type, callback) {
        let msg = MessageHelper.getMessageByName(message, key, type)
        return msg.reads.map((msg, index)=> {
            return callback(index, msg)
        })
    }

    static getUnreadCount(message, key, type) {
        return MessageHelper.getMessageByName(message, key, type).unreads.length
    }

    static markMessage(message, type, key) {
        let msg = MessageHelper.getMessageByName(message, key, type)
        msg.mark = true;
    }

    static getUnMarkMessage(message) {
        return message.filter(msg=> msg.mark == false)
    }
}
