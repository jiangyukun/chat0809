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

const PATIENT = 'patient'
const GROUP = 'group'
const DOCTOR = 'doctor'
const OTHER = 'other'

class ChatPanel extends Component {
    static contextTypes = {
        patients: PropTypes.array,
        rooms: PropTypes.array,
        doctors: PropTypes.array
    }

    constructor(props) {
        super(props)
        this.beforeActiveChat = null
        this.state = {
            searchKey: '',
            chatType: '',
            lastChatRoomId: ''
        }
    }

    onChange(e) {
        this.setState({searchKey: e.target.value})
    }

    startChat(type, userOrGroup) {
        if (this.beforeActiveChat == userOrGroup) {
            return
        }
        if (this.beforeActiveChat) {
            this.beforeActiveChat.active = false
        }
        this.beforeActiveChat = userOrGroup
        userOrGroup.active = true
        switch (type) {
            case PATIENT:
            case DOCTOR:
            case OTHER:
                this.userChat(userOrGroup)
                break
            case GROUP:
                this.groupChat(userOrGroup)
                break
            default:
                break
        }
    }

    userChat(patient) {
        this.setState({
            chatType: ChatType.CHAT,
            user: {
                id: patient.id,
                name: patient.name,
                nickname: patient.nickname
            }
        })
        this.props.actions.startSingleChat(this.props.curUserId, patient)
    }

    groupChat(room) {
        this.setState({
            chatType: ChatType.GROUP_CHAT,
            room: {
                id: room.id,
                name: room.name
            }
        })
        this.props.actions.startRoomChat(room)
    }

    render() {
        return (
            <div className="chat-body">
                <div className="container-fluid h100-pct">
                    <div className="row h100-pct">
                        <div className="col-xs-3 contact-list">
                            <section className="row">
                                <div className="col-xs-12">
                                    <input className="form-control" type="text" placeholder="输入账号"
                                           value={this.state.searchKey} onChange={e=>this.onChange(e)}
                                    />
                                </div>
                            </section>
                            <section className="row mt-15">
                                <PatientList patients={this.props.patients}
                                             singleMessage={this.props.singleMessage}
                                             searchKey={this.state.searchKey}
                                             startChat={patient=>this.startChat('patient', patient)}/>

                                <GroupList rooms={this.props.rooms}
                                           roomMessage={this.props.roomMessage}
                                           searchKey={this.state.searchKey}
                                           startChat={group=>this.startChat('group', group)}/>

                                <DoctorList doctors={this.props.doctors}
                                            singleMessage={this.props.singleMessage}
                                            searchKey={this.state.searchKey}
                                            startChat={doctor=>this.startChat('doctor', doctor)}/>

                                {/*<OtherList
                                 message={this.context.message}
                                 searchKey={this.state.searchKey}
                                 startChat={other=>this.startChat('other', other)}/>*/}
                            </section>
                        </div>
                        <div className="col-xs-9 message-box">
                            {
                                this.state.chatType == ChatType.CHAT && (
                                    <UserChat user={this.state.user}
                                              singleMessage={this.props.singleMessage.find(msg=>msg.name == this.state.user.name)}
                                    />
                                )
                            }
                            {
                                this.state.chatType == ChatType.GROUP_CHAT && (
                                    <GroupChat room={this.state.room}
                                               roomMessage={this.props.roomMessage.find(msg=>msg.id == this.state.room.id)}
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
