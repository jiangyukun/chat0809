/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ChatPanel from '../components/chat/ChatPanel'
import NoChat from '../components/chat/window/NoChat'
import busHelper from '../core/busHelper'


class IndexChat extends Component {
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
                        message={this.props.message}
                        chatType={this.props.chatType}
                        to={this.props.selectedChatId}
                        sendText={this.props.sendTextMessage}
                        sendPicture={this.props.sendImageMessage}/>
                }
            </div>
        )
    }
}

IndexChat.propTypes = {
    selectedChatId: PropTypes.string,
    selectedContactId: PropTypes.string,
    startChat: PropTypes.func
}

function mapStateToProps(state, props) {
    if (!props.selectedChatId) {
        return {}
    }

    let {chatList, singleMessage, roomMessage, patients, doctors, rooms} = state
    let message, chat, convertChat = {}

    chat = chatList.find(chat => chat.id == props.selectedChatId)
    convertChat.id = chat.id
    convertChat.chatType = chat.chatType
    convertChat.nickname = busHelper.getNickname(chat.id, chat.chatType, patients, doctors, rooms)

    message = busHelper.getMessage(props.selectedChatId, singleMessage, roomMessage)

    return {
        convertChat, message
    }
}

export default connect(mapStateToProps)(IndexChat)
