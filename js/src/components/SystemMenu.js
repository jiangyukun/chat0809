/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'

class SystemMenu extends Component {

    render() {
        return (
            <div className="mmpop ng-scope system_menu" tabIndex="-1">
                <ul className="dropdown_menu">
                    <li>
                        <a tabIndex="-1" href="javascript:;" title="关闭声音">
                            <i className="menuicon_volume_on"></i>
                            关闭声音
                        </a>
                    </li>
                    <li className="last_child" href="javascript:;" title="退出">
                        <a tabIndex="-1">
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
