/*
 * jiangyukun on 2016-07-29 19:25
 */
import React, {Component} from 'react'

import Audio from './common/Audio'
import {MessageType} from '../constants/ChatConstants'
import util from './core/util'
import classnames from 'classnames'
import ImagePreviewActions from '../actions/ImagePreviewActions'

class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {dataUrl: ''}
    }

    showContent() {
        let {type} = this.props.msg

        switch (type) {
            case MessageType.TEXT:
                return this.showTextContent()
                break

            case MessageType.IMAGE:
                return this.showImageContent()
                break

            case MessageType.AUDIO:
                return this.showAudioContent()
                break
        }
    }

    showTextContent() {
        let data = this.props.msg.data
        if (typeof data == 'string') {
            return <span className="message-content">{data}</span>
        }
        return (
            <span className="message-content">
                {
                    data.map((item, index)=> {
                        var res
                        if (item.type == MessageType.TEXT) {
                            res = item.data
                        } else if (item.type == 'emotion') {
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
                {urlOrDataUrl && <img src={urlOrDataUrl} className="img-responsive" onClick={e=>this.showImagePreview()}/>}
            </div>
        )
    }

    showImagePreview() {
        ImagePreviewActions.show(this.state.dataUrl)
    }

    showAudioContent() {
        let audioUrl = this.props.msg.data
        console.log(audioUrl);
        return <Audio audioUrl={audioUrl}/>
    }

    render() {
        let {from} = this.props.msg

        return (
            <div className="col-xs-12">
                <div className="row">
                    <div className={classnames({"pull-left": this.props.dir == 'left',"pull-right": this.props.dir == 'right'})}>
                        <div className="col-xs-12">
                            <div className="row">{from}</div>
                        </div>
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="message-content-container">
                                    {this.showContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Message
