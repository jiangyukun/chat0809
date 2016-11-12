/**
 * Created by jiangyukun on 2016/11/12.
 */
import React, {Component, PropTypes} from 'react'
import classnames from 'classnames'

import {MessageType, DIR} from '../../constants/ChatConstants'

class Message extends Component {

    render() {
        let {dir} = this.props
        return (
            <div className={classnames('message', {'you': dir == DIR.LEFT}, {'me': dir == DIR.RIGHT})}>
                <p className="message_system">
                    <span className="content">{this.props.chatTime}</span>
                </p>
                <img className="avatar" src="img/default.jpg"/>
                <div className="content">
                    <div
                        className={classnames('bubble ', {'bubble_default': dir == DIR.LEFT}, {'bubble_primary': dir == DIR.RIGHT}, {'left': dir == DIR.LEFT}, {'right': dir == DIR.RIGHT})}>
                        <div className="bubble_cont">
                            {
                                this.props.msgType == MessageType.TEXT && <PlainContent data={this.props.data}/>
                            }
                            {
                                this.props.msgType == MessageType.IMAGE && <PictureContent data={this.props.data}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Message.propTypes = {
    dir: PropTypes.oneOf([DIR.LEFT, DIR.RIGHT]),
    chatTime: PropTypes.string,
    msgType: PropTypes.oneOf([MessageType.TEXT, MessageType.IMAGE]),
    data: PropTypes.string
}

export default Message


/**
 * 文本消息
 */
export class PlainContent extends Component {

    render() {
        return (
            <div className="plain">
                <pre className="js_message_plain ">{this.props.data}</pre>
                {/*<img src="img/loading.gif" className="ico_loading"/>*/}
                {/*<i className="ico_fail web_wechat_message_fail ng-hide" title="重新发送"></i>*/}
            </div>
        )
    }
}

/**
 * 图片消息
 */
export class PictureContent extends Component {

    render() {
        return (
            <div className="picture">
                <img className="msg-img" src={this.props.data}/>
            </div>
        )
    }
}
