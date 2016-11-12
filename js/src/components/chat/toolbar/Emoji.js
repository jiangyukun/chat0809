/**
 * Created by jiangyukun on 2016/11/12.
 */
import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {events} from 'dom-helpers'

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
        this.setState({showEmoji: false})
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
        return (
            <div className="mmpop slide-top" style={{top: '-272px', left: '15px'}}>
                <div className="expression">
                    <ul className="exp_hd">
                        <li className="exp_hd_item active">
                            <a href="javascript:;">默认</a>
                        </li>
                    </ul>
                    <div className="scroll-wrapper exp_bd scrollbar-dynamic">
                        <div className="exp_bd scrollbar-dynamic scroll-content">
                            <div className="exp_cont active">
                                <div className="qq_face">

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
    show: PropTypes.bool
}

export default Emoji
