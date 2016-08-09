/**
 * jiangyukun on 2016/07/27 12:35
 */
import React, {Component, PropTypes} from 'react'
import {Collapse} from 'react-bootstrap'
import {ChatType} from '../constants/ChatConstants'
import GroupChat from './GroupChat'
import UserChat from './UserChat'
import MessageHelper from './core/MessageHelper'
import chatActions from '../actions/ChatActions'

class ChatPanel extends Component {
    static contextTypes = {
        patients: PropTypes.array,
        patientGroups: PropTypes.array,
        doctorList: PropTypes.array,
        message: PropTypes.array
    }

    constructor(props) {
        super(props)
        this.state = {
            searchKey: '',
            chatType: '',
            lastChatRoomId: '',
            userListOpenFlag: true,
            groupListOpenFlag: true,
            doctorListOpenFlag: true
        }
    }

    onChange(e) {
        this.setState({searchKey: e.target.value})
    }

    search() {
        this.setState({searchFlag: true})
    }

    userChat(patient) {
        if (this.state.chatType == ChatType.CHAT && this.state.lastChatRoomId == patient.name) {
            return
        }
        this.state.lastChatRoomId = patient.name

        this.setState({
            chatType: ChatType.CHAT,
            user: {
                name: patient.name,
                nickname: patient.nickname
            }
        })
        chatActions.readMessage(patient.name, ChatType.CHAT)
    }

    groupChat(patientGroup) {
        if (this.state.chatType == ChatType.GROUP_CHAT && this.state.lastChatRoomId == patientGroup.roomId) {
            return
        }
        this.state.lastChatRoomId = patientGroup.roomId
        this.setState({
            chatType: ChatType.GROUP_CHAT,
            room: {
                roomId: patientGroup.roomId,
                roomName: patientGroup.name
            }
        })
        chatActions.readMessage(patientGroup.roomId, ChatType.GROUP_CHAT)
        chatActions.beginGroupChat(patientGroup.roomId)
    }

    componentDidUpdate() {
    }

    render() {
        let unReadChatCount = 0, unReadGroupCount = 0
        let message = this.context.message

        this.context.patients.map((patient) => {
            unReadChatCount += MessageHelper.getUnreadCount(message, patient.name, ChatType.CHAT)
        })

        this.context.patientGroups.map((patientGroup) => {
            unReadGroupCount += MessageHelper.getUnreadCount(message, patientGroup.roomId, ChatType.GROUP_CHAT)
        })

        function unreadMessage(name, type) {
            let count = MessageHelper.getUnreadCount(message, name, type)
            return count > 0 ? <span className="red">({count})</span> : null
        }

        return (
            <div className="row chat-box">
                <div className="col-xs-3 contact-list">
                    <section className="row">
                        <div className="col-xs-8">
                            <input className="form-control" type="text" placeholder="输入账号" value={this.state.searchKey} onChange={e=>this.onChange(e)}/>
                        </div>
                        <div className="col-xs-4">
                            <button className="btn btn-primary" onClick={()=>{this.search()}}>搜索</button>
                        </div>
                    </section>
                    <section className="row mt-15">
                        <header className="list-head" onClick={()=> {this.setState({'userListOpenFlag': !this.state.userListOpenFlag})}}>
                            患者{unReadChatCount > 0 && <span className="red">({unReadChatCount})</span>}
                        </header>
                        <Collapse in={this.state.userListOpenFlag}>
                            <ul>
                                {
                                    this.context.patients.map((patient, index) => {
                                        let key = this.state.searchKey
                                        let searchFlag = this.state.searchFlag
                                        if (searchFlag && key && patient.nickname.indexOf(key) == -1) {
                                            return null
                                        }
                                        return (
                                            <li key={index} className="list-item" onClick={()=> this.userChat(patient)}>
                                                {patient.nickname || patient.name} {unreadMessage(patient.name, ChatType.CHAT)}
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Collapse>
                        <header className="list-head" onClick={()=> {this.setState({'groupListOpenFlag': !this.state.groupListOpenFlag})}}>
                            患者群组{unReadGroupCount > 0 && <span className="red">({unReadGroupCount})</span>}
                        </header>
                        <Collapse in={this.state.groupListOpenFlag}>
                            <ul>
                                {
                                    this.context.patientGroups.map((patientGroup, index) => {
                                        let key = this.state.searchKey
                                        let searchFlag = this.state.searchFlag
                                        if (searchFlag && key && patientGroup.name.indexOf(key) == -1) {
                                            return null
                                        }
                                        return (
                                            <li key={index} className="list-item" onClick={()=> {this.groupChat(patientGroup)}}>
                                                {patientGroup.name} {unreadMessage(patientGroup.roomId, ChatType.GROUP_CHAT)}
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Collapse>
                        <header className="list-head" onClick={()=> {this.setState({'doctorListOpenFlag': !this.state.doctorListOpenFlag})}}>
                            医生
                        </header>
                        <Collapse in={this.state.doctorListOpenFlag}>
                            <ul>
                                {
                                    this.context.doctorList.map((doctor, index) => {
                                        let key = this.state.searchKey
                                        let searchFlag = this.state.searchFlag
                                        if (searchFlag && key && doctor.nickname.indexOf(key) == -1) {
                                            return null
                                        }
                                        return (
                                            <li key={index} className="list-item" onClick={()=> {this.userChat(doctor)}}>
                                                {doctor.nickname || doctor.name} {unreadMessage(doctor.name, ChatType.CHAT)}
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Collapse>
                    </section>
                </div>
                {this.state.chatType == ChatType.CHAT ? (<UserChat user={this.state.user}/>) : null}
                {this.state.chatType == ChatType.GROUP_CHAT ? (<GroupChat room={this.state.room}/>) : null}
            </div>
        )
    }
}

export default ChatPanel
