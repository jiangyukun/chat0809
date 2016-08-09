/*
 * jiangyukun on 2016-07-27 18:36
 */

import React from 'react'
import PaginateList from '../../../components/core/PaginateList';

class SliderConfig extends React.Component {
	 constructor(props) {
	     super(props);
	     this.displayName = 'SliderConfig';
	 }
	 render() {
	 	let slider = this.props.slider || {baseInfo: {}};
	 	let sliderItem = {};

	 	let sliderInfo = {
			recordsTotal: 5,
			sliderList: [
				{image_Config_Type: 123},
				{image_Config_Type: 123},
				{image_Config_Type: 123}
			]
	 	};

	    return (
	     	<div className="app-content-body wrapper account-info">
			    <header className="clearfix">
			        <div className="pull-left">
			            <ol className="breadcrumb">
			                <li>患者管理</li>
			                <li className="active">主页轮播</li>
			            </ol>
			            <span className="description">设置主页轮播图片</span>
			        </div>

			        <div className="pull-right text-center statistics-info">
			            <h5>乙肝显示轮播数</h5>
			            <div>{slider.baseInfo.hepatitisB} (乙肝)+ {slider.baseInfo.all}</div>
			        </div>
			        <div className="pull-right text-center statistics-info">
			            <h5>母婴显示轮播数</h5>
			            <div>{slider.baseInfo.motherAndBaby} (母婴)+ {slider.baseInfo.all}</div>
			        </div>
			    </header>

			    <query-filter data-query-condition="slider.queryCondition">
			        <button className="btn btn-primary" data-ng-click="slider.openNewSliderDialog();">新增</button>
			        <ul data-filter-item="slider.sliderType"></ul>
			        <ul data-filter-item="isShow"></ul>
			    </query-filter>

			    <PaginateList paginateList={sliderInfo}>
			        <table className="table table-striped table-hover" style={{'minWidth': '700px'}}>
			            <thead>
			            <tr>
			                <th className="th-left pl-15" width="100">轮播类型</th>
			                <th className="th-left" width="100">是否显示</th>
			                <th className="th-left">图片</th>
			                <th className="th-left">跳转链接</th>
			                <th className="th-left" width="50">备注</th>
			                <th className="th-left pl-15" data-sort-by="image_config_create_time" width="150">创建时间</th>
			                <th className="th-left" width="20"></th>
			            </tr>
			            </thead>
			            <tbody>
			            	{
			            		sliderInfo.sliderList.map((sliderItem, index) => {
			            			return (
			            				<tr key={index} data-ng-mouseenter="showDelIcon = true;" data-ng-mouseleave="showDelIcon = false;">
							                <td>{sliderItem.image_Config_Type}</td>
							                <td>{sliderItem.image_Config_Is_Show}</td>
							                <td className="w-sm">
							                    <img data-ng-src="{sliderItem.image_Config_Url}" className="img-responsive" />
							                </td>
							                <td>{sliderItem.image_Config_Linked_Url}</td>
							                <td>{sliderItem.image_Config_Remark}</td>
							                <td>{sliderItem.image_Config_Create_Time}</td>
							                <td className="relative">
							                    <div data-ng-click="slider.deleteSlider(sliderItem);" data-ng-show="showDelIcon && sliderItem.image_Config_Is_Show==1" className="v-center">
							                        <i className="fa fa-remove red"></i>
							                    </div>
							                </td>
							            </tr>
			            			)
			            		})
			            	}
			            </tbody>
			        </table>
			    </PaginateList>
			</div>
	    )
	}
}

module.exports = SliderConfig
