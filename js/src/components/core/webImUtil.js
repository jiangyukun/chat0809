/**
 * Created by jiangyukun on 2016/11/15.
 */

let emotions = WebIM.Emoji, emtMap = emotions.map, emtPath = emotions.path;

export default {
    getEmojiUrl(key) {
        return emtPath + emtMap[key]
    },

    getEmojiStyle(key) {
        return {
            'background': 'url(' + this.getEmojiUrl(key) + ')', 'backgroundSize': 'cover'
        }
    }
}
