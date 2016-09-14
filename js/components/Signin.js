/**
 * jiangyukun on 2016/07/27 12:35
 */
import React, {Component} from 'react'
import {routerShape} from 'react-router'

import Loading from './common/Loading'
import {NotificationType} from '../constants/ChatConstants'
import chatActions from '../actions/ChatActions'
import util from '../components/core/util'

export default class Signin extends Component {
    static contextTypes = {
        router: routerShape
    }

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            loading: false
        }
    }

    handleChange(event) {
        var name = event.target.name
        var state = this.state
        state[name] = event.target.value
        this.setState(state)
    }

    login() {
        this.setState({loading: true})
        chatActions.login(this.state.username, this.state.password, () => {
            this.setState({loading: false})
            this.context.router.push('/chat/index')
        }, () => {
            this.setState({loading: false})
            util.tip(NotificationType.ERROR, '用户名或密码错误!')

        })
    }

    componentWillUnmount() {

    }

    render() {
        let showLoading = ()=> {
            return this.state.loading && <div className="loading-container"><Loading /></div>
        }
        return (
            <div className="login">
                {showLoading()}
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
                        <input name="password" className="form-control" placeholder="输入聊天系统密码"
                               value={this.state.password} onChange={e=>this.handleChange(e)}/>
                    </div>
                    <button className="btn btn-block btn-info" onClick={e=>this.login()}>登录</button>
                </div>
            </div>
        )
    }
}
