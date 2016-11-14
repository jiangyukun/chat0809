/**
 * Created by jiangyukun on 2016/11/11.
 */
import React, {Component, PropTypes} from 'react'
import {events} from 'dom-helpers'

import Emoji from './toolbar/Emoji'
import {ChatType} from '../../constants/ChatConstants'

class SendBox extends Component {
    constructor(props) {
        super(props)
        this.handlePreKeyDown = this.handlePreKeyDown.bind(this)
        this.state = {showEmoji: false}
    }

    sendText() {
        let {curUserId, to, chatType} = this.props
        let txt = this.preDom.innerHTML
        if (!txt || !txt.trim()) {
            return
        }
        this.props.sendText(curUserId, to, chatType, this.preDom.innerHTML)
        this.preDom.innerHTML = ''
    }

    handleFile(event) {
        let {curUserId, chatType, to} = this.props
        this.props.sendPicture(curUserId, to, chatType, event.target)
    }

    handlePreKeyDown(event) {
        if (event.keyCode == 13) {
            if (event.ctrlKey) {
                this.preDom.innerHTML = this.preDom.innerHTML + '<div><br></div>'
            } else {
                this.sendText()
            }
        }
    }

    componentDidMount() {
        events.on(this.preDom, 'keydown', this.handlePreKeyDown)
    }

    componentWillUnmount() {
        events.off(this.preDom, 'keydown', this.handlePreKeyDown)
    }

    render() {
        return (
            <div className="box_ft">
                <div className="toolbar">
                    <a className="web_wechat_face" href="javascript:;" onClick={e=>this.setState({showEmoji: !this.state.showEmoji})}></a>
                    <a className="web_wechat_pic webuploader-container" href="javascript:;" title="图片" onClick={e=>this.fileInput.click()}>
                        <div className="file_input_wrapper">
                            <input type="file" name="file" className="webuploader-element-invisible" multiple="multiple"
                                   ref={c=>this.fileInput = c}
                                   onChange={e=>this.handleFile(e)}/>
                            <label className="input_label"></label>
                        </div>
                    </a>
                </div>
                <div className="content">
                    <pre ref={c=>this.preDom = c} contentEditable="true" className="flex edit_area"></pre>
                </div>
                <div className="action">
                    <span className="desc">按下Ctrl+Enter换行</span>
                    <a className="btn btn_send" onClick={e=>this.sendText()} href="javascript:;">发送</a>
                </div>
                {
                    this.state.showEmoji && <Emoji show={this.state.showEmoji} close={()=>this.setState({showEmoji: false})}/>
                }
            </div>
        )
    }
}

SendBox.propTypes = {
    curUserId: PropTypes.string,
    to: PropTypes.string,
    chatType: PropTypes.oneOf([ChatType.CHAT, ChatType.GROUP_CHAT])
}

export default SendBox
