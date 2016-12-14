/**
 * Created by jiangyukun on 2016/11/16.
 */
import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import CssTransitionGroup from 'react-addons-css-transition-group'

import Message from '../../message/Message'
import SendBox from '../SendBox'
import {MessageType, DIR} from '../../../constants/ChatConstants'
import {fromNow} from '../../../core/utils/dateUtil'
import huanxinUtils from '../../../core/utils/huanxinUtils'

class SingleChat extends Component {
    constructor(props) {
        super(props)
        this.sendText = this.sendText.bind(this)
        this.sendPicture = this.sendPicture.bind(this)
        this.toggleHistoryMessage = this.toggleHistoryMessage.bind(this)
        this.state = {showHistory: false}
    }

    sendText(...args) {
        this.props.sendText(...args)
        this._scrollToBottom()
    }

    sendPicture(...args) {
        this.props.sendPicture(...args)
        this._scrollToBottom()
    }

    toggleHistoryMessage() {
        this.setState({showHistory: !this.state.showHistory})
    }

    componentDidMount() {
        this._scrollToBottom()

        // 每60秒更新时间显示
        this.taskId = setInterval(() => this.forceUpdate(), 60 * 1000)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showHistory: false})
        if (this.props.to != nextProps.to) {
            this._scrollBottomFlag = true
        }
    }

    componentDidUpdate() {
        if (this.state.showHistory) {
            return
        }
        //切换联系人时
        if (this._scrollBottomFlag) {
            this._scrollToBottom()
            return
        }
        //收到新消息时
        let {newMessage, from} = this.props.app
        if (newMessage && from == this.props.to) {
            this._scrollToBottom()
        }
    }

    componentWillUnmount() {
        clearInterval(this.taskId)
    }

    render() {
        let {convertChat} = this.props

        function getUserInfo(convertChat) {
            if (!convertChat.nickname) {
                return convertChat.id
            }
            if (convertChat.nickname == convertChat.id) {
                return convertChat.nickname
            }
            return convertChat.nickname + ' (' + convertChat.id + ')'
        }

        return (
            <div className="box chat">
                <div className="box_hd">
                    <div className="title_wrap">
                        <div className="title poi">
                            {!this.state.showHistory && <a className="title_name">{getUserInfo(convertChat)}</a>}
                            {this.state.showHistory && <a className="title_name">与 {convertChat.nickname || convertChat.id} 的历史记录</a>}
                        </div>
                    </div>
                </div>

                <CurrentChatMessage message={this.props.message}
                                    curUserId={this.props.curUserId}
                                    ref={c => this._currentChatMessage = c}/>
                {
                    <HistoryMessage show={this.state.showHistory}
                                    curUserId={this.props.curUserId}
                                    historyMessage={this.props.historyMessage}/>
                }

                <SendBox curUserId={this.props.curUserId}
                         to={this.props.to}
                         sendText={this.sendText}
                         sendPicture={this.sendPicture}
                         chatType={convertChat.chatType}
                         toggleHistoryMessage={this.toggleHistoryMessage}/>
            </div>
        )
    }

    _scrollToBottom() {
        this._currentChatMessage.scrollToBottom()
    }
}

export default SingleChat

class CurrentChatMessage extends Component {
    render() {
        const {message} = this.props
        const empty = !message || ( message.reads.length == 0 && message.unreads.length == 0)
        let lastChatTime = null

        let showMessage = msg => {
            const {id, from, chatTime, type, data} = msg
            let convertData = data, convertChatTime = fromNow(chatTime)
            let dir = from == this.props.curUserId ? DIR.RIGHT : DIR.LEFT
            if (type == MessageType.TEXT) {
                if (typeof data == 'string') {
                    convertData = huanxinUtils.parseTextMessage(data)
                }
            }
            let showTime = true
            if (lastChatTime == convertChatTime) {
                showTime = false
            }
            lastChatTime = convertChatTime
            return (
                <div key={id}>
                    <div className="clearfix">
                        <div>
                            <Message from={from} dir={dir} chatTime={convertChatTime} msgType={type} data={convertData}
                                     showTime={showTime} pictureLoaded={() => this.scrollToBottom()}/>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="scroll-wrapper box_bd chat_bd scrollbar-dynamic">
                <div className="box_bd chat_bd scrollbar-dynamic scroll-content" ref={c => this._container = c}>
                    {
                        !empty && (
                            <div ref={c => this._wrap = c}>
                                {message.reads.map(showMessage)}
                                {message.unreads.map(showMessage)}
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
        )
    }

    //滚动到底部
    scrollToBottom() {
        if (!this._wrap) {
            return
        }
        this._container.scrollTop = this._wrap.clientHeight - this._container.clientHeight
    }
}

class HistoryMessage extends Component {
    render() {
        let {historyMessage} = this.props
        let empty = !historyMessage || historyMessage.length == 0
        let lastChatTime = null

        let showMessage = msg => {
            const {id, from, chatTime, type, data} = msg
            let convertData = data, convertChatTime = fromNow(chatTime)
            let dir = from == this.props.curUserId ? DIR.RIGHT : DIR.LEFT
            if (type == MessageType.TEXT) {
                if (typeof data == 'string') {
                    convertData = huanxinUtils.parseTextMessage(data)
                }
            }
            let showTime = true
            if (lastChatTime == convertChatTime) {
                showTime = false
            }
            lastChatTime = convertChatTime
            return (
                <div key={id}>
                    <div className="clearfix">
                        <div>
                            <Message dir={dir} showTime={showTime} from={from}
                                     chatTime={convertChatTime}
                                     msgType={type}
                                     data={convertData}/>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <CssTransitionGroup transitionName="slide-left" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
                {
                    this.props.show && (
                        <div className="scroll-wrapper box_bd chat_bd scrollbar-dynamic" style={{background: '#eaeaea'}}>
                            <div className="box_bd chat_bd scrollbar-dynamic scroll-content" ref={c => this._container = c}>
                                {
                                    !empty && (
                                        <div ref={c => this._wrap = c}>
                                            {this.props.historyMessage.map(showMessage)}
                                        </div>
                                    )
                                }
                                {
                                    empty && (
                                        <div className="message_empty">
                                            <p className="">无历史记录</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </CssTransitionGroup>
        )
    }
}
