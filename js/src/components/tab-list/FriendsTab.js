/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'

import PatientList from '../contacts/PatientList'
import RoomList from '../contacts/RoomList'
import DoctorList from '../contacts/DoctorList'

class FriendsTab extends Component {
    constructor(props) {
        super(props)
        this.lookUserDetail = this.lookUserDetail.bind(this)
        this.lookRoomDetail = this.lookRoomDetail.bind(this)
        this.startChat = this.startChat.bind(this)
    }

    lookUserDetail(name) {
        this.props.selectContact(name)
    }

    lookRoomDetail(id) {
        this.props.selectContact(id)
    }

    startChat(name) {
        this.props.startChat(name)
    }

    render() {
        return (
            <div className="nav_view">
                <div className="scroll-wrapper contact_list" style={{position: 'relative'}}>

                    <div className="scroll-content">
                        <PatientList patients={this.props.patients}
                                     selectedId={this.props.selectedContactId}
                                     startChat={this.startChat}
                                     lookUserDetail={this.lookUserDetail}/>
                        <RoomList rooms={this.props.rooms}
                                  selectedId={this.props.selectedContactId}
                                  startChat={this.startChat}
                                  lookRoomDetail={this.lookRoomDetail}
                        />
                        <DoctorList doctors={this.props.doctors}/>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        patients: state.patients,
        rooms: state.rooms,
        doctors: state.doctors
    }
}

export default connect(mapStateToProps, {})(FriendsTab)
