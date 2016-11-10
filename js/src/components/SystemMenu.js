/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'
import classnames from 'classnames'
import {events} from 'dom-helpers'

class SystemMenu extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={classnames('mmpop', 'system_menu', this.props.show ? 'show_system_menu' : 'hide_system_menu')} tabIndex="-1">
                <ul className="dropdown_menu">
                    <li>
                        <a tabIndex="-1" href="javascript:;" title="关闭声音">
                            <i className="menuicon_volume_on"></i>
                            关闭声音
                        </a>
                    </li>
                    <li className="last_child" href="javascript:;" title="退出">
                        <a tabIndex="-1" onClick={this.props.exit}>
                            <i className="menuicon_quit"></i>
                            退出
                        </a>
                    </li>
                </ul>
            </div>
        )
    }
}

export default SystemMenu
