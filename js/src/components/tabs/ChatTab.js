/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames'
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
                            this.props.convertChatList.map(convertChat=> {
                                return (
                                    <div key={convertChat.id}>
                                        <div className={classnames('chat_item', 'slide-left', {'active': this.props.selectedChatId == convertChat.id})}
                                             onClick={e=>this.props.startChat(convertChat.id, ChatType.CHAT)}>
                                            <div className="ext">
                                                <div className="attr"></div>
                                            </div>

                                            <div className="avatar">
                                                <img className="img" src="img/default.jpg" alt=""/>
                                            </div>

                                            <div className="info">
                                                <h3 className="nickname">
                                                    <span className="nickname_text">{convertChat.nickname}</span>
                                                </h3>
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
    let {chatList, patients, rooms, doctors} = state
    let convertChatList = chatList.map(chat=> {
        let nickname = ''
        if (chat.chatType == ChatType.CHAT) {
            let p = patients.find(patient=>patient.name == chat.id)
            if (p) {
                nickname = p.nickname
            }
            let d = doctors.find(doctor=>doctor.name == chat.id)
            if (d) {
                nickname = d.nickname
            }
        } else {
            let room = rooms.find(room=>room.id == chat.id)
            if (room) {
                nickname = room.name
            }
        }
        return {
            id: chat.id,
            nickname,
            txt: chat.txt
        }
    })

    return {
        convertChatList
    }
}

export default connect(mapStateToProps)(ChatTab)
