/**
 * Created by jiangyukun on 2016/8/10.
 */
import React, {Component} from 'react'
import {findDOMNode}  from 'react-dom'
import classnames from 'classnames'

function formatTime(seconds) {
    let minute = 0
    seconds = parseInt(seconds)
    if (seconds >= 60) {
        minute = parseInt(seconds / 60)
        if (minute < 10) {
            minute = '0' + minute
        }
    }
    let second = parseInt(seconds % 60)
    if (second < 10) {
        second = '0' + second
    }
    return minute + ':' + second
}

export default class Audio extends Component {
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
        let audioNode = this.getAudio()

        audioNode.addEventListener("loadedmetadata", e=>this.getTotalSecond())
        audioNode.addEventListener("timeupdate", e=>this.timeUpdate())
        // audioNode.addEventListener("canplaythrough", e=>this.canPlayThrough())
    }

    componentWillUnmount() {
    }

    getTotalSecond() {
        let audioNode = this.getAudio()
        this.setState({totalTime: formatTime(audioNode.duration)})
    }

    timeLineClick(e) {
    }

    canPlayThrough() {

    }

    timeUpdate() {
    }

    playAudio() {
        let audioNode = this.getAudio()
        let isPlay = this.state.isPlay
        this.setState({isPlay: !isPlay})

        if (!isPlay) {
            audioNode.play()
            this.taskId = setInterval(()=> {
                switch (this.state.volume) {
                    case 'up':
                        this.setState({volume: 'off'})
                        break
                    case 'off':
                        this.setState({volume: 'down'})
                        break
                    case 'down':
                        this.setState({volume: 'up'})
                        break
                    default:
                        break
                }
            }, 500)
        } else {
            if (this.taskId) {
                clearInterval(this.taskId)
            }
            this.setState({volume: 'up'})
            audioNode.pause()
        }
    }

    render() {
        return (
            <div className="audio-wrap" onClick={e=>this.playAudio()}>
                <span className="volume-container"><i className={classnames('fa', 'fa-volume-' + this.state.volume)}></i></span>
                <span className="total-time">{this.state.totalTime}</span>
                <audio ref="audio" src={this.props.audioUrl} preload="metadata" controls/>
            </div>
        )
    }
}
