/**
 * Created by jiangyukun on 2016/11/11.
 */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import SingleChat from './window/SingleChat'
import RoomChat from './window/RoomChat'
import {ChatType} from '../../constants/ChatConstants'
import busHelper from '../../core/busHelper'
import {sendTextMessage, sendImageMessage, sendAudioMessage} from '../../actions/chat'

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
    message: PropTypes.object,
    members: PropTypes.array,
    curUserId: PropTypes.string,
    to: PropTypes.string,
    sendText: PropTypes.func,
    sendPicture: PropTypes.func,
    sendAudio: PropTypes.func
}

function mapStateToProps(state, ownProps) {
    let {convertChat, msg, to} = ownProps
    let {app, members, curUserId, historyMessage} = state
    members = members.map(member => {
        return {jid: member.jid, name: busHelper.getDisplayName(member.name)}
    })
    return {
        convertChat, msg, to,
        app, members, curUserId, historyMessage
    }
}

export default connect(mapStateToProps, {
    sendText: sendTextMessage,
    sendPicture: sendImageMessage,
    sendAudio: sendAudioMessage
})(ChatPanel)
