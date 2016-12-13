/**
 * Created by jiangyukun on 2016/11/12.
 */
import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import {events} from 'dom-helpers'

import webImUtil from '../../../core/utils/webImUtil'

class Emoji extends Component {
    constructor() {
        super()
        this.state = {show: false}
        this.handleEmojiContainerClick = this.handleEmojiContainerClick.bind(this)
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
    }

    toggle() {
        this.keepEmoji = true
        this.setState({show: !this.state.show})
    }

    close() {
        this.setState({show: false})
    }

    selectEmoji(key) {
        this.props.selectEmoji(key)
        this.close()
    }

    handleEmojiContainerClick() {
        this.keepEmoji = true
    }

    handleDocumentClick() {
        if (this.keepEmoji == true) {
            this.keepEmoji = false
            return
        }
        this.close()
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
            let emotions = WebIM.Emoji, emtMap = emotions.map

            let icon = []
            for (let key in emtMap) {
                if (emtMap.hasOwnProperty(key)) {
                    icon.push(
                        <a key={key} title={webImUtil.getEmojiTitle(key)} type="qq" className="face"
                           style={webImUtil.getEmojiStyle(key)}
                           onClick={e => this.selectEmoji(key)}></a>
                    )
                }
            }
            return icon
        }

        return (
            <CSSTransitionGroup transitionName="slide-top"
                                     transitionEnterTimeout={250}
                                     transitionLeaveTimeout={250}>
                {
                    this.state.show && (
                        <div className="mmpop" style={{top: '-272px', left: '15px'}}>
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
            </CSSTransitionGroup>
        )
    }
}

Emoji.propTypes = {
    selectEmoji: PropTypes.func
}

export default Emoji
