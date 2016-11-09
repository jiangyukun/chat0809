/**
 * Created by jiangyukun on 2016/11/9.
 */
import React, {Component} from 'react'

class SearchBar extends Component {

    render() {
        return (
            <div className="search_bar">
                <i className="web_wechat_search"></i>

                <input className="frm_search" type="text"
                       onInput={e=>this.search(e)} onKeyDown={e=>this.searchKeydown(e)} placeholder="搜索"/>
            </div>
        )
    }
}

export default SearchBar
