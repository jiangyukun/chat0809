/**
 * jiangyukun on 2016/07/27 12:35
 */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {ChatType} from '../constants/ChatConstants'
import PatientList from '../components/chat-list/PatientList'
import GroupList from '../components/chat-list/GroupList'
import DoctorList from '../components/chat-list/DoctorList'
import OtherList from '../components/chat-list/OtherList'
import GroupChat from './GroupChat'
import UserChat from './UserChat'
import {startSingleChat, startRoomChat, readSingleMessage} from '../actions/chat'

class ChatPanel extends Component {
    static contextTypes = {
        patients: PropTypes.array,
        rooms: PropTypes.array,
        doctors: PropTypes.array
    }

    constructor(props) {
        super(props)
        this.active = null
        this.chatType = null
        this.state = {
            searchKey: '',
            selectedId: null
        }
    }

    onChange(e) {
        this.setState({searchKey: e.target.value})
    }

    userChat(user) {
        if (this.preChat(user.name)) {
            return
        }
        this.props.actions.handleCurrentChat(this.chatType, this.state.selectedId)
        this.chatType = ChatType.CHAT
        this.user = {
            id: user.id,
            name: user.name,
            nickname: user.nickname
        }

        this.postChat(user.name)
        this.props.actions.startSingleChat(this.props.curUserId, user)
    }

    groupChat(room) {
        if (this.preChat(room.id)) {
            return
        }
        this.props.actions.handleCurrentChat(this.chatType, this.state.selectedId)
        this.chatType = ChatType.GROUP_CHAT
        this.room = {
            id: room.id,
            name: room.name
        }
        this.postChat(room.id)
        this.props.actions.startRoomChat(room)
    }

    preChat(nextSelectId) {
        if (this.state.selectedId == nextSelectId) {
            return false
        }
    }

    postChat(nextSelectId) {
        this.setState({selectedId: nextSelectId})
    }

    render() {
        let others = this.props.singleMessage.filter(msg=>msg.isStranger).map(msg=> {
            return {
                id: msg.name,
                name: msg.name,
                nickname: msg.name
            }
        })
        return (
            <div className="chat-body">
                <div className="container-fluid h100-pct">
                    <div className="row h100-pct">
                        <div className="col-xs-3 contact-list">
                            <section className="row">
                                <div className="col-xs-12">
                                    <input className="form-control" type="text" placeholder="输入账号"
                                           value={this.state.searchKey} onChange={e=>this.onChange(e)}/>
                                </div>
                            </section>
                            <section className="row mt-15">
                                <PatientList
                                    selectedId={this.state.selectedId}
                                    patients={this.props.patients}
                                    singleMessage={this.props.singleMessage}
                                    searchKey={this.state.searchKey}
                                    startChat={patient=>this.userChat(patient)}/>

                                <GroupList
                                    selectedId={this.state.selectedId}
                                    rooms={this.props.rooms}
                                    roomMessage={this.props.roomMessage}
                                    searchKey={this.state.searchKey}
                                    startChat={group=>this.groupChat(group)}/>

                                <DoctorList
                                    selectedId={this.state.selectedId}
                                    doctors={this.props.doctors}
                                    singleMessage={this.props.singleMessage}
                                    searchKey={this.state.searchKey}
                                    startChat={doctor=>this.userChat(doctor)}/>

                                <OtherList
                                    selectedId={this.state.selectedId}
                                    others={others}
                                    singleMessage={this.props.singleMessage}
                                    searchKey={this.state.searchKey}
                                    startChat={other=>this.userChat(other)}/>
                            </section>
                        </div>
                        <div className="col-xs-9 message-box">
                            {
                                this.chatType == ChatType.CHAT && (
                                    <UserChat
                                        app={this.props.app}
                                        user={this.user}
                                        singleMessage={this.props.singleMessage.find(msg=>msg.name == this.user.name)}
                                    />
                                )
                            }
                            {
                                this.chatType == ChatType.GROUP_CHAT && (
                                    <GroupChat
                                        room={this.room}
                                        roomMessage={this.props.roomMessage.find(msg=>msg.id == this.room.id)}
                                        members={this.props.members}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatPanel
