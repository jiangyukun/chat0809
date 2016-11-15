/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames'

import busHelper from '../../core/busHelper'
import {ChatType} from "../../constants/ChatConstants";

class ChatTab extends Component {

    render() {
        return (
            <div className="nav_view">
                <div className="chat_list scrollbar-dynamic scroll-content scroll-scrolly_visible">
                    {/*<p className="ico_loading ng-hide">
                     <img src="img/loading.gif" alt=""/>正在获取最近的聊天...
                     </p>*/}
                    <div>
                        {
                            this.props.convertChatList.map(convertChat => {
                                let {unreadCount} = convertChat
                                return (
                                    <div key={convertChat.id}>
                                        <div className={classnames('chat_item', 'slide-left', {'active': this.props.selectedChatId == convertChat.id})}
                                             onClick={e => this.props.startChat(convertChat.id, convertChat.chatType)}>
                                            <div className="ext">
                                                <div className="attr"></div>
                                            </div>

                                            <div className="avatar">
                                                <img className="img" src="img/default.jpg" alt=""/>
                                                {
                                                    unreadCount > 0 && unreadCount < 100 &&
                                                    <i className="icon web_wechat_reddot_middle">{unreadCount}</i>
                                                }
                                                {
                                                    unreadCount > 100 &&
                                                    <i className="icon web_wechat_reddot_bbig">unreadCount</i>
                                                }
                                            </div>

                                            <div className="info">
                                                <h3 className="nickname">
                                                    <span className="nickname_text">{convertChat.nickname || convertChat.id}</span>
                                                </h3>
                                                <p className="msg">
                                                    <span>{convertChat.lastContent || convertChat.txt}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    let {chatList, patients, rooms, doctors, singleMessage, roomMessage} = state
    let convertChatList = chatList.map(chat => {
        let nickname = busHelper.getNickname(chat.id, chat.chatType, patients, doctors, rooms)
        let message = busHelper.getMessage(chat.id, singleMessage, roomMessage)
        let unreadCount = 0, lastContent = ''
        if (message) {
            unreadCount = message.unreads.length
            if (unreadCount != 0) {
                lastContent = message.unreads[message.unreads.length - 1].data
            } else if (message.reads.length > 0) {
                lastContent = message.reads[message.reads.length - 1].data
            }
        }
        return {
            id: chat.id,
            chatType: chat.chatType,
            nickname,
            txt: chat.txt,
            unreadCount,
            lastContent
        }
    })

    return {
        convertChatList
    }
}

export default connect(mapStateToProps)(ChatTab)
