/**
 * Created by jiangyu2016 on 16/8/9.
 */
import React, {Component, PropTypes} from 'react'

let WebIM = window.WebIM
export default class SelectEmotions extends Component {


    getEmotionIcon() {
        let emotions = WebIM.Emoji,
            emtMap = emotions.map,
            emtPath = emotions.path;

        let icon = []
        for (let key in emtMap) {
            icon.push(<li key={key}>
                <img src={emtPath + emtMap[key]} onClick={()=>this.props.select(key)}/>
            </li>)
        }
        return icon
    }

    render() {
        return (
            <div className="emotions-container">
                <div className="title">常用表情</div>
                <ul>
                    {
                        this.getEmotionIcon()
                    }
                </ul>
            </div>
        )
    }
}
