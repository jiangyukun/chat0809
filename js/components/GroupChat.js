/*
 * jiangyukun on 2016-07-30
 */
import React, {Component, PropTypes} from 'react'
import Message from './Message'
import SendMessageBox from './SendMessageBox'
import GroupMembers from './GroupMembers'
import {ChatType} from '../constants/ChatConstants'
import MessageHelper from './core/MessageHelper'

class GroupChat extends Component {
    static contextTypes = {
        curUserId: PropTypes.string,
        message: PropTypes.array
    }

    constructor(props) {
        super(props)
        this.state = {newGroupMessage: ''}
    }

    showMessage() {
        let message = this.context.message
        let roomId = this.props.room.roomId
        return MessageHelper.showMessageToUI(message, roomId, ChatType.GROUP_CHAT, (index, from, data) => {
            return <Message key={index} name={from} content={data} dir={this.context.curUserId == from ? 'right' : 'left'}/>
        })
    }

    componentDidUpdate() {
        this.refs['sendMessageBox'].clear()
    }

    render() {
        return (
            <div className="col-xs-9 message-box">
                <div className="row message-box-title">
                    <span>群组聊天中（{this.props.room.roomName}）</span>
                </div>
                <div className="row history-message">
                    <div className="col-xs-10">
                        {this.showMessage()}
                    </div>
                    <div className="col-xs-2 group-member-list">
                        <GroupMembers />
                    </div>
                </div>
                <SendMessageBox ref="sendMessageBox" to={this.props.room.roomId} type={ChatType.GROUP_CHAT}/>
            </div>
        )
    }
}

export default GroupChat
