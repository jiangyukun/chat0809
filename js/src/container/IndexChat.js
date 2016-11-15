/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ChatPanel from '../components/chat/ChatPanel'
import NoChat from '../components/chat/NoChat'
import busHelper from '../core/busHelper'
import {sendTextMessage, sendImageMessage, sendAudioMessage} from '../actions/chat'

class ChatManage extends Component {

    render() {
        return (
            <div style={{height: '100%'}}>
                {
                    !this.props.selectedChatId && <NoChat/>
                }
                {
                    this.props.selectedChatId &&
                    <ChatPanel
                        convertChat={this.props.convertChat}
                        msg={this.props.msg}
                        members={this.props.members}
                        curUserId={this.props.curUserId}
                        chatType={this.props.chatType}
                        to={this.props.selectedChatId}
                        sendText={this.props.sendTextMessage}
                        sendPicture={this.props.sendImageMessage}/>
                }
            </div>
        )
    }
}

ChatManage.propTypes = {
    selectedChatId: PropTypes.string,
    selectedContactId: PropTypes.string,
    startChat: PropTypes.func
}

function mapStateToProps(state, props) {
    if (!props.selectedChatId) {
        return {}
    }

    let {curUserId, chatList, singleMessage, roomMessage, patients, doctors, rooms, members} = state
    let msg, chat, convertChat = {}

    chat = chatList.find(chat => chat.id == props.selectedChatId)
    convertChat.id = chat.id
    convertChat.chatType = chat.chatType
    convertChat.nickname = busHelper.getNickname(chat.id, chat.chatType, patients, doctors, rooms)

    msg = busHelper.getMessage(props.selectedChatId, singleMessage, roomMessage)

    return {
        curUserId,
        convertChat,
        msg,
        members
    }
}

export default connect(mapStateToProps, {
    sendTextMessage,
    sendImageMessage,
    sendAudioMessage
})(ChatManage)
