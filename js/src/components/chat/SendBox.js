/**
 * Created by jiangyukun on 2016/11/11.
 */
import React, {Component} from 'react'
import {events} from 'dom-helpers'

class SendBox extends Component {
    constructor(props) {
        super(props)
        this.handlePreKeyDown = this.handlePreKeyDown.bind(this)
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

    handlePreKeyDown(event) {
        console.log(event);
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
                    <a className="web_wechat_face"></a>
                    <a className="web_wechat_pic js_fileupload webuploader-container"></a>
                </div>
                <div className="content">
                    <pre ref={c=>this.preDom = c} contentEditable="true" className="flex edit_area"></pre>
                </div>
                <div className="action">
                    <span className="desc">按下Ctrl+Enter换行</span>
                    <a className="btn btn_send" onClick={e=>this.sendText()} href="javascript:;">发送</a>
                </div>
            </div>
        )
    }
}

export default SendBox
