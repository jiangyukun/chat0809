/**
 * jiangyukun on 2016/07/28 10:10
 */
import React, {Component, PropTypes} from 'react'
import {routerShape} from 'react-router'
import {connect} from 'react-redux'

import {exitChatSystem} from '../actions/chat'

class Header extends Component {
    static contextTypes = {
        curUserId: PropTypes.string,
        router: routerShape
    }

    exit() {
        this.props.exitChatSystem()
        this.context.router.push('/signin')
    }

    render() {

        function getLoginName(id) {
            switch (id) {
                case 'zxys':
                    return '在线医生'
                case 'bkkf':
                    return '贝壳客服'
                default:
                    break
            }
            return id
        }

        return (
            <div className="chat-header">
                <div className="container-fluid">
                    <header className="row">
                        <div className="col-xs-4">
                            <span className="chat-system-text">小贝壳聊天系统</span>
                        </div>
                        <div className="col-xs-4 text-center">
                            <span className="login-user">{getLoginName(this.context.curUserId)}</span>
                        </div>
                        <div className="col-xs-4">
                            <div className="pull-right exit">
                                <button className="btn" onClick={e=>this.exit()}>退出登录</button>
                            </div>
                        </div>
                    </header>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {
    exitChatSystem
})(Header)
