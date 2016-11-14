/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'

import PatientList from '../../components/contacts/PatientList'
import RoomList from '../../components/contacts/RoomList'
import DoctorList from '../../components/contacts/DoctorList'

class ContactTab extends Component {
    constructor(props) {
        super(props)
        this.lookUserDetail = this.lookUserDetail.bind(this)
        this.lookRoomDetail = this.lookRoomDetail.bind(this)
    }

    lookUserDetail(name) {
        this.props.selectContact(name)
    }

    lookRoomDetail(id) {
        this.props.selectContact(id)
    }

    render() {
        return (
            <div className="nav_view">
                <div className="scroll-wrapper contact_list" style={{position: 'relative'}}>

                    <div className="scroll-content">
                        <PatientList patients={this.props.patients}
                                     selectedContactId={this.props.selectedContactId}
                                     startChat={this.props.startChat}
                                     lookUserDetail={this.lookUserDetail}/>
                        <RoomList rooms={this.props.rooms}
                                  selectedContactId={this.props.selectedContactId}
                                  startChat={this.props.startChat}
                                  lookRoomDetail={this.lookRoomDetail}
                        />
                        <DoctorList doctors={this.props.doctors}
                                    selectedContactId={this.props.selectedContactId}
                                    startChat={this.props.startChat}
                                    lookUserDetail={this.lookUserDetail}/>
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

export default connect(mapStateToProps, {})(ContactTab)
