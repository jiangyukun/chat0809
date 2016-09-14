/*
 * jiangyukun on 2016-07-30 11:35
 */
import React, {Component, PropTypes} from 'react'
import {findDOMNode}  from 'react-dom'

import Message from './Message'
import SendMessageBox from './SendMessageBox'
import {ChatType} from '../constants/ChatConstants'
import MessageHelper from './core/MessageHelper'
import HistoryMessage from './HistoryMessage'

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
        let message = this.context.message
        let to = this.props.user.name
        let nickname = this.props.user.nickname
        let historyMessageList = MessageHelper.getMessageByName(message, to, ChatType.CHAT).historyMessages

        setTimeout(()=> {
            var container = findDOMNode(this.refs['messageItemList'])
            var wrap = findDOMNode(this.refs['messageListWrap'])

            var containerHeight = container.clientHeight
            container.scrollTop = wrap.clientHeight - containerHeight
        }, 20)

        return (
            <div className="row h100-pct">
                <div className="col-xs-8 user-chat-box h100-pct">
                    <div className="message-box-title">
                        <span>与 {nickname}{nickname != to && '(' + to + ')'} 聊天中</span>
                    </div>
                    <div className="history-message" ref="messageItemList">
                        <div className="message-list-wrap clearfix" ref="messageListWrap">
                            {this.showMessage()}
                        </div>
                    </div>
                    <SendMessageBox ref="sendMessageBox" to={to} type={ChatType.CHAT}/>
                </div>
                <div className="col-xs-4 h100-pct">
                    <div className="row h100-pct">
                        <HistoryMessage historyMessage={historyMessageList}/>
                    </div>
                </div>
            </div>
        )
    }
}
