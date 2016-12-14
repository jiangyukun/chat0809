/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'

import {ChatType} from '../../../constants/ChatConstants'

class RoomDetail extends Component {
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
                            <div className="meta_area">
                                <div className="meta_item">
                                    <label className="label">群名：</label>
                                    <p className="value">{match.nickname || match.name}</p>
                                </div>
                            </div>
                            <div className="action_area">
                                <a className="button" href="javascript:;" onClick={e=>this.props.startChat(match, ChatType.GROUP_CHAT)}>发消息</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default RoomDetail
