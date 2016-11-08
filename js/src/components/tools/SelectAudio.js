/*
 * jiangyukun on 2016-07-30 18:10
 */
import React, {Component} from 'react'
import {Modal, Button} from 'react-bootstrap'

export default class SelectAudio extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    onChange(e) {
        console.log(e);
        let file = e.target.files[0]
        if (!file) return
        this.setState({file})
        this.props.audioSelected(this.state.file)
    }

    getAudioFile() {
        return this.state.file
    }

    render() {
        return (
            <div className="select-image">
                <div className="select-image-container">
                    <button className="btn select-image-btn">选择语音</button>
                    <input type="file" className="select-image-input" onChange={e=>this.onChange(e)}/>
                </div>
            </div>
        )
    }
}
