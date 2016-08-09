/*
 * jiangyukun on 2016-07-29 19:25
 */
import React, {Component} from 'react'
import {MessageType} from '../constants/ChatConstants'
import util from './core/util'
import classnames from 'classnames'
import ImagePreviewActions from '../actions/ImagePreviewActions'

class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {dataUrl: ''}
    }

    showImagePreview() {
        ImagePreviewActions.show(this.state.dataUrl)
    }

    showContent() {
        let {type, data} = this.props.msg

        if (type == MessageType.TEXT) {
            return <span className="message-content">{data}</span>
        }
        let urlOrDataUrl = this.state.dataUrl

        if (typeof data != 'string') {
            if (!urlOrDataUrl) {
                util.getDataUrl(data).then(dataUrl => {
                    this.setState({dataUrl})
                })
            }
        } else if (data) {
            urlOrDataUrl = data
        }
        return (
            <div className="message-image-container">
                {urlOrDataUrl && <img src={urlOrDataUrl} className="img-responsive" onClick={this.showImagePreview.bind(this)}/>}
            </div>
        )
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
