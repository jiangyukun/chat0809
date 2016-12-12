/**
 * jiangyukun on 2016/07/27 12:35
 */
import React, {Component} from 'react'
import {routerShape} from 'react-router'
import {connect} from 'react-redux'
import notification from 'antd/lib/notification'

import Loading from '../components/common/Loading'
import {checkAutoLogin, loginToHuanxin, clearLoginFailure} from '../actions/login'

class Signin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: props.app.username || '',
            password: ''
        }
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value})
    }

    handlePasswordEnter(event) {
        if (event.which == 13) {
            this.login()
        }
    }

    login() {
        if (!this.state.username || !this.state.password) {
            return
        }
        this.props.loginToHuanxin(this.state.username, this.state.password)
    }

    componentDidMount() {
        this.props.checkAutoLogin()
    }

    componentDidUpdate() {
        let {success, failure} = this.props.login
        if (success) {
            this.context.router.push('/chat/index')
        }
        if (failure) {
            this.props.clearLoginFailure()
            notification.error({message: '提示', description: '用户名或密码错误！'})
        }
    }

    componentWillReceiveProps(nextProps) {
        let {app} = nextProps
        if (app.autoLogin) {
            this.setState({
                username: app.username,
                password: '..........................'
            })
        }
    }

    render() {
        let {app} = this.props
        let {loading} = this.props.login
        return (
            <div className="login">
                <div className="logo">
                    <i className="chat_system_login_logo"></i>
                </div>
                {loading && <div className="loading-container"><Loading /></div>}

                <div className="login_box">
                    <form className="login-form" autoComplete="off">
                        <input type="text" autoComplete="off" className="username"
                               placeholder="输入聊天系统账号"
                               value={this.state.username}
                               onChange={e => this.handleUserNameChange(e)}/>
                        <input
                            type="password" autoComplete="off" className="password"
                            placeholder="输入聊天系统密码"
                            value={this.state.password}
                            onChange={e => this.handlePasswordChange(e)}
                            onKeyDown={e => this.handlePasswordEnter(e)}/>
                        <a className="login-btn" href="javascript:" onClick={e => this.login()}>
                            {
                                app.autoLogin ? '自动登录中...' : loading ? '登录中...' : '登录'
                            }
                        </a>
                    </form>
                </div>

                <div className="copyright">
                    <p className="desc">
                        © 2016 WangJi Inc. All Rights Reserved
                        <a href="../chat-system/chat.html" className="use_old_version">使用旧版</a>
                    </p>
                </div>
            </div>
        )
    }
}

Signin.contextTypes = {
    router: routerShape
}

function mapStateToProps(state) {
    return {
        app: state.app,
        login: state.login
    }
}

export default connect(mapStateToProps, {
    checkAutoLogin,
    loginToHuanxin,
    clearLoginFailure
})(Signin)
