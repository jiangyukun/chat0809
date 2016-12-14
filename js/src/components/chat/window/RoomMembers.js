/**
 * Created by jiangyukun on 2016/11/15.
 */
import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import CssTransitionGroup from 'react-addons-css-transition-group'
import {events} from 'dom-helpers'

class RoomMembers extends Component {
    constructor(props) {
        super(props)
        this.handleContainerClick = this.handleContainerClick.bind(this)
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
        this.state = {show: false}
    }

    toggle() {
        this.keep = true
        this.setState({show: !this.state.show})
    }

    close() {
        this.setState({show: false})
        this.props.onClose()
    }

    handleContainerClick() {
        this.keep = true
    }

    handleDocumentClick() {
        if (this.keep) {
            this.keep = false
            return
        }
        this.close()
    }

    componentDidMount() {
        events.on(findDOMNode(this), 'click', this.handleContainerClick)
        events.on(document, 'click', this.handleDocumentClick)
    }

    componentWillUnmount() {
        events.off(findDOMNode(this), 'click', this.handleContainerClick)
        events.off(document, 'click', this.handleDocumentClick)
    }

    render() {
        return (
            <CssTransitionGroup transitionName="slide-down" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
                {
                    this.state.show && (
                        <div className="mmpop members_wrp slide-down" tabIndex="-1">
                            <div className="members">
                                <div className="scroll-wrapper scrollbar-dynamic members_inner">
                                    <div className="scrollbar-dynamic members_inner scroll-content">
                                        {
                                            this.props.members.map(member => {
                                                return (
                                                    <div key={member.jid} className="member">
                                                        <img src="img/default.jpg" className="avatar"/>
                                                        <p className="nickname">{member.name}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </CssTransitionGroup>
        )
    }
}

RoomMembers.propTypes = {
    members: PropTypes.array,
    onClose: PropTypes.func
}

export default RoomMembers
