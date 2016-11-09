/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'

class Tab extends Component {

    render() {
        return (
            <div className="tab">
                <div className="tab_item">
                    <a className="chat" onDoubleClick={e=>this.click(e)} title="聊天" href="#">
                        <i className="web_wechat_tab_chat"></i>
                    </a>
                </div>

                <div className="tab_item">
                    <a className="chat" title="阅读" href="#">
                        <i className="web_wechat_tab_public">

                        </i>
                    </a>
                </div>

                <div className="tab_item no_extra">
                    <a className="chat" title="通讯录" href="#">
                        <i className="web_wechat_tab_friends"></i>
                    </a>
                </div>
            </div>
        )
    }
}

export default Tab
