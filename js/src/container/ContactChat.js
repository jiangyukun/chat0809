/**
 * Created by jiangyukun on 2016/11/14.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'

import NoContact from '../components/chat/window/NoContact'
import UserDetail from '../components/chat/window/UserDetail'
import RoomDetail from '../components/chat/window/RoomDetail'

import {ContactType} from '../constants/ChatConstants'

class ChatLinkPage extends Component {

    render() {
        return (
            <div style={{height: '100%'}}>
                {
                    !this.props.contactType && <NoContact/>
                }
                {
                    this.props.contactType == ContactType.SINGLE && <UserDetail match={this.props.match} startChat={this.props.startChat}/>
                }
                {
                    this.props.contactType == ContactType.ROOM && <RoomDetail match={this.props.match} startChat={this.props.startChat}/>
                }
            </div>
        )
    }
}

function mapStateToProps(state, props) {

    let {patients, doctors, rooms} = state
    let contactType

    let match
    if ((match = patients.filter(patient=>patient.name == props.selectedContactId)) && match.length) {
        contactType = ContactType.SINGLE
    } else if ((match = doctors.filter(doctor=>doctor.name == props.selectedContactId)) && match.length) {
        contactType = ContactType.SINGLE
    } else if ((match = rooms.filter(room=>room.id == props.selectedContactId)) && match.length) {
        contactType = ContactType.ROOM
    }

    return {
        contactType,
        match: match && match[0]
    }
}

export default connect(mapStateToProps)(ChatLinkPage)
