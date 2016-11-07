/*
 * jiangyukun on 2016-07-29 19:25
 */
import React, {Component} from 'react'
import ImagePreview from './tools/ImagePreview'

import AudioUrl from './common/AudioUrl'
import AudioFile from './common/AudioFile'
import {MessageType} from '../constants/ChatConstants'
import util from './core/util'
import classnames from 'classnames'

const File = window.File

export default class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {dataUrl: ''}
    }

    showContent() {
        let {type} = this.props.msg

        switch (type) {
            case MessageType.TEXT:
                return this.showTextContent()
            case MessageType.IMAGE:
                return this.showImageContent()
            case MessageType.AUDIO:
                return this.showAudioContent()
            default:
                return this.showTextContent()
        }
    }

    showTextContent() {
        let data = this.props.msg.data

        if (typeof data == 'string') {
            this.textMessage = data
            return <span ref="textMessageContent" className="message-content"></span>
        }
        return (
            <span className="message-content">
                {
                    data && data.map((item, index)=> {
                        var res
                        if (item.type == MessageType.TEXT) {
                            res = item.data
                        } else if (item.type == 'emoji') {
                            res = <span className="emotion-container"><img src={item.data}/></span>
                        } else {
                            res = <span>未知类型({item.type})</span>
                        }
                        return <span key={index}>{res}</span>
                    })
                }
            </span>
        )
    }

    showImageContent() {
        let data = this.props.msg.data
        let urlOrDataUrl = this.state.dataUrl

        if (typeof data != 'string') {
            if (!urlOrDataUrl) {
                util.getDataUrl(data).then(dataUrl => this.setState({dataUrl}))
            }
        } else if (data) {
            urlOrDataUrl = data
        }
        return (
            <div className="message-image-container">
                {
                    urlOrDataUrl && (
                        <div>
                            <img src={urlOrDataUrl} className="img-responsive" onClick={e=>this.showImagePreview()}/>
                            <ImagePreview url={urlOrDataUrl} ref={c=>this.imagePreview = c}/>
                        </div>
                    )
                }
            </div>
        )
    }

    showImagePreview() {
        this.imagePreview.open()
    }

    showAudioContent() {
        if (this.props.msg.data instanceof File) {
            return <AudioFile file={this.props.msg.data}/>
        } else {
            let {url, type} = this.props.msg.data
            return <AudioUrl url={url} type={type}/>
        }
    }

    render() {
        let {from} = this.props.msg

        if (from.indexOf('zxys') != -1) {
            from = '在线医生'
        }
        if (from.indexOf('bkts') != -1) {
            from = '贝壳天使'
        }
        if (from.indexOf('bkzs') != -1) {
            from = '贝壳助手'
        }
        if (from.indexOf('bkkf') != -1) {
            from = '贝壳客服'
        }

        return (
            <div className="clearfix">
                <div className="message-time">{this.props.msg.chatTime || util.now()}</div>
                <div className={classnames({"pull-left": this.props.dir == 'left', "pull-right": this.props.dir == 'right'})}>
                    <div className="simple-message-box">
                        <div className="message-send-user">{from}</div>
                        <div>
                            <div className="message-content-container">
                                {this.showContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        if (this.refs['textMessageContent']) {
            this.refs['textMessageContent'].innerHTML = this.textMessage
        }
    }
}
