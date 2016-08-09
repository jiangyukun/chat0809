/**
 * jiangyukun on 2016/8/1.
 */
import {ChatType, MessageType} from '../../constants/ChatConstants'
export default class MessageHelper {
    static initMessage(message, msgInfo) {
        let {jid, roomId, type, name} = msgInfo
        let msg;
        if (type == ChatType.CHAT) {
            msg = {
                jid, name, type,
                reads: [],
                unreads: []
            }
        } else {
            msg = {
                roomId, name, type,
                reads: [],
                unreads: []
            }
        }
        message.push(msg)
        return msg
    }

    static getMessageByName(message, key, type) {
        for (let i = 0; i < message.length; i++) {
            let msg = message[i];
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
        console.log(msgInfo);
        let msg, data;
        try {
            if (type == ChatType.GROUP_CHAT) {
                msg = MessageHelper.getMessageByName(message, msgInfo.to, type)
            } else {
                msg = MessageHelper.getMessageByName(message, from, type)
            }
        } catch (e) {
            msg = MessageHelper.initMessage(message, msgInfo)
        }
        let msgType = MessageType.TEXT
        data = msgInfo.data
        if (msgInfo.thumb || msgInfo.url) {
            data = msgInfo.url
            msgType = MessageType.IMAGE
        }
        msg.unreads.push({
            from, data, type: msgType
        })
    }

    static sendTextMessage(message, type, from, to, content) {
        let msg = MessageHelper.getMessageByName(message, to, type)
        msg.reads.push({
            from, to,
            type: MessageType.TEXT,
            data: content
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

    static sendVoiceMessage(message, type, from, to, voice) {
        let msg = MessageHelper.getMessageByName(message, to, type)
        msg.reads.push({
            from, to,
            type: MessageType.VOICE,
            data: voice
        })
    }

    static readMessage(message, key, type) {
        let msg = MessageHelper.getMessageByName(message, key, type)
        msg.unreads.map((unread=> {
            msg.reads.push(unread)
        }))
        msg.unreads = []
    }

    static showMessageToUI(message, key, type, callback) {
        MessageHelper.readMessage(message, key, type)
        let msg = MessageHelper.getMessageByName(message, key, type)
        return msg.reads.map((msg, index)=> {
            return callback(index, msg)
        })
    }

    static getUnreadCount(message, key, type) {
        return MessageHelper.getMessageByName(message, key, type).unreads.length
    }

}
