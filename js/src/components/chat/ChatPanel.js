/**
 * Created by jiangyukun on 2016/11/11.
 */
import React, {Component} from 'react'

import SendBox from './SendBox'

class ChatPanel extends Component {

    render() {
        let {msg} = this.props
        let empty = msg.reads.length == 0 && msg.unreads.length == 0
        return (
            <div className="box chat">
                <div className="box_hd">
                    <div className="title_wrap">
                        <div className="title poi">
                            <a className="title_name">哈哈哈</a>
                            <i className="web_wechat_down_icon"></i>
                        </div>
                    </div>
                </div>

                <div className="scroll-wrapper box_bd chat_bd scrollbar-dynamic">
                    <div className="box_bd chat_bd scrollbar-dynamic scroll-content">
                        {
                            !empty && (
                                <div>
                                    <div>
                                        <div className="clearfix">
                                            <div>
                                                <div className="message me">
                                                    <p className="message_system">
                                                        <span className="content">10:30</span>
                                                    </p>
                                                    <img className="avatar" src="img/default.jpg"/>
                                                    <div className="content">
                                                        <div className="bubble js_message_bubble bubble_primary right">
                                                            <div className="bubble_cont">
                                                                <div className="plain">
                                                                    <pre className="js_message_plain ">aa</pre>
                                                                    <img src="img/loading.gif" className="ico_loading"/>
                                                                    <i className="ico_fail web_wechat_message_fail ng-hide" title="重新发送"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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

export default ChatPanel
