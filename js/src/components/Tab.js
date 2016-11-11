/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'
import classnames from 'classnames'

class Tab extends Component {

    render() {
        return (
            <div className="tab">
                <div className="tab_item">
                    <a className="chat" onDoubleClick={e=>this.click(e)} onClick={e=>this.props.selectTab(Tab.CHAT_TAB)} title="聊天" href="javascript:;">
                        <i className={classnames('web_wechat_tab_chat', {'web_wechat_tab_chat_hl': this.props.currentTab == Tab.CHAT_TAB})}></i>
                    </a>
                </div>

                {/*<div className="tab_item">
                 <a className="chat" title="阅读" href="javascript:;" onClick={e=>this.props.selectTab(Tab.CHAT_TAB)}>
                 <i className="web_wechat_tab_public">
                 </i>
                 </a>
                 </div>*/}

                <div className="tab_item no_extra">
                    <a className="chat" title="通讯录" href="javascript:;" onClick={e=>this.props.selectTab(Tab.FRIENDS_TAB)}>
                        <i className={classnames('web_wechat_tab_friends', {'web_wechat_tab_friends_hl': this.props.currentTab == Tab.FRIENDS_TAB})}></i>
                    </a>
                </div>
            </div>
        )
    }
}

Tab.CHAT_TAB = 'chat_tab'
Tab.FRIENDS_TAB = 'friends_tab'

export default Tab
