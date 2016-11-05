/**
 * Created by jiangyukun on 2016/8/10.
 */
import React, {Component} from 'react'
import {findDOMNode}  from 'react-dom'

export default class SimpleAudio extends Component {
    static propTypes = {
        audioUrl: React.PropTypes.string.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {isPlay: false, totalTime: 0, volume: 'up'}
    }

    getAudio() {
        return findDOMNode(this.audio)
    }

    playAudio() {
        let audioNode = this.getAudio()
        return new Promise(function (resolve) {
            audioNode.onended = function () {
                resolve()
            }
            audioNode.play()
        })
    }

    render() {
        return (
            <div className="audio-wrap" onClick={e=>this.playAudio()}>
                <audio ref={c=>this.audio = c} src={this.props.audioUrl}/>
            </div>
        )
    }
}
