/**
 * jiangyukun on 2016/07/27 12:35
 */
import React from 'react'
import {routerShape} from 'react-router'

import {NotificationType} from '../constants/ChatConstants'
import chatActions from '../actions/ChatActions'
import notificationActions from '../actions/NotificationActions'

class Signin extends React.Component {
    static contextTypes = {
        router: routerShape
    }

    constructor(props) {
        super(props);
        this.displayName = 'Signin';
        this.state = {
            username: 'test',
            password: '123456'
        }
    }

    handleChange(event) {
        var name = event.target.name;
        var state = this.state;
        state[name] = event.target.value;
        this.setState(state);
    }

    login() {
        chatActions.login(this.state.username, this.state.password, () => {
            this.context.router.push('/chat/index')
        }, () => {
            notificationActions.addNotification(NotificationType.ERROR, '用户名或密码错误')
            // alert('用户名或密码错误！')
        })
    }

    render() {
        return (
            <div className="login">
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
                               value={this.state.username} onChange={(event)=>{this.handleChange(event)}}/>
                    </div>
                    <div className="input-row">
                        <input name="password" className="form-control" placeholder="输入聊天系统密码"
                               value={this.state.password} onChange={(event)=>{this.handleChange(event)}}/>
                    </div>
                    <button className="btn btn-block btn-info" onClick={()=>{this.login()}}>登录</button>
                </div>
            </div>
        )
    }
}


export default Signin;
