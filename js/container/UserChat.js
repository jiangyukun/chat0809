/*
 * jiangyukun on 2016-07-30 11:35
 */
import React, {Component, PropTypes} from 'react'
import {findDOMNode}  from 'react-dom'

import Message from '../components/Message'
import SendMessageBox from './SendMessageBox'
import {ChatType} from '../constants/ChatConstants'
import HistoryMessage from '../components/HistoryMessage'

export default class UserChat extends Component {
    static contextTypes = {
        curUserId: PropTypes.string,
        message: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.state = {newMessage: ''}
    }

    showReadMessage() {
        return this.props.singleMessage.reads.map((msg, index) => {
            return <Message key={index}
                            msg={msg}
                            dir={this.context.curUserId == msg.from ? 'right' : 'left'}
            />
        })
    }

    showUnReadMessage() {
        return this.props.singleMessage.unreads.map((msg, index) => {
            return <Message key={index}
                            msg={msg}
                            dir={this.context.curUserId == msg.from ? 'right' : 'left'}
            />
        })
    }

    render() {
        let singleMessage = this.props.singleMessage
        let to = this.props.user.name
        let nickname = this.props.user.nickname
        let historyMessageList = singleMessage.historyMessages

        setTimeout(()=> {
            var container = findDOMNode(this.refs['messageItemList'])
            var wrap = findDOMNode(this.refs['messageListWrap'])

            var containerHeight = container.clientHeight
            container.scrollTop = wrap.clientHeight - containerHeight
        }, 20)

        return (
            <div className="row h100-pct">
                <div className="col-xs-8 user-chat-box h100-pct">
                    <div className="row">
                        <div className="message-box-title">
                            <span>与 {nickname}{nickname != to && '(' + to + ')'} 聊天中</span>
                        </div>
                        <div className="history-message" ref="messageItemList">
                            <div className="message-list-wrap clearfix" ref="messageListWrap">
                                {this.showReadMessage()}
                                {this.showUnReadMessage()}
                            </div>
                        </div>
                        <SendMessageBox from={this.context.curUserId}
                                        to={this.props.user}
                                        type={ChatType.CHAT}
                        />
                    </div>
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
