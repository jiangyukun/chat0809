/**
 * jiangyukun on 2016/07/28 10:10
 */
import React, {Component, PropTypes} from 'react'
import {routerShape} from 'react-router'
import chatActions from '../actions/ChatActions'
import Audio from './common/Audio'

export default class Header extends Component {
    static contextTypes = {
        curUserId: PropTypes.string,
        router: routerShape
    }

    exit() {
        chatActions.exitChatSystem()
        this.context.router.push('/signin')
    }

    render() {
        return (
            <div className="container-fluid">
                <header className="row">
                    <div className="col-xs-4">
                        <span className="chat-system-text">小贝壳聊天系统</span>
                    </div>
                    <div className="col-xs-4 text-center">
                        <span className="login-user">{this.context.curUserId}</span>
                    </div>
                    <div className="col-xs-4">
                        <div className="pull-right exit">
                            <button className="btn" onClick={()=>{this.exit()}}>退出登录</button>
                        </div>
                    </div>
                </header>
                {
                    /*<div className="row">
                        <Audio audioUrl="http://192.168.1.131:8080/backend/chat-system/audio/boy.mp3"/>
                    </div>*/
                }
            </div>
        )
    }
}
