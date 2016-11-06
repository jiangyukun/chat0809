/**
 * jiangyukun on 2016/07/28 10:00
 */
import React, {Component, PropTypes} from 'react'
import {routerShape} from 'react-router'
import {connect} from 'react-redux'

import SimpleAudio from '../components/common/SimpleAudio'
import Header from './Header'
import ChatPanel from './ChatPanel'

import {
    fetchPatientListFromHuanXin, fetchGroupListFromHuanXin, fetchDoctorListFromServer, newMessageHinted,
    startSingleChat, startRoomChat
} from '../actions/chat'

class ChatApp extends Component {
    static contextTypes = {
        router: routerShape
    }

    static childContextTypes = {
        curUserId: PropTypes.string,
        patients: PropTypes.array,
        rooms: PropTypes.array,
        doctors: PropTypes.array,
        groupMembers: PropTypes.array
    }

    constructor(props) {
        super(props)
    }

    getChildContext() {
        return {
            curUserId: this.props.curUserId,
            patients: this.props.patients,
            doctors: this.props.doctors,
            rooms: this.props.rooms,
            groupMembers: this.props.groupMembers
        }
    }

    componentWillMount() {
        if (!this.props.login.success) {
            this.context.router.push('/')
            return
        }
        this.props.fetchPatientListFromHuanXin()
        this.props.fetchGroupListFromHuanXin()
        this.props.fetchDoctorListFromServer()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newMessage && !this.props.newMessage) {
            this.newMessageAudio.playAudio().then(()=> {
                this.props.newMessageHinted()
            })
        }
    }

    render() {
        return (
            <div className="chat">
                <div className="hidden">
                    <SimpleAudio audioUrl="audio/new-message.wav" ref={c=>this.newMessageAudio = c}/>
                </div>
                <Header />
                <ChatPanel
                    patients={this.props.patients}
                    rooms={this.props.rooms}
                    doctors={this.props.doctors}

                    singleMessage={this.props.singleMessage}
                    roomMessage={this.props.roomMessage}

                    members={this.props.groupMembers}

                    actions={{
                        startSingleChat: this.props.startSingleChat,
                        startRoomChat: this.props.startRoomChat
                    }}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        login: state.login,
        curUserId: state.curUserId,
        patients: state.patients,
        rooms: state.rooms,
        doctors: state.doctorList,
        groupMembers: state.groupMembers,
        newMessage: state.chat.newMessage,

        singleMessage: state.singleMessage,
        roomMessage: state.roomMessage
    }
}

export default connect(mapStateToProps, {
    fetchPatientListFromHuanXin,
    fetchGroupListFromHuanXin,
    fetchDoctorListFromServer,
    newMessageHinted,

    startSingleChat,
    startRoomChat
})(ChatApp)
