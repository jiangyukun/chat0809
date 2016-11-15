/**
 * Created by jiangyukun on 2016/11/11.
 */
import React, {Component, PropTypes} from 'react'

import Message from '../message/Message'
import SendBox from './SendBox'
import RoomMembers from './RoomMembers'
import {ChatType, DIR} from '../../constants/ChatConstants'

class ChatPanel extends Component {
    constructor() {
        super()
        this.state = {showRoomMember: false}
    }

    render() {
        let {convertChat, msg} = this.props
        let {chatType} = convertChat
        let empty = !msg || ( msg.reads.length == 0 && msg.unreads.length == 0)

        let showMessage = message => {
            let dir = message.from == this.props.curUserId ? DIR.RIGHT : DIR.LEFT
            return (
                <div key={message.id}>
                    <div className="clearfix">
                        <div>
                            <Message dir={dir}
                                     chatTime={message.chatTime}
                                     msgType={message.type}
                                     data={message.data}/>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="box chat">
                <div className="box_hd">
                    <div className="title_wrap">
                        <div className="title poi" onClick={e => this.setState({showRoomMember: !this.state.showRoomMember})}>
                            <a className="title_name">{convertChat.nickname || convertChat.id}</a>
                            {
                                chatType == ChatType.GROUP_CHAT && (
                                    <span className="title_count ">({this.props.members.length || ''})</span>
                                )
                            }
                            <i className="web_wechat_down_icon"></i>
                        </div>
                    </div>
                    {
                        chatType == ChatType.GROUP_CHAT && this.state.showRoomMember && (
                            <RoomMembers members={this.props.members} close={() => this.setState({showRoomMember: false})}/>
                        )
                    }
                </div>

                <div className="scroll-wrapper box_bd chat_bd scrollbar-dynamic">
                    <div className="box_bd chat_bd scrollbar-dynamic scroll-content">
                        {
                            !empty && (
                                <div>
                                    {
                                        msg.reads.map(read => showMessage(read))
                                    }
                                    {
                                        msg.unreads.map(unread => showMessage(unread))
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

                <SendBox {...this.props} chatType={convertChat.chatType}/>
            </div>
        )
    }
}

ChatPanel.propTypes = {
    convertChat: PropTypes.object,
    msg: PropTypes.object,
    members: PropTypes.array,
    curUserId: PropTypes.string,
    to: PropTypes.string,
    sendText: PropTypes.func,
    sendPicture: PropTypes.func
}

export default ChatPanel
