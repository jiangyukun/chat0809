/**
 * Created by jiangyukun on 2016/11/15.
 */
import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {events} from 'dom-helpers'

class RoomMembers extends Component {
    constructor(props) {
        super(props)
        this.handleContainerClick = this.handleContainerClick.bind(this)
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
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
        events.on(findDOMNode(this), 'click', this.handleContainerClick)
        events.on(document, 'click', this.handleDocumentClick)
    }

    componentWillUnmount() {
        events.off(findDOMNode(this), 'click', this.handleContainerClick)
        events.off(document, 'click', this.handleDocumentClick)
    }

    render() {
        return (
            <div>
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
            </div>
        )
    }
}

RoomMembers.propTypes = {
    members: PropTypes.array,
    close: PropTypes.func
}

export default RoomMembers
