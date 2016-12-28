/**
 * jiangyukun on 2016/07/28 10:00
 */
import React, {Component, PropTypes} from 'react'
import {routerShape} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {merge} from 'lodash'
import notification from 'antd/lib/notification'

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
import webImUtil from '../core/utils/webImUtil'

import * as actions from '../actions/chat'

const Notification = window.Notification
let closeNotificationId = null

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
            this.props.startSingleChat(this.props.curUserId, contactId).then(null, err => notification.error({message: '提示', description: err}))
        } else {
            this.props.startRoomChat(contactId)
        }
    }

    startChatFromContact(contact, chatType) {
        let contactId
        if (chatType == ChatType.CHAT) {
            contactId = contact.name
            this.props.startSingleChat(this.props.curUserId, contactId, true)
                .then(null, err => notification.error({message: '提示', description: err}))
        } else {
            contactId = contact.id
            this.props.startRoomChat(contactId, true)
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
            this.props.fetchPatientListFromServer().then(null, err => notification.error({message: '提示', description: err}))
            this.props.fetchDoctorListFromServer().then(null, err => notification.error({message: '提示', description: err}))
        } else if (curUserId.indexOf('zxys') != -1) {
            this.props.fetchPatientListFromServer().then(null, err => notification.error({message: '提示', description: err}))
        } else {
            this.props.fetchPatientListFromHuanXin()
            this.props.fetchDoctorListFromServer().then(null, err => notification.error({message: '提示', description: err}))
        }
    }

    componentWillReceiveProps(nextProps) {
        const {app} = nextProps
        const {message} = app
        if (message.newMessage && !this.props.app.message.newMessage) {
            if (this.state.appSoundState == APP_SOUND.ON) {
                this.newMessageAudio.playAudio().then(() => {
                    this.props.newMessageHinted()
                })
                if (Notification && app.notificationPermissionStatus == 'granted') {
                    let notification = new Notification(message.from, {body: webImUtil.getMessageContentTip(message.originalMessage)})
                    setTimeout(() => {
                        notification.close()
                    }, 3000)
                }
            } else {
                this.props.newMessageHinted()
            }
        }
        if (app.connClosed) {
            closeNotificationId = 'closeNotificationId'
            notification.error({message: '提示', description: '已退出登录，请重新登录！', duration: 0, key: closeNotificationId})
            this.exit()
        }
    }

    componentDidMount() {
        if (closeNotificationId) {
            notification.close(closeNotificationId)
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
        app: state.app,
        login: state.login,
        curUserId: state.curUserId,
        chatList: state.chatList
    }
}

function mapActionToProps(dispatch) {
    return merge(bindActionCreators({
        fetchPatientListFromHuanXin: actions.fetchPatientListFromHuanXin,
        fetchGroupListFromHuanXin: actions.fetchGroupListFromHuanXin,
        newMessageHinted: actions.newMessageHinted,

        startRoomChat: actions.startRoomChat,
        handleCurrentChat: actions.handleCurrentChat,
        exitChatSystem: actions.exitChatSystem
    }, dispatch), {
        fetchPatientListFromServer: actions.fetchPatientListFromServer(dispatch),
        fetchDoctorListFromServer: actions.fetchDoctorListFromServer(dispatch),
        startSingleChat: actions.startSingleChat(dispatch)
    })
}

export default connect(mapStateToProps, mapActionToProps)(ChatApp)
