/*
 * jiangyukun on 2016-07-30 11:35
 */
import React, {Component, PropTypes} from 'react'
import Message from './Message'
import SendMessageBox from './SendMessageBox'
import {ChatType} from '../constants/ChatConstants'
import MessageHelper from './core/MessageHelper'
import DoctorChatRecord from './DoctorChatRecord'

export default class UserChat extends Component {
    static contextTypes = {
        curUserId: PropTypes.string,
        message: PropTypes.array
    }

    constructor(props) {
        super(props)
        this.state = {newMessage: ''}
    }

    showMessage() {
        let message = this.context.message
        let name = this.props.user.name
        // chatActions.readMessage(name, ChatType.CHAT)
        return MessageHelper.showMessageToUI(message, name, ChatType.CHAT, (index, msg) => {
            return <Message key={index} msg={msg} dir={this.context.curUserId == msg.from ? 'right' : 'left'}/>
        })
    }

    componentDidUpdate() {
        this.refs['sendMessageBox'].clear()
    }

    render() {
        let to = this.props.user.name
        let nickname = this.props.user.nickname

        return (
            <div className="col-xs-9 message-box">
                <div className="row">
                    <div className="col-xs-8 user-chat-box">
                        <div className="row message-box-title">
                            <span>与 {nickname}{nickname != to && '(' + to + ')'} 聊天中</span>
                        </div>
                        <div className="row history-message">
                            {this.showMessage()}
                        </div>
                        <SendMessageBox ref="sendMessageBox" to={to} type={ChatType.CHAT}/>
                    </div>
                    <div className="col-xs-4">
                        <div className="row">
                            <DoctorChatRecord />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
