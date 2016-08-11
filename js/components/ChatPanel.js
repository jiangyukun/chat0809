/**
 * jiangyukun on 2016/07/27 12:35
 */
import React, {Component, PropTypes} from 'react'
import {Collapse} from 'react-bootstrap'
import classnames from 'classnames'

import {ChatType} from '../constants/ChatConstants'
import GroupChat from './GroupChat'
import UserChat from './UserChat'
import MessageHelper from './core/MessageHelper'
import chatActions from '../actions/ChatActions'

const PATIENT = 'patient'
const GROUP = 'group'
const DOCTOR = 'doctor'
const OTHER = 'other'

export default class ChatPanel extends Component {
    static contextTypes = {
        patients: PropTypes.array,
        patientGroups: PropTypes.array,
        doctorList: PropTypes.array,
        message: PropTypes.array
    }

    beforeActiveChat = null

    constructor(props) {
        super(props)
        this.state = {
            searchKey: '',
            chatType: '',
            lastChatRoomId: '',
            collapse: {
                patient: true,
                group: true,
                doctor: true,
                other: true
            }
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
                name: patient.name,
                nickname: patient.nickname
            }
        })
        chatActions.beginUserChat(patient.name)
    }

    groupChat(patientGroup) {
        this.setState({
            chatType: ChatType.GROUP_CHAT,
            room: {
                roomId: patientGroup.roomId,
                roomName: patientGroup.name
            }
        })
        chatActions.beginGroupChat(patientGroup.roomId)
    }

    collapseList(type) {
        let collapse = this.state.collapse
        collapse[type] = !collapse[type]
        this.setState({collapse})
    }

    render() {
        let unReadPatientCount = 0, unReadDoctorCount = 0, unReadOtherCount = 0, unReadGroupCount = 0
        let message = this.context.message

        this.context.patients.map((patient) => {
            unReadPatientCount += MessageHelper.getUnreadCount(message, patient.name, ChatType.CHAT)
        })
        this.context.doctorList.map((doctor) => {
            unReadDoctorCount += MessageHelper.getUnreadCount(message, doctor.name, ChatType.CHAT)
        })
        this.context.patientGroups.map((patientGroup) => {
            unReadGroupCount += MessageHelper.getUnreadCount(message, patientGroup.roomId, ChatType.GROUP_CHAT)
        })

        function unreadMessage(name, type) {
            let count = MessageHelper.getUnreadCount(message, name, type)
            return count > 0 ? <span className="red">({count})</span> : ''
        }

        function getHeader(type) {
            let title, count = null
            switch (type) {
                case PATIENT:
                    title = '患者'
                    if (unReadPatientCount > 0) {
                        count = <span className="red">({unReadPatientCount})</span>
                    }
                    break
                case GROUP:
                    title = '患者群组'
                    if (unReadGroupCount > 0) {
                        count = <span className="red">({unReadGroupCount})</span>
                    }
                    break
                case DOCTOR:
                    title = '医生'
                    if (unReadDoctorCount > 0) {
                        count = <span className="red">({unReadDoctorCount})</span>
                    }
                    break
                case OTHER:
                    title = '其他'
                    break
                default:
                    break
            }
            return (
                <span>{title}{count}</span>
            )
        }

        let getList = type=> {
            if (type == OTHER) {
                let otherMessage = MessageHelper.getUnMarkMessage(message)
                if (!otherMessage || otherMessage.length == 0) {
                    return null
                }
            }
            return (
                <div>
                    <header className="list-head" onClick={e=> this.collapseList(type)}>
                        {getHeader(type)}
                    </header>
                    <Collapse in={this.state.collapse[type]}>
                        <ul>
                            {getListItem(type)}
                        </ul>
                    </Collapse>
                </div>
            )
        }

        let getListItem = type=> {
            let list, chatType = ChatType.CHAT
            switch (type) {
                case PATIENT:
                    list = this.context.patients
                    break
                case GROUP:
                    list = this.context.patientGroups
                    chatType = ChatType.GROUP_CHAT
                    break
                case DOCTOR:
                    list = this.context.doctorList
                    break
                case OTHER:
                    list = MessageHelper.getUnMarkMessage(message)
                    break
            }
            return list.map((item, index) => {
                if (type != OTHER) {
                    if (chatType == ChatType.CHAT) {
                        MessageHelper.markMessage(message, chatType, item.name)
                    } else {
                        MessageHelper.markMessage(message, chatType, item.roomId)
                    }
                }
                let key = this.state.searchKey
                let idInfo = ' '
                if (key) {
                    if (chatType == ChatType.CHAT) {
                        if (item.name != item.nickname) {
                            idInfo = '(' + item.name + ')'
                        }
                        if ((!item.nickname || item.nickname.indexOf(key) == -1) && (!item.name || item.name.indexOf(key) == -1)) return null
                    }
                    if (chatType == ChatType.GROUP_CHAT) {
                        if (!item.name || item.name.indexOf(key) == -1) return null
                    }
                }

                return (
                    <li key={index} className={getItemClass(item)} onClick={e=> this.startChat(type, item)}>
                        { chatType == ChatType.CHAT ? (item.nickname || item.name) + idInfo : (item.name || item.roomId) }
                        { chatType == ChatType.CHAT ? unreadMessage(item.name, chatType) : unreadMessage(item.roomId, chatType) }
                    </li>
                )
            })
        }

        function getItemClass(item) {
            return classnames("list-item", {'active': item.active})
        }

        return (
            <div className="chat-body">
                <div className="container-fluid h100-pct">
                    <div className="row h100-pct">
                        <div className="col-xs-3 contact-list">
                            <section className="row">
                                <div className="col-xs-12">
                                    <input className="form-control" type="text" placeholder="输入账号" value={this.state.searchKey} onChange={e=>this.onChange(e)}/>
                                </div>
                            </section>
                            <section className="row mt-15">
                                {                    getList(PATIENT)              }
                                {                    getList(GROUP)                 }
                                {                    getList(DOCTOR)                }
                                {                    getList(OTHER)                 }
                            </section>
                        </div>
                        <div className="col-xs-9 message-box">
                            {this.state.chatType == ChatType.CHAT && <UserChat user={this.state.user}/>}
                            {this.state.chatType == ChatType.GROUP_CHAT && <GroupChat room={this.state.room}/>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
