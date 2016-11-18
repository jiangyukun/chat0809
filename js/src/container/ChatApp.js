/**
 * jiangyukun on 2016/07/28 10:00
 */
import React, {Component, PropTypes} from 'react'
import {routerShape} from 'react-router'
import {connect} from 'react-redux'

import Header from './Header'
import SearchBar from './SearchBar'
import Tab from '../components/Tab'
import ChatTab from './tabs/ChatTab'
import ContactTab from './tabs/ContactTab'
import IndexChat from './IndexChat'
import ContactChat from './ContactChat'
import SystemMenu from '../components/SystemMenu'
import SimpleAudio from '../components/common/SimpleAudio'
import {ChatType, APP_SOUND} from '../constants/ChatConstants'

import {
    fetchPatientListFromHuanXin, fetchGroupListFromHuanXin, fetchPatientListFromServer, fetchDoctorListFromServer,
    classifyNewMessage, newMessageHinted,
    startSingleChat, startRoomChat, handleCurrentChat,
    exitChatSystem
} from '../actions/chat'

class ChatApp extends Component {
    constructor(props) {
        super(props)
        this.selectTab = this.selectTab.bind(this)
        this.selectContact = this.selectContact.bind(this)
        this.startChat = this.startChat.bind(this)
        this.startChatFromContact = this.startChatFromContact.bind(this)
        this.exit = this.exit.bind(this)
        this.state = {
            showSystemMenu: false,
            appSoundState: APP_SOUND.ON,
            currentTab: Tab.CHAT_TAB,
            selectedChatId: null,
            selectedContactId: null
        }
    }

    selectTab(tab) {
        this.setState({currentTab: tab})
    }

    selectContact(contactId) {
        this.setState({selectedContactId: contactId})
    }

    startChat(contactId, chatType) {
        this.setState({selectedChatId: contactId, currentTab: Tab.CHAT_TAB})
        if (chatType == ChatType.CHAT) {
            this.props.startSingleChat(contactId)
        } else {
            this.props.startRoomChat(contactId)
        }
    }

    startChatFromContact(contact, chatType) {
        let contactId
        if (chatType == ChatType.CHAT) {
            contactId = contact.name
            this.props.startSingleChat(contactId)
        } else {
            contactId = contact.id
            this.props.startRoomChat(contactId)
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

    componentWillMount() {
        if (!this.props.login.success) {
            this.context.router.push('/')
            return
        }
        let curUserId = this.props.curUserId
        this.props.fetchGroupListFromHuanXin()
        if (curUserId.indexOf('bkkf') != -1 || curUserId.indexOf('bkzs') != -1) {
            this.props.fetchPatientListFromServer()
            this.props.fetchDoctorListFromServer()
        } else if (curUserId.indexOf('zxys') != -1) {
            this.props.fetchPatientListFromServer()
        } else {
            this.props.fetchPatientListFromHuanXin()
            this.props.fetchDoctorListFromServer()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newMessage && !this.props.newMessage) {
            if (this.state.appSoundState == APP_SOUND.ON) {
                this.newMessageAudio.playAudio().then(() => {
                    this.props.newMessageHinted()
                })
            } else {
                this.props.newMessageHinted()
            }
        }
    }

    render() {
        return (
            <div className="main">
                <div className="hidden" style={{height: 0}}>
                    <SimpleAudio audioUrl="audio/new-message.wav" ref={c => this.newMessageAudio = c}/>
                </div>
                <div className="main_inner">
                    <div className="panel">
                        <Header curUserId={this.props.curUserId}
                                toggle={() => this.setState({showSystemMenu: !this.state.showSystemMenu})}
                                close={() => this.setState({showSystemMenu: false})}/>

                        <SearchBar startChat={this.startChat}/>

                        <Tab currentTab={this.state.currentTab} selectTab={this.selectTab}/>

                        {this.state.currentTab == Tab.CHAT_TAB && <ChatTab selectedChatId={this.state.selectedChatId} startChat={this.startChat}/>}

                        {this.state.currentTab == Tab.FRIENDS_TAB && <ContactTab selectContact={this.selectContact}
                                                                                 startChat={this.startChatFromContact}
                                                                                 selectedContactId={this.state.selectedContactId}/>}

                        {this.state.showSystemMenu && <SystemMenu appSoundState={this.state.appSoundState}
                                                                  closeSound={() => this.setState({appSoundState: APP_SOUND.OFF})}
                                                                  openSound={() => this.setState({appSoundState: APP_SOUND.ON})}
                                                                  exit={() => this.exit()}/>}
                    </div>

                    {
                        this.state.currentTab == Tab.CHAT_TAB && <IndexChat selectedChatId={this.state.selectedChatId}/>
                    }

                    {
                        this.state.currentTab == Tab.FRIENDS_TAB && <ContactChat selectedContactId={this.state.selectedContactId}
                                                                                 startChat={this.startChatFromContact}/>
                    }

                </div>
            </div>
        )
    }
}

ChatApp.contextTypes = {
    router: routerShape
}

function mapStateToProps(state) {
    return {
        login: state.login,
        curUserId: state.curUserId,
        chatList: state.chatList,
        newMessage: state.app.newMessage
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
