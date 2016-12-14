/**
 * Created by jiangyukun on 2016/11/16.
 */
import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'

import Message from '../../message/Message'
import SendBox from '../SendBox'
import RoomMembers from './RoomMembers'
import {MessageType, DIR} from '../../../constants/ChatConstants'
import {fromNow} from '../../../core/utils/dateUtil'
import huanxinUtils from '../../../core/utils/huanxinUtils'

class RoomChat extends Component {
    constructor() {
        super()
        this.sendText = this.sendText.bind(this)
        this.sendPicture = this.sendPicture.bind(this)
        this.pictureLoaded = this.pictureLoaded.bind(this)
        this.onRoomMemberClose = this.onRoomMemberClose.bind(this)
        this.state = {showRoomMember: false}
    }

    onRoomMemberClose() {
        this.setState({showRoomMember: false})
    }

    toggleRoomMembers() {
        this.setState({showRoomMember: !this.state.showRoomMember})
        this._roomMembers.toggle()
    }

    sendText(...args) {
        this.props.sendText(...args)
        this._scrollToBottom()
    }

    sendPicture(...args) {
        this.props.sendPicture(...args)
        this._scrollToBottom()
    }

    pictureLoaded() {
        this._scrollToBottom()
    }

    componentDidMount() {
        // 每60秒更新时间显示
        this.taskId = setInterval(() => this.forceUpdate(), 60 * 1000)

        if (!this._wrap) {
            return
        }
        this._scrollToBottom()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.to != nextProps.to) {
            this._scrollBottomFlag = true
        }
    }

    componentDidUpdate() {
        //切换联系人时
        if (this._scrollBottomFlag) {
            this._scrollToBottom()
            return
        }

        //收到新消息时
        let {newMessage, to} = this.props.app
        if (newMessage && to == this.props.to) {
            this._scrollToBottom()
        }
    }

    componentWillUnmount() {
        clearInterval(this.taskId)
    }

    render() {
        let {convertChat, message} = this.props
        let empty = !message || ( message.reads.length == 0 && message.unreads.length == 0)
        let lastChatTime = null

        let showMessage = msg => {
            const {id, from, chatTime, type, data} = msg
            let convertData = data, convertChatTime = fromNow(chatTime)
            let dir = from == this.props.curUserId ? DIR.RIGHT : DIR.LEFT
            if (type == MessageType.TEXT && typeof data == 'string') {
                convertData = huanxinUtils.parseTextMessage(data)
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
                                     pictureLoaded={() => this._scrollToBottom()}/>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="box chat">
                <div className="box_hd">
                    <div className="title_wrap">
                        <div className="title poi" onClick={e => this.toggleRoomMembers()}>
                            <a className="title_name">{convertChat.nickname || convertChat.id}</a>
                            <span className="title_count ">({this.props.members.length || ''})</span>
                            {
                                this.state.showRoomMember ? <i className="web_wechat_up_icon"></i> : <i className="web_wechat_down_icon"></i>
                            }
                        </div>
                    </div>

                    <RoomMembers members={this.props.members} onClose={this.onRoomMemberClose} ref={c => this._roomMembers = c}/>
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

                <SendBox curUserId={this.props.curUserId}
                         to={this.props.to}
                         sendText={this.sendText}
                         sendPicture={this.sendPicture}
                         chatType={convertChat.chatType}/>
            </div>
        )
    }

    //滚动到底部
    _scrollToBottom() {
        if (!this._wrap) {
            return
        }
        this._container.scrollTop = this._wrap.clientHeight - this._container.clientHeight
    }
}

export default RoomChat
