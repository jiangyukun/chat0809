/**
 * Created by jiangyukun on 2016/11/11.
 */
import React, {Component, PropTypes} from 'react'

import Message from '../message/Message'
import SendBox from './SendBox'
import {ChatType, DIR} from '../../constants/ChatConstants'

class ChatPanel extends Component {

    render() {
        let {chat, msg} = this.props
        let empty = !msg || ( msg.reads.length == 0 && msg.unreads.length == 0)

        let showMessage = message=> {

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
                        <div className="title poi">
                            <a className="title_name">{chat.id}</a>
                            <i className="web_wechat_down_icon"></i>
                        </div>
                    </div>
                </div>

                <div className="scroll-wrapper box_bd chat_bd scrollbar-dynamic">
                    <div className="box_bd chat_bd scrollbar-dynamic scroll-content">
                        {
                            !empty && (
                                <div>
                                    {
                                        msg.reads.map(read=> showMessage(read))
                                    }
                                    {
                                        msg.unreads.map(unread=> showMessage(unread))
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

                <SendBox {...this.props}/>
            </div>
        )
    }
}

ChatPanel.propTypes = {
    chat: PropTypes.object,
    msg: PropTypes.object,
    curUserId: PropTypes.string,
    chatType: PropTypes.oneOf([ChatType.CHAT, ChatType.GROUP_CHAT]),
    to: PropTypes.string,
    sendText: PropTypes.func,
    sendPicture: PropTypes.func
}

export default ChatPanel
