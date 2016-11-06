/**
 * Created by jiangyukun on 2016/10/26.
 */
import React, {Component} from 'react'
import {Collapse} from 'react-bootstrap'
import classnames from 'classnames'
import MessageHelper from '../core/MessageHelper'
import {ChatType} from '../../constants/ChatConstants'
import {loadMore} from '../../constants/constants'

class PatientList extends Component {
    constructor() {
        super()
        this.state = {
            active: true,
            maxCount: loadMore.init
        }
    }

    loadMore() {
        this.setState({maxCount: this.state.maxCount + loadMore.increase})
    }

    render() {
        let patientList = this.props.patients
        let singleMessage = this.props.singleMessage

        let unread = 0
        patientList.forEach((patient) => {
            let msg = singleMessage.find(msg=>msg.name == patient.name)
            unread += msg ? msg.unreads.length : 0
        })

        var unreadMessage = name=> {
            let msg = singleMessage.find(single=>single.name == name)
            let count = msg ? msg.unreads.length : 0
            return count > 0 ? <span className="red">({count})</span> : ''
        }

        let currentCount = 0, filterCount = 0

        return (
            <div>
                <header className="list-head" onClick={e=> this.setState({active: !this.state.active})}>
                    <span>患者{unread > 0 && <span className="red">({unread})</span>}</span>
                </header>
                <Collapse in={this.state.active}>
                    <ul>
                        {
                            patientList.map((patient, index) => {
                                let key = this.props.searchKey
                                let idInfo = ' '
                                if (key) {
                                    if (patient.name != patient.nickname) {
                                        idInfo = '(' + patient.name + ')'
                                    }
                                    if ((!patient.nickname || patient.nickname.indexOf(key) == -1) && (!patient.name || patient.name.indexOf(key) == -1)) {
                                        return null
                                    }
                                }

                                filterCount++
                                if (currentCount >= this.state.maxCount) {
                                    return null
                                }
                                currentCount++
                                return (
                                    <li key={index} className={classnames("list-item", {'active': patient.active})}
                                        onClick={e=> this.props.startChat(patient)}>
                                        {
                                            patient.name ? patient.name + idInfo : patient.id
                                        }
                                        {
                                            unreadMessage(patient.name)
                                        }
                                    </li>
                                )
                            })
                        }
                        {
                            currentCount < filterCount && (
                                <li className="load-more" onClick={e=>this.loadMore()}>加载更多</li>
                            )
                        }
                    </ul>
                </Collapse>
                {
                    filterCount == 0 && (
                        <div className="no-data">暂无数据</div>
                    )
                }
            </div>
        )
    }
}

export default PatientList
