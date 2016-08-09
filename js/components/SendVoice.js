/*
 * jiangyukun on 2016-07-30 18:10
 */
import React, {Component, PropTypes} from 'react'
import {Modal, Button} from 'react-bootstrap'
import SelectVoice from './SelectVoice'

export default class SendVoice extends Component {
    static contextTypes = {
        curUserId: PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            hasVoice: false
        }
    }

    toggle() {
        this.setState({show: !this.state.show})
    }

    voiceSelected() {
        this.setState({hasVoice: true})
    }

    sendVoiceMessage() {
        this.props.sendVoiceMessage(this.refs.selectVoice.getVoiceFile())
        this.toggle()
    }

    render() {
        return (
            <Modal show={this.state.show}>
                <Modal.Header closeButton>
                    <Modal.Title>选择语音</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SelectVoice voiceSelected={()=>{this.voiceSelected()}} ref="selectVoice"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>{this.toggle()}}>取消</Button>
                    <Button className="btn btn-primary" onClick={()=>{this.sendVoiceMessage()}}
                            disabled={!this.state.hasVoice}>发送</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

