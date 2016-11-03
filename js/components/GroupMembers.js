/**
 * jiangyukun on 2016/8/3 17:45
 */
import React, {Component, PropTypes} from 'react'

export default class GroupMembers extends Component {
    static contextTypes = {
        groupMembers: PropTypes.array
    }

    showGroupMember() {
        return (
            this.context.groupMembers.map((member, index) => {
                return (<li key={index}>
                    {member.name}
                </li>)
            })
        )
    }

    render() {
        return (
            <ul>
                <li className="header">群成员</li>
                {this.showGroupMember()}
            </ul>
        )
    }
}
