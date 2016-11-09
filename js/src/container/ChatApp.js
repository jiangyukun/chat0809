/**
 * jiangyukun on 2016/07/28 10:00
 */
import React, {Component, PropTypes} from 'react'
import {routerShape} from 'react-router'
import {connect} from 'react-redux'

import SimpleAudio from '../components/common/SimpleAudio'
import Header from './Header'
import ChatPanel from './ChatPanel'
import SystemMenu from '../components/SystemMenu'
import SearchBar from '../components/SearchBar'
import Tab from '../components/Tab'
import ChatTab from '../components/tab-list/ChatTab'
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
        if (curUserId.indexOf('bkkf') != -1 || curUserId.indexOf('bkzs') != -1) {
            this.props.fetchPatientListFromServer()
            this.props.fetchGroupListFromHuanXin()
            this.props.fetchDoctorListFromServer()
        } else if (curUserId.indexOf('zxys') != -1) {
            this.props.fetchPatientListFromServer()
            this.props.fetchGroupListFromHuanXin()
        } else {
            this.props.fetchPatientListFromHuanXin()
            this.props.fetchGroupListFromHuanXin()
            this.props.fetchDoctorListFromServer()
        }

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
            <div className="main">
                <div className="hidden" style={{height: 0}}>
                    <SimpleAudio audioUrl="audio/new-message.wav" ref={c=>this.newMessageAudio = c}/>
                </div>
                <div className="main_inner">

                    <div className="panel">
                        <Header />
                        <SearchBar/>
                        <Tab/>
                        <ChatTab/>

                        {/*<SystemMenu/>*/}
                    </div>
                </div>
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
