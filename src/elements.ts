import * as moment from 'moment'
import DirectoryItem from "./interfaces/directoryitem"
import { join } from 'path'

const CreateDirectoryItemElement = (item: DirectoryItem) : HTMLDivElement => {
    const e_wrapper = document.createElement('div')
    const e_icon = document.createElement('span')
    const e_name = document.createElement('span')
    const e_date = document.createElement('span')

    e_wrapper.classList.add('directory-item')
    e_wrapper.setAttribute('x-path', join(item.path, item.name))
    e_wrapper.setAttribute('x-type', item.directory ? 'folder' : 'file')
    e_icon.classList.add('material-icons')
    e_icon.innerText = item.directory ? 'folder' : 'insert_drive_file'

    e_name.classList.add('name')
    e_name.innerText = item.name

    e_date.classList.add('cdate')
    e_date.innerText = moment(item.creation_date).format('YYYY/MM/DD HH:MM')

    e_wrapper.appendChild(e_icon)
    e_wrapper.appendChild(e_name)
    e_wrapper.appendChild(e_date)

    return e_wrapper
}

export { CreateDirectoryItemElement }