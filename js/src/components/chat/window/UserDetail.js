/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'

import {ChatType} from '../../../constants/ChatConstants'

class UserDetail extends Component {

    render() {
        let {match} = this.props
        return (
            <div className="box">
                <div className="box_hd with_border">
                    <div className="title_wrap">
                        <div className="title">详细信息</div>
                    </div>
                </div>

                <div className="box_bd">
                    <div>
                        <div className="profile">
                            <div className="avatar">
                                <img className="img" src="img/default.jpg"/>
                            </div>
                            <div className="nickname_area">
                                <h4 className="nickname">{match.nickname || match.name}</h4>
                                <i className="web_wechat_women"></i>
                            </div>
                            <p className="signature">努力做更好的自己，耐心等待花开的结局</p>
                            <div className="meta_area">
                                <div className="meta_item">
                                    <label className="label">备注：</label>
                                    <p className="value">小贝壳用户</p>
                                </div>
                            </div>
                            <div className="action_area">
                                <a className="button" href="javascript:" onClick={e => this.props.startChat(match, ChatType.CHAT)}>发消息</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserDetail
