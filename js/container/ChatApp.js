/**
 * jiangyukun on 2016/07/28 10:00
 */
import React, {Component, PropTypes} from 'react'
import {routerShape} from 'react-router'
import {connect} from 'react-redux'

import SimpleAudio from '../components/common/SimpleAudio'
import Header from './Header'
import ChatPanel from './ChatPanel'
import {sortPatientList, sortRoomList, sortDoctorList} from '../actions/app'
import {
    fetchPatientListFromHuanXin, fetchGroupListFromHuanXin, fetchDoctorListFromServer,
    classifyNewMessage, newMessageHinted,
    startSingleChat, startRoomChat, handleCurrentChat
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
        members: PropTypes.array
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
            members: this.props.members
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

    componentDidUpdate() {
        if (this.props.newMessage) {
            this.props.classifyNewMessage(this.props.app.from, this.props.patients, this.props.doctors)
        }
        let app = this.props.app
        if (app.patientInit) {
            this.props.sortPatientList(this.props.singleMessage)
        }
        if (app.roomInit) {
            this.props.sortRoomList(this.props.roomMessage)
        }
        if (app.doctorInit) {
            this.props.sortDoctorList(this.props.singleMessage)
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
                    app={this.props.app}
                    patients={this.props.patients}
                    rooms={this.props.rooms}
                    doctors={this.props.doctors}
                    members={this.props.members}

                    singleMessage={this.props.singleMessage}
                    roomMessage={this.props.roomMessage}

                    actions={{
                        startSingleChat: this.props.startSingleChat,
                        startRoomChat: this.props.startRoomChat,
                        handleCurrentChat: this.props.handleCurrentChat
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
        doctors: state.doctors,
        members: state.members,
        app: state.app,
        newMessage: state.app.newMessage,

        singleMessage: state.singleMessage,
        roomMessage: state.roomMessage
    }
}

export default connect(mapStateToProps, {
    fetchPatientListFromHuanXin,
    fetchGroupListFromHuanXin,
    fetchDoctorListFromServer,
    classifyNewMessage,
    newMessageHinted,

    sortPatientList,
    sortRoomList,
    sortDoctorList,

    startSingleChat,
    startRoomChat,
    handleCurrentChat
})(ChatApp)
