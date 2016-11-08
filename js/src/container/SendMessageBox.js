/**
 * jiangyukun on 2016/8/2.
 */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import SendImage from '../components/tools/SendImage'
import SendAudio from '../components/tools/SendAudio'
import SelectEmotions from '../components/tools/SelectEmotions'
import {sendTextMessage, sendImageMessage, sendAudioMessage} from '../actions/chat'

class SendMessageBox extends Component {
    constructor(props) {
        super(props)
        this.state = {txt: '', showEmotions: false}
    }

    openImageDialog() {
        this.refs.sendImage.toggle()
    }

    openAudioDialog() {
        this.refs.sendAudio.toggle()
    }

    clear() {
        this.setState({txt: ''})
    }

    onChange(event) {
        this.setState({
            txt: event.target.value
        })
    }

    selectEmotion() {
        this.setState({showEmotions: !this.state.showEmotions})
    }

    emotionSelected(key) {
        this.setState({
            txt: this.state.txt + key,
            showEmotions: false
        })
    }

    sendTextMessage() {
        this.props.sendTextMessage(this.props.from, this.props.to, this.props.type, this.state.txt)
        this.clear()
    }

    sendImageMessage(fileInput) {
        this.props.sendImageMessage(this.props.from, this.props.to, this.props.type, fileInput)
        this.clear()
    }

    sendAudioMessage(file) {
        this.props.sendAudioMessage(this.props.to, this.props.type, file)
        this.clear()
    }

    render() {
        return (
            <div className="send-message-box">
                <div className="tools ">
                    <div className="pull-left">
                        <div className="send-image-icon">
                            <i className="fa fa-lg fa-file-image-o" onClick={e=> this.openImageDialog()}></i>
                        </div>
                        <SendImage ref="sendImage" sendImageMessage={file=>this.sendImageMessage(file)}/>
                    </div>

                    <div className="pull-left">
                        <div className="emotion">
                            <i className="fa fa-lg fa-meh-o" onClick={e=>this.selectEmotion()}></i>
                            {this.state.showEmotions && <SelectEmotions select={key=>this.emotionSelected(key)}/>}
                        </div>
                    </div>

                    < div className="pull-left">
                        <div className="audio">
                            <i className="fa fa-lg fa-microphone" onClick={e=>this.openAudioDialog()}></i>
                        </div>
                        <SendAudio ref="sendAudio" sendAudioMessage={file=>this.sendAudioMessage(file)}/>
                    </div>

                    <div className="pull-right">
                        <input type="button" value="发送" className="btn btn-primary"
                               disabled={this.state.txt.trim() ? '' : 'disabled'}
                               onClick={e=> this.sendTextMessage()}/>
                    </div>
                </div>
                <div className="input-box">
                    <div className="input-wrap">
                        <textarea onChange={e=> this.onChange(e)} value={this.state.txt}></textarea>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {
    sendTextMessage,
    sendImageMessage,
    sendAudioMessage
}, null, {withRef: true})(SendMessageBox)
