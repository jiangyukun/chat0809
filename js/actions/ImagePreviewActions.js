/**
 * Created by jiangyukun on 2016/8/8.
 */
import AppDispatcher from '../dispatcher/AppDispatcher'
import {ImagePreviewType} from '../constants/ChatConstants'

export default {
    show(url) {
        AppDispatcher.dispatch({
            actionType: ImagePreviewType.SHOW, url
        })
    },

    hide() {
        AppDispatcher.dispatch({
            actionType: ImagePreviewType.HIDE
        })
    }
}
