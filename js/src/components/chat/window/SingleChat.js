/**
 * Created by jiangyukun on 2016/11/16.
 */
import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'

import Message from '../../message/Message'
import SendBox from '../SendBox'
import {DIR} from '../../../constants/ChatConstants'

class SingleChat extends Component {
    constructor(props) {
        super(props)
        this.sendText = this.sendText.bind(this)
        this.sendPicture = this.sendPicture.bind(this)
    }

    sendText(...args) {
        this.props.sendText(...args)
        this._scrollToBottom()
    }

    sendPicture(...args) {
        this.props.sendPicture(...args)
        this._scrollToBottom()
    }

    componentDidMount() {
        if (!this._wrap) {
            return
        }
        this._scrollToBottom()
    }

    componentDidUpdate() {
        let {newMessage, from} = this.props.app
        if (newMessage && from == this.props.to) {
            this._scrollToBottom()
        }
    }

    render() {
        let {convertChat, message} = this.props
        let empty = !message || ( message.reads.length == 0 && message.unreads.length == 0)

        let showMessage = msg => {
            let dir = msg.from == this.props.curUserId ? DIR.RIGHT : DIR.LEFT
            return (
                <div key={msg.id}>
                    <div className="clearfix">
                        <div>
                            <Message dir={dir}
                                     chatTime={msg.chatTime}
                                     msgType={msg.type}
                                     data={msg.data}/>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="box chat">
                <div className="box_hd">
                    <div className="title_wrap">
                        <div className="title poi">
                            <a className="title_name">{convertChat.nickname || convertChat.id}</a>
                        </div>
                    </div>
                </div>

                <div className="scroll-wrapper box_bd chat_bd scrollbar-dynamic">
                    <div className="box_bd chat_bd scrollbar-dynamic scroll-content" ref={c => this._container = c}>
                        {
                            !empty && (
                                <div ref={c => this._wrap = c}>
                                    {
                                        message.reads.map(read => showMessage(read))
                                    }
                                    {
                                        message.unreads.map(unread => showMessage(unread))
                                    }
                                </div>
                            )
                        }
                        {
                            empty && (
                                <div className="message_empty">
                                    <p className="">暂时没有新消息</p>
                                </div>
                            )
                        }
                    </div>
                </div>

                <SendBox {...this.props}
                         sendText={this.sendText}
                         sendPicture={this.sendPicture}
                         chatType={convertChat.chatType}/>
            </div>
        )
    }

    _scrollToBottom() {
        let container = findDOMNode(this._container)
        let wrap = findDOMNode(this._wrap)
        let containerHeight = container.clientHeight
        container.scrollTop = wrap.clientHeight - containerHeight
    }
}

export default SingleChat
