/*
 * jiangyukun on 2016-07-30 18:10
 */
import React, {Component, PropTypes} from 'react'
import {Modal, Button} from 'react-bootstrap'
import SelectImage from './SelectImage'

class SendImage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            hasImage: false
        }
    }

    toggle() {
        this.setState({show: !this.state.show})
    }

    imageSelected() {
        this.setState({hasImage: true})
    }

    sendImageMessage() {
        this.props.sendImageMessage(this.selectImage.getImageFile())
        this.toggle()
    }

    render() {
        return (
            <Modal show={this.state.show}>
                <Modal.Header >
                    <Modal.Title>选择图片</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SelectImage imageSelected={()=>{this.imageSelected()}} ref={c=>this.selectImage = c}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>{this.toggle()}}>取消</Button>
                    <Button className="btn btn-primary" onClick={()=>{this.sendImageMessage()}} disabled={!this.state.hasImage}>发送</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default SendImage
