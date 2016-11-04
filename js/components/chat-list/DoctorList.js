/**
 * Created by jiangyukun on 2016/10/26.
 */
import React, {Component} from 'react'
import {Collapse} from 'react-bootstrap'
import classnames from 'classnames'
import {loadMore} from '../../constants/constants'

class DoctorList extends Component {
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
        let doctors = this.props.doctors
        let singles = this.props.singles
        let unread = 0

        doctors.forEach(doctor=> {
            let single = singles.find(single=>single.id == doctor.id)
            unread += single.unreads.length
        })

        var unreadMessage = doctorId=> {
            let count = singles.find(single=>single.id == doctorId).unreads.length
            return count > 0 ? <span className="red">({count})</span> : ''
        }

        let currentCount = 0, filterCount = 0

        return (
            <div>
                <header className="list-head" onClick={e=> this.setState({active: !this.state.active})}>
                    <span>医生{unread > 0 && <span className="red">({unread})</span>}</span>
                </header>
                <Collapse in={this.state.active}>
                    <ul>
                        {
                            doctors.map((doctor, index) => {

                                let key = this.props.searchKey
                                let idInfo = ' '
                                if (key) {
                                    if (doctor.name != doctor.nickname) {
                                        idInfo = '(' + doctor.name + ')'
                                    }
                                    if ((!doctor.nickname || doctor.nickname.indexOf(key) == -1) && (!doctor.name || doctor.name.indexOf(key) == -1)) {
                                        return null
                                    }
                                }

                                filterCount++
                                if (currentCount >= this.state.maxCount) {
                                    return null
                                }
                                currentCount++
                                return (
                                    <li key={index} className={classnames("list-item", {'active': doctor.active})}
                                        onClick={e=> this.props.startChat(doctor)}>
                                        {doctor.nickname ? doctor.nickname + idInfo : doctor.name}
                                        {unreadMessage(doctor.name)}
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

export default DoctorList
