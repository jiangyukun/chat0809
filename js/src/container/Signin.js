/**
 * jiangyukun on 2016/07/27 12:35
 */
import React, {Component} from 'react'
import {routerShape} from 'react-router'
import {connect} from 'react-redux'

import Loading from '../components/common/Loading'
import {NotificationType} from '../constants/ChatConstants'
import util from '../components/core/util'
import {checkAutoLogin, loginToHuanxin, clearLoginFailure} from '../actions/login'

class Signin extends Component {
    static contextTypes = {
        router: routerShape
    }

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event) {
        var state = this.state
        this.setState({password: event.target.value})
    }

    login() {
        this.props.loginToHuanxin(this.state.username, this.state.password)
    }

    componentDidMount() {
        this.props.checkAutoLogin()
    }

    componentDidUpdate() {
        if (this.props.success) {
            this.context.router.push('/chat/index')
        }
        if (this.props.failure) {
            this.props.clearLoginFailure()
            util.tip(NotificationType.ERROR, '用户名或密码错误!')
        }
    }

    render() {
        return (
            <div className="login">
                <div className="logo">
                    <i className="chat_system_login_logo"></i>
                </div>
                {this.props.loading && <div className="loading-container"><Loading /></div>}

                <div className="login_box">
                    <form className="login-form" autoComplete="off">
                        <div className="username-container">
                            <input type="text" autoComplete="off" className="username"
                                   placeholder="输入聊天系统账号"
                                   value={this.state.username}
                                   onChange={e=>this.handleUserNameChange(e)}/>
                        </div>
                        <div className="password-container">
                            <input
                                type="password" autoComplete="off" className="password"
                                placeholder="输入聊天系统密码"
                                value={this.state.password}
                                onChange={e=>this.handlePasswordChange(e)}/>
                        </div>
                        <a className="login-btn" href="javascript:;" onClick={e=>this.login()}>登录</a>
                    </form>

                </div>

                <div className="copyright">
                    <p className="desc">© 2016 WangJi Inc. All Rights Reserved</p>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loading: state.login.loading,
        success: state.login.success,
        failure: state.login.failure,
        message: state.login.message
    }
}

export default connect(mapStateToProps, {
    checkAutoLogin,
    loginToHuanxin,
    clearLoginFailure
})(Signin)
