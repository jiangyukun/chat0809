/*
 * jiangyukun on 2016-07-30 18:10
 */
import React, {Component, PropTypes} from 'react'
import {Modal, Button} from 'react-bootstrap'
import SelectAudio from './SelectAudio'

export default class SendAudio extends Component {
    static contextTypes = {
        curUserId: PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            hasAudioFile: false
        }
    }

    toggle() {
        this.setState({show: !this.state.show})
    }

    audioSelected() {
        this.setState({hasAudioFile: true})
    }

    sendAudioMessage() {
        this.props.sendAudioMessage(this.refs.selectAudio.getAudioFile())
        this.toggle()
    }

    render() {
        return (
            <Modal show={this.state.show}>
                <Modal.Header closeButton>
                    <Modal.Title>选择语音</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SelectAudio audioSelected={e=>this.audioSelected()} ref="selectAudio"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>{this.toggle()}}>取消</Button>
                    <Button className="btn btn-primary" onClick={()=>{this.sendAudioMessage()}}
                            disabled={!this.state.hasAudioFile}>发送</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

