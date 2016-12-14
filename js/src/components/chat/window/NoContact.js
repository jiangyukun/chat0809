/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'

class NoContact extends Component {
    render() {
        return (

            <div className="box">
                <div className="box_hd with_border">
                    <div className="title_wrap">
                        <div className="title">详细信息</div>
                    </div>
                </div>

                <div className="box_bd">
                    <div className="empty">
                        <i className="web_wechat_no_contect"></i>
                    </div>
                </div>
            </div>

        )
    }
}

export default NoContact
