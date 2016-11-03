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
        this.props.checkAutoLogin()
        this.state = {
            username: '',
            password: ''
        }
    }

    handleChange(event) {
        var name = event.target.name
        var state = this.state
        state[name] = event.target.value
        this.setState(state)
    }

    login() {
        this.props.loginToHuanxin(this.state.username, this.state.password)
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
                {
                    this.props.loading && <div className="loading-container"><Loading /></div>
                }
                <header>
                    <img src=""/>
                    <span className="chat-system-text">小贝壳聊天系统</span>
                </header>

                <div className="input-box">
                    <p className="title">
                        小贝壳聊天系统
                    </p>
                    <div className="input-row">
                        <input name="username" className="form-control" placeholder="输入聊天系统账号"
                               value={this.state.username} onChange={e=>this.handleChange(e)}/>
                    </div>
                    <div className="input-row">
                        <input name="password" className="form-control" type="password" placeholder="输入聊天系统密码"
                               value={this.state.password} onChange={e=>this.handleChange(e)}/>
                    </div>
                    <button className="btn btn-block btn-info" onClick={e=>this.login()}>登录</button>
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
