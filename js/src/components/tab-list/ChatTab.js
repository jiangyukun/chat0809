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
                            this.props.singleMessage.map(msg=> {
                                return (
                                    <div key={msg.name}>
                                        <div className={classnames('chat_item', 'slide-left', {'active': this.props.selectedChatId == msg.name})}
                                                onClick={e=>this.props.startChat(msg.name, ChatType.CHAT)}>
                                            <div className="ext">
                                                <div className="attr"></div>
                                            </div>

                                            <div className="avatar">
                                                <img className="img" src="img/default.jpg" alt=""/>
                                            </div>

                                            <div className="info">
                                                <h3 className="nickname">
                                                    <span className="nickname_text">{msg.name}</span>
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
    let {singleMessage} = state
    return {
        singleMessage
    }
}

export default connect(mapStateToProps)(ChatTab)
