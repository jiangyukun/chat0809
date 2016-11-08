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
    fetchPatientListFromHuanXin, fetchGroupListFromHuanXin, fetchPatientListFromServer, fetchDoctorListFromServer,
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
        let curUserId = this.props.curUserId
        if (curUserId == 'test0' || curUserId == 'test' || curUserId == 'test1' || curUserId == 'test2') {
            this.props.fetchPatientListFromHuanXin()
            this.props.fetchGroupListFromHuanXin()
            return
        }
        this.props.fetchPatientListFromServer()
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
                    historyMessage={this.props.historyMessage}

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
        roomMessage: state.roomMessage,
        historyMessage: state.historyMessage
    }
}

export default connect(mapStateToProps, {
    fetchPatientListFromHuanXin,
    fetchGroupListFromHuanXin,
    fetchPatientListFromServer,
    fetchDoctorListFromServer,
    classifyNewMessage,
    newMessageHinted,

    startSingleChat,
    startRoomChat,
    handleCurrentChat
})(ChatApp)
