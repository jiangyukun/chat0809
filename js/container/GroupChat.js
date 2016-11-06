/*
 * jiangyukun on 2016-07-30
 */
import React, {Component, PropTypes} from 'react'
import Message from '../components/Message'
import SendMessageBox from './SendMessageBox'
import GroupMembers from '../components/GroupMembers'
import {ChatType} from '../constants/ChatConstants'

export default class GroupChat extends Component {
    static contextTypes = {
        curUserId: PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {newGroupMessage: ''}
    }

    showMessage() {
        let roomMessage = this.props.roomMessage
        if (!roomMessage) {
            return null
        }
        return roomMessage.reads.map(read => {
            return <Message key={read.id}
                            msg={read}
                            dir={this.context.curUserId == read.from ? 'right' : 'left'}
            />
        })
    }

    componentDidUpdate() {
        this.sendMessageBox.getWrappedInstance().clear()
    }

    render() {
        return (
            <div className="row h100-pct">
                <div className="col-xs-12 h100-pct user-chat-box">
                    <div className="row message-box-title">
                        <span>群组聊天中（{this.props.room.name}）</span>
                    </div>
                    <div className="history-message">
                        <div className="col-xs-10">
                            {this.showMessage()}
                        </div>
                        <div className="col-xs-2 group-member-list">
                            <GroupMembers members={this.props.members}/>
                        </div>
                    </div>
                    <SendMessageBox ref={c=>this.sendMessageBox = c}
                                    from={this.context.curUserId}
                                    to={this.props.room.id}
                                    type={ChatType.GROUP_CHAT}/>
                </div>
            </div>
        )
    }
}
