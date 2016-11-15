/**
 * Created by jiangyukun on 2016/11/12.
 */
import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {events} from 'dom-helpers'

import webImUtil from '../../core/webImUtil'

class Emoji extends Component {

    constructor() {
        super()
        this.handleEmojiContainerClick = this.handleEmojiContainerClick.bind(this)
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
    }

    handleEmojiContainerClick() {
        this.keepEmoji = true
    }

    handleDocumentClick() {
        if (this.keepEmoji == true) {
            this.keepEmoji = false
            return
        }
        this.props.close()
    }

    componentDidMount() {
        events.on(findDOMNode(this), 'click', this.handleEmojiContainerClick)
        events.on(document, 'click', this.handleDocumentClick)
    }

    componentWillUnmount() {
        events.off(findDOMNode(this), 'click', this.handleEmojiContainerClick)
        events.off(document, 'click', this.handleDocumentClick)
    }

    render() {
        let getEmojiIcon = () => {
            let emotions = WebIM.Emoji, emtMap = emotions.map, emtPath = emotions.path;

            let icon = []
            for (let key in emtMap) {
                if (emtMap.hasOwnProperty(key)) {
                    icon.push(
                        <a key={key} title="" type="qq" className="face"
                           style={webImUtil.getEmojiStyle(key)}
                           onClick={e => this.props.selectEmoji(key)}></a>
                    )
                }
            }
            return icon
        }

        return (
            <div className="mmpop slide-top" style={{top: '-272px', left: '15px'}}>
                <div className="expression">
                    <ul className="exp_hd">
                        <li className="exp_hd_item active">
                            <a href="javascript:">默认</a>
                        </li>
                    </ul>
                    <div className="scroll-wrapper exp_bd scrollbar-dynamic">
                        <div className="exp_bd scrollbar-dynamic scroll-content">
                            <div className="exp_cont active">
                                <div className="qq_face">
                                    {getEmojiIcon()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Emoji.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    selectEmoji: PropTypes.func
}

export default Emoji
