/**
 * Created by jiangyukun on 2016/11/7.
 */
import actionConstants from './actionConstants'

export function sortPatientList(singleMessage) {
    return {
        type: actionConstants.app.SORT_PATIENT_LIST,
        singleMessage
    }
}

export function sortRoomList(roomMessage) {
    return {
        type: actionConstants.app.SORT_ROOM_LIST,
        roomMessage
    }
}

export function sortDoctorList(singleMessage) {
    return {
        type: actionConstants.app.SORT_DOCTOR_LIST,
        singleMessage
    }
}

