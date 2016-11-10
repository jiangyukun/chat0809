/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'

import {ChatType} from '../../constants/ChatConstants'
import Tab from '../Tab'
import NoChat from './NoChat'
import NoContact from './NoContact'
import UserDetail from './UserDetail'
import RoomDetail from './RoomDetail'

class ChatWindow extends Component {

    render() {
        return (
            <div style={{height: '100%'}}>
                {this.props.currentTab == Tab.CHAT_TAB && <NoChat/>}
                {
                    this.props.currentTab == Tab.FRIENDS_TAB && !this.props.chatType &&
                    <NoContact/>
                }
                {
                    this.props.currentTab == Tab.FRIENDS_TAB && this.props.chatType == ChatType.CHAT &&
                    <UserDetail match={this.props.match}
                                startChat={this.props.startChat}/>
                }
                {
                    this.props.currentTab == Tab.FRIENDS_TAB && this.props.chatType == ChatType.GROUP_CHAT &&
                    <RoomDetail match={this.props.match}/>
                }
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    let {patients, doctors, rooms} = state
    let chatType = null

    let match
    if ((match = patients.filter(patient=>patient.name == props.selectedContactId)) && match.length) {
        chatType = ChatType.CHAT
    } else if ((match = doctors.filter(doctor=>doctor.name == props.selectedContactId)) && match.length) {
        chatType = ChatType.CHAT
    } else if ((match = rooms.filter(room=>room.id == props.selectedContactId)) && match.length) {
        chatType = ChatType.GROUP_CHAT
    }
    return {
        chatType,
        match: match && match[0]
    }
}

export default connect(mapStateToProps)(ChatWindow)
