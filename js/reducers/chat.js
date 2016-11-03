/**
 * Created by jiangyukun on 2016/11/2.
 */

import actionConstants from '../actions/actionConstants'

export function patients(state = [], action) {
    switch (action.type) {
        case actionConstants.chat.INIT_PATIENT_SUCCESS:
            let patients = action.patients
            return patients.map(patient=> {
                return {
                    id: patient.id,
                    name: patient.name,
                    nickname: patient.name
                }
            })
        default:
            break
    }
    return state
}

export function rooms(state = [], action) {
    switch (action.type) {
        case actionConstants.chat.INIT_GROUP_SUCCESS:
            let rooms = action.rooms
            return rooms.map(room=> {
                return {
                    id: room.roomId,
                    name: room.name
                }
            })
        default:
            return state
    }
}

export function doctorList(state = [], action) {
    switch (action.type) {
        case actionConstants.chat.INIT_DOCTOR_SUCCESS:
            let doctor = action.doctors
            return doctor.map(doctor=> {
                return {
                    id: doctor.id,
                    name: doctor.name,
                    nickname: doctor.name
                }
            })
        default:
            break
    }

    return state
}

export function groupMembers(state = [], action) {
    return state
}
