/**
 * Created by jiangyukun on 2016/11/15.
 */
import {ChatType} from '../constants/ChatConstants'

export default {
    getNickname(id, chatType, patients, doctors, rooms) {
        if (chatType == ChatType.CHAT) {
            let p = patients.find(patient => patient.name == id)
            if (p) {
                return p.nickname
            }
            let d = doctors.find(doctor => doctor.name == id)
            if (d) {
                return d.nickname
            }
        } else {
            let room = rooms.find(room => room.id == id)
            if (room) {
                return room.name
            }
        }
    },
    getMessage(chatId, singleMessage, roomMessage) {
        return singleMessage.find(msg => msg.name == chatId) || roomMessage.find(msg => msg.id == chatId)
    }
}
