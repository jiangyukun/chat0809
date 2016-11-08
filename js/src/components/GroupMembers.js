/**
 * jiangyukun on 2016/8/3 17:45
 */
import React, {Component} from 'react'

export default class GroupMembers extends Component {
    render() {
        return (
            <ul>
                <li className="header">群成员</li>
                {
                    this.props.members && this.props.members.map(member => {
                        return (<li key={member.jid}>{member.name}</li>)
                    })
                }
            </ul>
        )
    }
}
