/**
 * Created by jiangyukun on 2016/8/10.
 */
import React, {Component} from 'react'
import {findDOMNode}  from 'react-dom'
import classnames from 'classnames'

var AMR = window.AMR
var FileReader = window.FileReader

export default class AudioFile extends Component {
    static propTypes = {
        file: React.PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {isPlay: false, totalTime: 0, volume: 'up'}
    }

    playAudio() {
        let isPlay = this.state.isPlay
        this.setState({isPlay: !isPlay})

        if (!isPlay) {
            var fileReader = new FileReader()
            fileReader.onload = e => {
                var amr = new AMR().decode(e.target.result)
                AMR.util.play(amr)
            }
            fileReader.readAsBinaryString(this.props.file)

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
            // audioNode.pause()
        }
    }

    render() {
        return (
            <div className="audio-wrap" onClick={e=>{}}>
                <span className="volume-container"><i
                    className={classnames('fa', 'fa-volume-' + this.state.volume)}></i></span>
                <span className="total-time">{this.state.totalTime || ''}</span>
            </div>
        )
    }
}
