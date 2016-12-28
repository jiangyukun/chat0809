/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames'

import busHelper from '../../core/busHelper'
import {ChatType} from "../../constants/ChatConstants"
import webImUtil from '../../core/utils/webImUtil'

class ChatTab extends Component {
    render() {
        let showChatInfo = (unreadCount, chatType) => {
            if (unreadCount == 0) {
                return null
            }
            if (chatType == ChatType.CHAT) {
                if (unreadCount < 100) {
                    return <i className="icon web_wechat_reddot_middle">{unreadCount}</i>
                }
                return <i className="icon web_wechat_reddot_bbig">{unreadCount}</i>
            }
            return <i className="icon web_wechat_reddot"></i>
        }

        let showChatTxt = (convertChat) => {
            let {chatType, lastContent, txt, unreadCount} = convertChat
            let content = lastContent || txt

            if (chatType == ChatType.GROUP_CHAT && unreadCount > 0) {
                content = '[' + unreadCount + '条]' + content
            }
            return <span>{content}</span>
        }

        return (
            <div className="nav_view">
                <div className="chat_list scrollbar-dynamic scroll-content scroll-scrolly_visible">
                    <div>
                        {
                            this.props.convertChatList.map(convertChat => {
                                let {id, chatType, unreadCount} = convertChat
                                return (
                                    <div key={convertChat.id}>
                                        <div className={classnames('chat_item', 'slide-left', {'active': this.props.selectedChatId == id})}
                                             onClick={e => this.props.startChat(id, chatType)}>
                                            <div className="ext">
                                                <div className="attr"></div>
                                            </div>

                                            <div className="avatar">
                                                <img className="img" src="img/default.jpg" alt=""/>
                                                {showChatInfo(unreadCount, chatType)}
                                            </div>

                                            <div className="info">
                                                <h3 className="nickname">
                                                    <span className="nickname_text">{convertChat.nickname || convertChat.id}</span>
                                                </h3>
                                                <p className="msg">
                                                    {showChatTxt(convertChat)}
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
    let convertChatList = chatList.map(chatItem => {
        let {id, chatType, txt} = chatItem
        let nickname = busHelper.getNickname(id, chatType, patients, doctors, rooms)
        let message = busHelper.getMessage(id, singleMessage, roomMessage)
        let unreadCount = 0, lastContent = ''
        if (message) {
            let {reads, unreads} = message
            unreadCount = unreads.length
            if (unreadCount != 0) {
                let {type, data} = unreads[unreads.length - 1]
                lastContent = webImUtil.handleContent(type, data)
            } else if (reads.length > 0) {
                let {type, data} = reads[reads.length - 1]
                lastContent = webImUtil.handleContent(type, data)
            }
        }
        return {
            id,
            chatType,
            nickname,
            txt,
            unreadCount,
            lastContent
        }
    })

    return {
        convertChatList
    }
}

export default connect(mapStateToProps)(ChatTab)
