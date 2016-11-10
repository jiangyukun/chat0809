/**
 * jiangyukun on 2016/07/28 10:00
 */
import React, {Component, PropTypes} from 'react'
import {routerShape} from 'react-router'
import {connect} from 'react-redux'
import {events} from 'dom-helpers'

import SimpleAudio from '../components/common/SimpleAudio'
import Header from './Header'
import SystemMenu from '../components/SystemMenu'
import SearchBar from '../components/SearchBar'
import Tab from '../components/Tab'
import ChatTab from '../components/tab-list/ChatTab'
import FriendsTab from '../components/tab-list/FriendsTab'
import ChatWindow from '../components/chat/ChatWindow'
import {ChatType} from '../constants/ChatConstants'

import {
    fetchPatientListFromHuanXin, fetchGroupListFromHuanXin, fetchPatientListFromServer, fetchDoctorListFromServer,
    classifyNewMessage, newMessageHinted,
    startSingleChat, startRoomChat, handleCurrentChat,
    exitChatSystem
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
        this.toggleSystemMenu = this.toggleSystemMenu.bind(this)
        this.closeSystemMenu = this.closeSystemMenu.bind(this)
        this.selectTab = this.selectTab.bind(this)
        this.selectContact = this.selectContact.bind(this)
        this.startChat = this.startChat.bind(this)
        this.startChatFromContact = this.startChatFromContact.bind(this)
        this.exit = this.exit.bind(this)
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
        this.state = {
            showSystemMenu: false,
            currentTab: Tab.CHAT_TAB,
            selectedChatId: null,
            selectedContactId: null
        }
    }

    toggleSystemMenu() {
        this.setState({'showSystemMenu': !this.state.showSystemMenu})
    }

    closeSystemMenu() {
        this.setState({'showSystemMenu': false})
    }

    selectTab(tab) {
        this.setState({currentTab: tab})
    }

    selectContact(contactId) {
        this.setState({selectedContactId: contactId})
    }

    startChat(contactId, chatType) {
        this.setState({selectedChatId: contactId})
    }

    startChatFromContact(contact, chatType) {
        let contactId
        if (chatType == ChatType.CHAT) {
            contactId = contact.name
            this.props.startSingleChat(this.props.curUserId, contact)
        } else {
            contactId = contact.id
            this.props.startRoomChat(this.props.curUserId, contact)
        }
        this.setState({
            selectedChatId: contactId,
            currentTab: Tab.CHAT_TAB
        })
    }

    exit() {
        this.props.exitChatSystem()
        this.context.router.push('/signin')
    }

    handleDocumentClick() {
        this.closeSystemMenu()
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

    componentDidMount() {
        events.on(document, 'click', this.handleDocumentClick)
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

    componentWillUnmount() {
        events.off(document, 'click', this.handleDocumentClick)
    }

    render() {
        return (
            <div className="main">
                <div className="hidden" style={{height: 0}}>
                    <SimpleAudio audioUrl="audio/new-message.wav" ref={c=>this.newMessageAudio = c}/>
                </div>
                <div className="main_inner">
                    <div className="panel">
                        <Header
                            curUserId={this.props.curUserId}
                            toggle={this.toggleSystemMenu}/>
                        <SearchBar/>
                        <Tab currentTab={this.state.currentTab} selectTab={this.selectTab}/>

                        {this.state.currentTab == Tab.CHAT_TAB && <ChatTab selectedChatId={this.state.selectedChatId}
                                                                           startChat={this.startChat}/>}

                        {this.state.currentTab == Tab.FRIENDS_TAB && <FriendsTab selectContact={this.selectContact}
                                                                                 startChat={this.startChatFromContact}
                                                                                 selectedContactId={this.state.selectedContactId}/>}

                        {this.state.showSystemMenu && <SystemMenu exit={()=>this.exit()}/>}
                    </div>

                    <ChatWindow currentTab={this.state.currentTab}
                                selectedChatId={this.state.selectedChatId}
                                selectedContactId={this.state.selectedContactId}
                                startChat={this.startChatFromContact}/>
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
    handleCurrentChat,
    exitChatSystem
})(ChatApp)
