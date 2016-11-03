/**
 * jiangyukun on 2016/07/28 10:00
 */
import React, {Component, PropTypes} from 'react'
import {routerShape} from 'react-router'
import {connect} from 'react-redux'

import Header from './Header'
import ChatPanel from './ChatPanel'

import {fetchPatientListFromHuanXin, fetchGroupListFromHuanXin} from '../actions/chatAction'

class ChatApp extends Component {
    static contextTypes = {
        router: routerShape
    }

    static childContextTypes = {
        curUserId: PropTypes.string,
        patients: PropTypes.array,
        rooms: PropTypes.array,
        doctorList: PropTypes.array,
        message: PropTypes.object,
        groupMembers: PropTypes.array
    }

    constructor(props) {
        super(props)
    }

    getChildContext() {
        return {
            curUserId: this.props.curUserId,
            patients: this.props.patients,
            doctorList: this.props.doctorList,
            rooms: this.props.rooms,
            message: this.props.message,
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
    }

    render() {
        return (
            <div className="chat">
                <Header />
                <ChatPanel />
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
        doctorList: state.doctorList,
        groupMembers: state.groupMembers,
        message: state.message
    }
}

export default connect(mapStateToProps, {
    fetchPatientListFromHuanXin,
    fetchGroupListFromHuanXin
})(ChatApp)
