/**
 * Created by jiangyukun on 2016/11/10.
 */
import React, {Component} from 'react'

class DoctorList extends Component {

    render() {
        return (
            <div>
                <div>
                    <h4 className="contact_title">医生</h4>
                </div>
                {
                    this.props.doctors.map(doctor=> {
                        return (
                            <div key={doctor.name}>
                                <div className="contact_item">
                                    <div className="avatar">
                                        <img className="img" src="img/default.jpg"/>
                                    </div>
                                    <div className="info">
                                        <h4 className="nickname">{doctor.nickname || doctor.name}</h4>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default DoctorList
