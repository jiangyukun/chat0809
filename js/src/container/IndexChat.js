/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ChatPanel from '../components/chat/ChatPanel'
import NoChat from '../components/chat/NoChat'

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
                        chat={this.props.chat}
                        msg={this.props.msg}
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

    let {curUserId, chatList, singleMessage, roomMessage} = state
    let chatType, msg, chat

    if (props.selectedChatId) {
        chat = chatList.find(chat=>chat.id == props.selectedChatId)
        chatType = chat.chatType
    }

    msg = singleMessage.find(msg=>msg.name == props.selectedChatId) || roomMessage.find(msg=>msg.id == props.selectedChatId)

    return {
        curUserId,
        chatType,
        chat,
        msg
    }
}

export default connect(mapStateToProps, {
    sendTextMessage,
    sendImageMessage,
    sendAudioMessage
})(ChatManage)
