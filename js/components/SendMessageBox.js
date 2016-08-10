/**
 * jiangyukun on 2016/8/2.
 */
import React, {Component, PropTypes} from 'react'
import SendImage from './tools/SendImage'
import SendAudio from './tools/SendAudio'
import SelectEmotions from './tools/SelectEmotions'
import chatActions from '../actions/ChatActions'

export default class SendMessageBox extends Component {
    static contextTypes = {
        message: PropTypes.array
    }

    constructor(props) {
        super(props)
        this.state = {newMessage: '', showEmotions: false}
    }

    openImageDialog() {
        this.refs.sendImage.toggle()
    }

    openAudioDialog() {
        this.refs.sendAudio.toggle()
    }

    clear() {
        this.setState({newMessage: ''})
    }

    onChange(event) {
        this.setState({
            newMessage: event.target.value
        })
    }

    selectEmotion() {
        this.setState({showEmotions: !this.state.showEmotions})
    }

    emotionSelected(key) {
        this.setState({
            newMessage: this.state.newMessage + key,
            showEmotions: false
        })
    }

    sendTextMessage() {
        chatActions.sendTextMessage(this.props.to, this.props.type, this.state.newMessage)
    }

    sendImageMessage(file) {
        chatActions.sendImageMessage(this.props.to, this.props.type, file)
    }

    sendAudioMessage(file) {
        chatActions.sendAudioMessage(this.props.to, this.props.type, file)
    }

    render() {
        return (
            <div className="row send-message-box">
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

                    <div className="pull-left">
                        <div className="voice">
                            <i className="fa fa-lg fa-microphone" onClick={e=>this.openAudioDialog()}></i>
                        </div>
                        <SendAudio ref="sendAudio" sendAudioMessage={file=>this.sendAudioMessage(file)}/>
                    </div>

                    <div className="pull-right">
                        <input type="button" value="发送" className="btn btn-primary"
                               disabled={this.state.newMessage ? '' : 'disabled'} onClick={e=> this.sendTextMessage()}/>
                    </div>
                </div>
                <div className="input-box">
                    <div className="input-wrap">
                        <textarea onChange={e=> {this.onChange(e)}} value={this.state.newMessage}></textarea>
                    </div>
                </div>
            </div>
        )
    }
}
