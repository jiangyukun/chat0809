/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'

class NoChat extends Component {

    render() {
        return (
            <div className="box chat no-choose">
                <div className="box_hd">
                    <div className="title_wrap">
                        <div className="title poi">
                            <a className="title_name "></a>
                        </div>
                    </div>
                </div>
                <div className="scroll-wrapper box_bd chat_bd scrollbar-dynamic" style={{position: 'absolute'}}>
                    <div className="box_bd chat_bd scrollbar-dynamic scroll-content"></div>
                </div>
                <div className="message_empty">
                    <i className="web_wechat_nomes_icon"></i>
                    {/*<p className="">暂时没有新消息</p>*/}
                    <p className="">未选择聊天</p>
                </div>
            </div>
        )
    }
}

export  default NoChat
