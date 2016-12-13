/**
 * Created by jiangyukun on 2016/11/21.
 */
import {MessageType} from '../../constants/ChatConstants'

let WebIM = window.WebIM,
    emoji = WebIM.Emoji, path = emoji.path, map = emoji.map, title = emoji.title

function encode(str) {
    if (!str || str.length === 0) return ""
    let s = ''
    s = str.replace(/&amp;/g, "&")
    s = s.replace(/<(?=[^o][^)])/g, "&lt;")
    s = s.replace(/>/g, "&gt;")
    s = s.replace(/\"/g, "&quot;")
    s = s.replace(/\n/g, "<br>")
    return s
}

export default {
    getEmojiUrl(key) {
        return path + map[key]
    },
    convertTextMessage(msg) {
        return WebIM.utils.parseLink(WebIM.utils.parseEmoji(encode(msg)))
    },
    parseTextMessage(message) {
        return WebIM.utils.parseTextMessage(message, emoji).body
    },
    parseProbablyEmojiTitle (msg) {
        for (let face in map) {
            if (map.hasOwnProperty(face)) {
                let faceTitle = title[face] || '表情'
                while (msg.indexOf(face) > -1) {
                    msg = msg.replace(face, '[' + faceTitle + ']')
                }
            }
        }
        return msg
    },
    parseEmojiObj(emojiObj) {
        if (!emojiObj || emojiObj.length == 0) {
            return ''
        }
        return emojiObj.reduce((result, current) => {
            let {type, data} = current
            if (type == MessageType.TEXT) {
                return result + data
            } else if (type == MessageType.EMOJI) {
                return result + '[' + title[data] + ']'
            }
            return result + '[未知]'
        }, '')
    }
}
