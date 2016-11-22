/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {connect} from 'react-redux'
import classnames from 'classnames'
import {events} from 'dom-helpers'

import SimpleListComponent from '../components/abstract/SimpleListComponent'
import {ChatType} from '../constants/ChatConstants'

class SearchBar extends Component {
    constructor() {
        super()
        this.startChat = this.startChat.bind(this)
        this.handleContainerClick = this.handleContainerClick.bind(this)
        this.handleDocumentClick = this.handleDocumentClick.bind(this)
        this.state = {show: false, empty: false, active: -1}
    }

    startChat(id, chatType) {
        this.props.startChat(id, chatType)
        this.closeSearchResult()
    }

    closeSearchResult() {
        this.setState({show: false})
    }

    search(event) {
        let searchKey = event.target.value
        if (!searchKey) {
            this.setState({show: false})
            return
        }
        this.setState({show: true})

        let {patients, rooms, doctors} = this.props

        this.setState({matchPatients: patients.filter(patient => patient.nickname.indexOf(searchKey) != -1 || patient.name.indexOf(searchKey) != -1)})
        this.setState({matchRooms: rooms.filter(room => room.name.indexOf(searchKey) != -1)})
        this.setState({matchDoctors: doctors.filter(doctor => doctor.nickname.indexOf(searchKey) != -1 || doctor.name.indexOf(searchKey) != -1)})
    }

    handleContainerClick() {
        this.keep = true
    }

    handleDocumentClick() {
        if (this.keep) {
            this.keep = false
            return
        }
        this.closeSearchResult()
    }

    componentDidMount() {
        events.on(findDOMNode(this), 'click', this.handleContainerClick)
        events.on(document, 'click', this.handleDocumentClick)
    }

    componentWillUnmount() {
        events.off(findDOMNode(this), 'click', this.handleContainerClick)
        events.off(document, 'click', this.handleDocumentClick)
    }

    render() {
        return (
            <div className="search_bar">
                <i className="web_wechat_search"></i>

                <input className="frm_search" type="text"
                       onInput={e => this.search(e)} onKeyDown={e => this.search(e)} placeholder="搜索"/>

                {
                    this.state.show && (
                        <div className="mmpop recommendation" tabIndex="-1">
                            <div className="scroll-wrapper contacts scrollbar-dynamic" style={{position: 'relative', 'height': '450px'}}>
                                <div className="contacts scrollbar-dynamic scroll-content scroll-scrolly_visible">
                                    <MatchedPatientList matchPatients={this.state.matchPatients}
                                                        startChat={this.startChat}
                                                        activeItem={id => this.setState({active: id})}
                                                        currentActiveItem={this.state.active}/>
                                    <MatchedRoomList matchRooms={this.state.matchRooms}
                                                     startChat={this.startChat}
                                                     activeItem={id => this.setState({active: id})}
                                                     currentActiveItem={this.state.active}/>
                                    <MatchedDoctorList matchDoctors={this.state.matchDoctors}
                                                       startChat={this.startChat}
                                                       activeItem={id => this.setState({active: id})}
                                                       currentActiveItem={this.state.active}/>
                                    <div>
                                        {
                                            this.state.matchPatients.length == 0 &&
                                            this.state.matchRooms.length == 0 &&
                                            this.state.matchDoctors.length == 0 && (
                                                <div><h4 className="contact_title">找不到匹配的结果</h4></div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    let {patients, rooms, doctors} = state
    return {
        patients, rooms, doctors
    }
}

export default connect(mapStateToProps)(SearchBar)

class CategoryMatchComponent extends SimpleListComponent {
    startChat(match, chatType) {
        if (chatType == ChatType.CHAT) {
            this.props.startChat(match.name, chatType)
        } else {
            this.props.startChat(match.id, chatType)
        }
    }

    getMatchList(chatType, matches) {
        return matches.map(match => {
            if (!this.isContinueLoad()) {
                return null
            }
            return (
                <div key={match.id}>
                    <div className={classnames('contact_item', {'on': this.props.currentActiveItem == match.id})}
                         onMouseEnter={e => this.props.activeItem(match.id)}
                         onClick={e => this.startChat(match, chatType)}>
                        <div className="avatar">
                            <img className="img lazy" src="img/default.jpg"/>
                        </div>
                        <div className="info">
                            <h4 className="nickname ">{match.nickname || match.name}</h4>
                        </div>
                    </div>
                </div>
            )
        })
    }
}

class MatchedPatientList extends CategoryMatchComponent {
    render() {
        let {matchPatients} = this.props
        if (!matchPatients.length) {
            return null
        }

        this.initRender()

        return (
            <div>
                <div>
                    <h4 className="contact_title first">好友</h4>
                </div>
                {this.getMatchList(ChatType.CHAT, matchPatients)}
                {
                    this.haveMoreListItem() && (
                        <a href="javascript:" className="load-more" onClick={e => this.loadMore()}>加载更多</a>
                    )
                }
            </div>
        )
    }
}

class MatchedDoctorList extends CategoryMatchComponent {
    render() {
        let {matchDoctors} = this.props
        if (!matchDoctors.length) {
            return null
        }

        this.initRender()

        return (
            <div>
                <div>
                    <h4 className="contact_title first">医生</h4>
                </div>
                {this.getMatchList(ChatType.CHAT, matchDoctors)}
                {
                    this.haveMoreListItem() && (
                        <a href="javascript:" className="load-more" onClick={e => this.loadMore()}>加载更多</a>
                    )
                }
            </div>
        )
    }
}

class MatchedRoomList extends CategoryMatchComponent {
    render() {
        let {matchRooms} = this.props
        if (!matchRooms.length) {
            return null
        }

        this.initRender()

        return (
            <div>
                <div>
                    <h4 className="contact_title first">群组</h4>
                </div>
                {this.getMatchList(ChatType.GROUP_CHAT, matchRooms)}
                {
                    this.haveMoreListItem() && (
                        <a href="javascript:" className="load-more" onClick={e => this.loadMore()}>加载更多</a>
                    )
                }
            </div>
        )
    }
}
