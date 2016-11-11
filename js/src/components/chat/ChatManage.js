/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'

import {ChatType, ContactType} from '../../constants/ChatConstants'
import Tab from '../Tab'
import ChatPanel from './ChatPanel'
import NoChat from './NoChat'
import NoContact from './NoContact'
import UserDetail from './UserDetail'
import RoomDetail from './RoomDetail'

import {sendTextMessage, sendImageMessage, sendAudioMessage} from '../../actions/chat'

class ChatManage extends Component {

    render() {
        return (
            <div style={{height: '100%'}}>
                {
                    this.props.currentTab == Tab.CHAT_TAB && !this.props.selectedChatId && <NoChat/>
                }
                {
                    this.props.currentTab == Tab.CHAT_TAB && this.props.selectedChatId &&
                    <ChatPanel msg={this.props.msg}
                               curUserId={this.props.curUserId}
                               chatType={this.props.chatType}
                               to={this.props.selectedChatId}
                               sendText={this.props.sendTextMessage}/>
                }
                {
                    this.props.currentTab == Tab.FRIENDS_TAB && !this.props.contactType &&
                    <NoContact/>
                }
                {
                    this.props.currentTab == Tab.FRIENDS_TAB && this.props.contactType == ContactType.SINGLE &&
                    <UserDetail match={this.props.match}
                                startChat={this.props.startChat}/>
                }
                {
                    this.props.currentTab == Tab.FRIENDS_TAB && this.props.contactType == ContactType.ROOM &&
                    <RoomDetail match={this.props.match}/>
                }
            </div>
        )
    }
}

function mapStateToProps(state, props) {

    let {curUserId, patients, doctors, rooms, singleMessage, roomMessage} = state
    let chatType, contactType, msg

    let match
    if ((match = patients.filter(patient=>patient.name == props.selectedContactId)) && match.length) {
        contactType = ContactType.SINGLE
    } else if ((match = doctors.filter(doctor=>doctor.name == props.selectedContactId)) && match.length) {
        contactType = ContactType.SINGLE
    } else if ((match = rooms.filter(room=>room.id == props.selectedContactId)) && match.length) {
        contactType = ChatType.ROOM
    }

    msg = singleMessage.find(msg=>msg.name == props.selectedChatId)
    chatType = ChatType.CHAT
    if (!msg) {
        msg = roomMessage.find(msg=>msg.id == props.selectedChatId)
        chatType = ChatType.GROUP_CHAT
    }
    return {
        curUserId,
        chatType,
        contactType,
        msg,
        match: match && match[0]
    }
}

export default connect(mapStateToProps, {
    sendTextMessage,
    sendImageMessage,
    sendAudioMessage
})(ChatManage)
