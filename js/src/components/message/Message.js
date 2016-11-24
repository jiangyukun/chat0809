/**
 * Created by jiangyukun on 2016/11/12.
 */
import React, {Component, PropTypes} from 'react'
import classnames from 'classnames'
import moment from 'moment'

import ImagePreview from '../tools/ImagePreview'
import {MessageType, DIR} from '../../constants/ChatConstants'
import huanxinUtils from '../../core/huanxinUtils'

function defaultPictureLoaded() {
}

class Message extends Component {
    render() {
        let {from, msgType, dir, data, chatTime, pictureLoaded} = this.props
        return (
            <div className={classnames('message', {'you': dir == DIR.LEFT}, {'me': dir == DIR.RIGHT})}>
                <p className="message_system">
                    <span className="content">{moment(chatTime).format('HH:mm')}</span>
                </p>
                <img className="avatar" src="img/default.jpg" title={from}/>
                <div className="content">
                    <div className={classnames('bubble ',
                        {'bubble_default': dir == DIR.LEFT},
                        {'bubble_primary': dir == DIR.RIGHT},
                        {'left': dir == DIR.LEFT},
                        {'right': dir == DIR.RIGHT})}>
                        <div className="bubble_cont">
                            {
                                msgType == MessageType.TEXT && <PlainContent data={data}/>
                            }
                            {
                                msgType == MessageType.IMAGE &&
                                <PictureContent data={this.props.data} pictureLoaded={pictureLoaded || defaultPictureLoaded}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Message.propTypes = {
    from: PropTypes.string,
    dir: PropTypes.oneOf([DIR.LEFT, DIR.RIGHT]),
    chatTime: PropTypes.string,
    msgType: PropTypes.oneOf([MessageType.TEXT, MessageType.IMAGE]),
    data: PropTypes.any,
    pictureLoaded: PropTypes.func
}

export default Message

/**
 * 文本消息
 */
export class PlainContent extends Component {
    componentDidMount() {
        this.preDom.innerHTML = this.props.data.reduce((result, item) => {
            if (item.type == MessageType.TEXT) {
                return result + item.data
            } else if (item.type == 'emoji') {
                return result + `<img class="emoji" src="${huanxinUtils.getEmojiUrl(item.data)}" data-key="${item.data}"/>`
            } else {
                return result + `<span>未知类型(${item.type})</span>`
            }
        }, '')
    }

    render() {
        return (
            <div className="plain">
                <pre className="js_message_plain" ref={c => this.preDom = c}></pre>
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
            <div className="picture" onClick={e => this._imagePreview.open()}>
                <img className="msg-img" src={this.props.data} onLoad={e => this.props.pictureLoaded(e)}/>
                <ImagePreview ref={c => this._imagePreview = c} url={this.props.data}/>
            </div>
        )
    }
}

PictureContent.propTypes = {
    pictureLoaded: PropTypes.func
}
