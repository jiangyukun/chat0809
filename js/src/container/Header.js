/**
 * jiangyukun on 2016/07/28 10:10
 */
import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {events} from 'dom-helpers'

class Header extends Component {
    constructor(props) {
        super(props)
        this.handleOptClick = this.handleOptClick.bind(this)
        this.handleContainerClick = this.handleContainerClick.bind(this)
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
    }

    handleOptClick() {
        this.props.toggle()
    }

    handleContainerClick() {
        this.keep = true
    }

    handleDocumentClick() {
        if (this.keep) {
            this.keep = false
            return
        }
        this.props.close()
    }

    componentDidMount() {
        events.on(findDOMNode(this.opt), 'click', this.handleOptClick)
        events.on(findDOMNode(this), 'click', this.handleContainerClick)
        events.on(document, 'click', this.handleDocumentClick)
    }

    componentWillUnmount() {
        events.off(findDOMNode(this.opt), 'click', this.handleOptClick)
        events.off(findDOMNode(this), 'click', this.handleContainerClick)
        events.off(document, 'click', this.handleDocumentClick)
    }

    render() {
        function getLoginName(id) {
            switch (id) {
                case 'zxys':
                    return '在线医生'
                case 'bkkf':
                    return '贝壳客服'
                default:
                    break
            }
            return id
        }

        return (
            <div className="header">
                <div className="avatar">
                    <img className="img" src="img/default.jpg"/>
                </div>
                <div className="info">
                    <h3 className="nickname">
                        <span className="display_name">{getLoginName(this.props.curUserId)}</span>
                        <a className="opt" href="javascript:;" ref={c=>this.opt = c}>
                            <i className="user_opt"></i>
                        </a>
                    </h3>
                </div>
            </div>
        )
    }
}

export default Header
