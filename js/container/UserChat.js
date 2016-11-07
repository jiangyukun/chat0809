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
        if (!this.props.singleMessage) {
            return
        }
        return this.props.singleMessage.reads.map((msg, index) => {
            return <Message key={index}
                            msg={msg}
                            dir={this.context.curUserId == msg.from ? 'right' : 'left'}
            />
        })
    }

    showUnReadMessage() {
        let singleMessage = this.props.singleMessage
        if (!singleMessage || !singleMessage.unreads.length) {
            return
        }
        return (
            <div>
                <div className="text-center"><span className="new-message">new message</span></div>
                {
                    singleMessage.unreads.map((msg, index) => {
                        return <Message key={index}
                                        msg={msg}
                                        dir={this.context.curUserId == msg.from ? 'right' : 'left'}
                        />
                    })
                }
            </div>
        )
    }

    componentDidUpdate() {
        const app = this.props.app
        if (app.newMessage && app.from == this.props.user.name) {
            console.log(1)
            setTimeout(()=> {
                var container = findDOMNode(this.refs['messageItemList'])
                var wrap = findDOMNode(this.refs['messageListWrap'])

                var containerHeight = container.clientHeight
                container.scrollTop = wrap.clientHeight - containerHeight
            }, 20)
        }
    }

    render() {
        let historyMessage = this.props.historyMessage
        let to = this.props.user.name
        let nickname = this.props.user.nickname

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
                                        to={this.props.user.name}
                                        type={ChatType.CHAT}
                        />
                    </div>
                </div>
                <div className="col-xs-4 h100-pct">
                    <div className="row h100-pct">
                        <HistoryMessage historyMessage={historyMessage}/>
                    </div>
                </div>
            </div>
        )
    }
}
