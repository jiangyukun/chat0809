/**
 * Created by jiangyukun on 2016/11/11.
 */
import React, {Component, PropTypes} from 'react'

import SingleChat from './window/SingleChat'
import RoomChat from './window/RoomChat'
import {ChatType} from '../../constants/ChatConstants'

class ChatPanel extends Component {
    render() {
        let {chatType} = this.props.convertChat

        if (chatType == ChatType.CHAT) {
            return <SingleChat {...this.props}/>
        }
        return <RoomChat {...this.props}/>
    }
}

ChatPanel.propTypes = {
    convertChat: PropTypes.object,
    msg: PropTypes.object,
    members: PropTypes.array,
    curUserId: PropTypes.string,
    to: PropTypes.string,
    sendText: PropTypes.func,
    sendPicture: PropTypes.func
}

export default ChatPanel
