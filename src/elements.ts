import * as moment from 'moment'
import DirectoryItem from "./interfaces/directoryitem"
import { join } from 'path'
import Drive from 'node-disk-info/dist/classes/drive'

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
    e_wrapper.setAttribute('title', item.name)

    e_date.classList.add('cdate')
    e_date.innerText = moment(item.creation_date).format('YYYY/MM/DD HH:MM')

    e_wrapper.appendChild(e_icon)
    e_wrapper.appendChild(e_name)
    e_wrapper.appendChild(e_date)

    return e_wrapper
}

const CreateDriveItemElement = (drive: Drive) : HTMLDivElement => {
    const e_wrapper = document.createElement('div')
    const e_icon = document.createElement('span')
    const e_name = document.createElement('span')

    e_wrapper.classList.add('collection-item')
    e_icon.classList.add('material-icons', 'icon')
    e_name.classList.add('name')

    e_name.innerText = drive.mounted || drive.filesystem
    e_icon.innerText = 'usb'

    if (drive.filesystem.includes('CD-') || drive.filesystem.includes('DVD-'))
        e_icon.innerText = 'album'
    if (drive.filesystem.includes('Local') || drive.filesystem.includes('local'))
        e_icon.innerText = 'computer'

    e_wrapper.title = drive.filesystem

    e_wrapper.appendChild(e_icon)
    e_wrapper.appendChild(e_name)

    return e_wrapper
}

const CreateFavoriteDirectoryElement = (item: DirectoryItem) : HTMLDivElement => {
    const e_wrapper = document.createElement('div')
    const e_icon = document.createElement('span')
    const e_name = document.createElement('span')

    e_wrapper.classList.add('collection-item')
    e_icon.classList.add('material-icons', 'icon')
    e_name.classList.add('name')

    e_name.innerText = item.name
    e_icon.innerText = 'folder'

    e_wrapper.title = item.path

    e_wrapper.appendChild(e_icon)
    e_wrapper.appendChild(e_name)

    return e_wrapper
}

const CreatePathSegment = (segment: string, path: string) : HTMLDivElement => {
    const e_seg = document.createElement('div')

    e_seg.classList.add('path_part')
    e_seg.innerText = segment
    e_seg.setAttribute('x-path', path)

    return e_seg
}

export { CreateDirectoryItemElement, CreatePathSegment, CreateDriveItemElement, CreateFavoriteDirectoryElement }