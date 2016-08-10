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

class ChatPanel extends Component {
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

    search() {
        this.setState({searchFlag: true})
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
            case 'patient':
            case 'doctor':
            case 'other':
                this.userChat(userOrGroup)
                break
            case 'group':
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

        function getHeader(type) {
            let title
            switch (type) {
                case 'patient':
                    title = '患者'
                    if (unReadChatCount > 0) {
                        return title + <span className="red">({unReadChatCount})</span>
                    }
                    return title
                case 'group':
                    title = '患者群组'
                    if (unReadGroupCount > 0) {
                        return title + <span className="red">({unReadGroupCount})</span>
                    }
                    return title
                case 'doctor':
                    return '医生'
                case 'other':
                    return '其他'
                default:
                    break
            }
        }

        let getList = (type, itemCallback)=> {
            return (
                <div>
                    <header className="list-head" onClick={e=> this.collapseList(type)}>
                        {getHeader(type)}
                    </header>
                    <Collapse in={this.state.collapse[type]}>
                        <ul>
                            {getListItem(type, itemCallback)}
                        </ul>
                    </Collapse>
                </div>
            )
        }

        let getListItem = (type, itemCallback)=> {
            let list
            switch (type) {
                case 'patient':
                    list = this.context.patients
                    break
                case 'group':
                    list = this.context.patientGroups
                    break
                case 'doctor':
                    list = this.context.doctorList
                    break
                case 'other':
                    list = []
                    break
            }
            return list.map((item, index) => {
                let key = this.state.searchKey
                let searchFlag = this.state.searchFlag
                if (searchFlag && key && item.nickname && item.nickname.indexOf(key) == -1) {
                    return null
                }
                return itemCallback(item, index)
            })
        }

        function getItemClass(item) {
            return classnames("list-item", {'active': item.active})
        }

        return (
            <div className="row chat-box">
                <div className="col-xs-3 contact-list">
                    <section className="row">
                        <div className="col-xs-8">
                            <input className="form-control" type="text" placeholder="输入账号" value={this.state.searchKey} onChange={e=>this.onChange(e)}/>
                        </div>
                        <div className="col-xs-4">
                            <button className="btn btn-primary" onClick={()=>this.search()}>搜索</button>
                        </div>
                    </section>
                    <section className="row mt-15">
                        {
                            getList('patient', (patient, index)=> {
                                return (
                                    <li key={index} className={getItemClass(patient)} onClick={e=> this.startChat('patient', patient)}>
                                        {patient.nickname || patient.name} {unreadMessage(patient.name, ChatType.CHAT)}
                                    </li>
                                )
                            })
                        }
                        {
                            getList('group', (patientGroup, index)=> {
                                return (
                                    <li key={index} className={getItemClass(patientGroup)} onClick={e=> this.startChat('group', patientGroup)}>
                                        {patientGroup.name} {unreadMessage(patientGroup.roomId, ChatType.GROUP_CHAT)}
                                    </li>
                                )
                            })
                        }
                        {
                            getList('doctor', (doctor, index) => {
                                return (
                                    <li key={index} className={getItemClass(doctor)} onClick={e=> this.startChat('doctor', doctor)}>
                                        {doctor.nickname || doctor.name} {unreadMessage(doctor.name, ChatType.CHAT)}
                                    </li>
                                )
                            })
                        }
                    </section>
                </div>
                {this.state.chatType == ChatType.CHAT ? <UserChat user={this.state.user}/> : null}
                {this.state.chatType == ChatType.GROUP_CHAT ? <GroupChat room={this.state.room}/> : null}
            </div>
        )
    }
}

export default ChatPanel
