/**
 * Created by jiangyukun on 2016/8/8.
 */
import AppDispatcher from '../dispatcher/AppDispatcher'
import {ImagePreviewType} from '../constants/ChatConstants'
import {EventEmitter} from 'events'

let CHANGE_EVENT = 'change'

let flag = false
let url
let ImagePreviewStore = Object.assign({}, EventEmitter.prototype, {
    getShowOrHide() {
        return flag
    },
    getUrl() {
        return url
    },

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback)
    }
})

export default ImagePreviewStore

AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case ImagePreviewType.SHOW:
            flag = true
            url = action.url
            ImagePreviewStore.emit(CHANGE_EVENT)
            break

        case ImagePreviewType.HIDE:
            flag = false
            ImagePreviewStore.emit(CHANGE_EVENT)
            break

        default:
            break
    }
})
