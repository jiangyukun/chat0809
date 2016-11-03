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
        return findDOMNode(this.refs['audio'])
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    playAudio() {
        let audioNode = this.getAudio()
        audioNode.play()
    }

    render() {
        return (
            <div className="audio-wrap" onClick={e=>this.playAudio()}>
                <audio ref="audio" src={this.props.audioUrl}/>
            </div>
        )
    }
}
