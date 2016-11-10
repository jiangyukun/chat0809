/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'

class ChatTab extends Component {

    render() {
        return (
            <div className="nav_view">
                <div className="chat_list scrollbar-dynamic scroll-content scroll-scrolly_visible">
                    {/*<p className="ico_loading ng-hide">
                        <img src="img/loading.gif" alt=""/>正在获取最近的聊天...
                    </p>*/}
                    <div>
                        <div>
                            <div className="chat_item slide-left active">
                                <div className="ext">
                                    <div className="attr"></div>
                                </div>

                                <div className="avatar">
                                    <img className="img" src="img/default.jpg" alt=""/>
                                </div>

                                <div className="info">
                                    <h3 className="nickname">
                                        <span className="nickname_text">江雨</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    let {patients, doctors, rooms} = state
    return {
        patients, doctors, rooms
    }
}

export default connect()(ChatTab)
