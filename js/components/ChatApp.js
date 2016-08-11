/**
 * jiangyukun on 2016/07/28 10:00
 */
import React, {Component, PropTypes} from 'react'
import {routerShape} from 'react-router'
import Header from './Header'
import ChatPanel from './ChatPanel'
import ChatStore from '../stores/ChatStore'
import chatActions from '../actions/ChatActions'

function getChatState() {
    return {
        curUserId: ChatStore.getLoginUser(),
        patients: ChatStore.getPatientList(),
        doctorList: ChatStore.getDoctorList(),
        patientGroups: ChatStore.getPatientGroupList(),
        message: ChatStore.getMessage(),
        groupMembers: ChatStore.getGroupMembers()
    }
}

export default class ChatApp extends Component {
    static contextTypes = {
        router: routerShape
    }

    static childContextTypes = {
        curUserId: PropTypes.string,
        patients: PropTypes.array,
        patientGroups: PropTypes.array,
        doctorList: PropTypes.array,
        message: PropTypes.array,
        groupMembers: PropTypes.array
    }

    constructor(props) {
        super(props)
        this.state = getChatState()
    }

    getChildContext() {
        return {
            curUserId: this.state.curUserId,
            patients: this.state.patients,
            doctorList: this.state.doctorList,
            patientGroups: this.state.patientGroups,
            message: this.state.message,
            groupMembers: this.state.groupMembers
        }
    }

    componentWillMount() {
        chatActions.checkLoginInfo(()=> {
            this.context.router.push('/')
        })
        this.changeListener = ()=> {
            this.refresh()
        }
        ChatStore.addChangeListener(this.changeListener)

        this.reLoginListener = ()=> {
            this.context.router.back()
        }
        ChatStore.addReLoginListener(this.changeListener)
    }

    componentWillUnmount() {
        ChatStore.removeChangeListener(this.changeListener)
        ChatStore.removeReLoginListener(this.reLoginListener)
    }

    render() {
        return (
            <div className="chat">
                <Header />
                <ChatPanel />
            </div>
        )
    }

    refresh() {
        this.setState(getChatState())
    }
}

