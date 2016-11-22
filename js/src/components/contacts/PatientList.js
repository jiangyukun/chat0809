/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'
import classnames from 'classnames'

import SimpleListComponent from '../abstract/SimpleListComponent'
import {ChatType} from '../../constants/ChatConstants'

class PatientList extends SimpleListComponent {
    render() {
        this.initRender()

        return (
            <div>
                {
                    this.props.patients.length > 0 && (
                        <div>
                            <h4 className="contact_title">患者</h4>
                        </div>
                    )
                }

                {
                    this.props.patients.map(patient => {
                        if (!this.isContinueLoad()) {
                            return null
                        }

                        return (
                            <div key={patient.name}
                                 className={classnames({'active': patient.name == this.props.selectedContactId})}
                                 onDoubleClick={e => this.props.startChat(patient, ChatType.CHAT)}>
                                <div className="contact_item"
                                     onClick={e => this.props.lookUserDetail(patient.name)}>
                                    <div className="avatar">
                                        <img className="img" src="img/default.jpg"/>
                                    </div>
                                    <div className="info">
                                        <h4 className="nickname">{patient.nickname || patient.name}</h4>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    this.haveMoreListItem() && (
                        <a href="javascript:" className="load-more" onClick={e => this.loadMore()}>加载更多</a>
                    )
                }
            </div>
        )
    }
}

export default PatientList
