import { readdir, stat, Dir } from 'mz/fs'
import { join, dirname, extname, basename, sep, normalize } from 'path'
import { CreateDirectoryItemElement, CreatePathSegment, CreateDriveItemElement, CreateFavoriteDirectoryElement } from './elements'
import { shell } from 'electron'
import { getDiskInfo } from 'node-disk-info'

import DirectoryItem from './interfaces/directoryitem'
import ContextMenu from './context_menu'
import Drive from 'node-disk-info/dist/classes/drive'

class FileManager {
    public path: string = 'C:/'
    public sorting_method: string = 'name'
    public favorites: DirectoryItem[] = []

    private E_DirContents: HTMLDivElement = document.querySelector('.directory-contents')
    private E_PathElement: HTMLDivElement = document.querySelector('.path')
    private E_PathInput: HTMLInputElement = document.querySelector('.path-input')
    private E_NavParentDir: HTMLButtonElement = document.querySelector('#nav-parent-dir')
    private E_NavSort: HTMLButtonElement = document.querySelector('#nav-sort')
    private E_FavoriteCollection: HTMLDivElement = document.querySelector('#favorite-list')
    private E_DriveCollection: HTMLDivElement = document.querySelector('#drive-list')

    constructor () {
        this.E_PathElement.addEventListener('contextmenu', e => {
            e.preventDefault()

            this.E_PathInput.classList.remove('hidden')
            this.E_PathElement.classList.add('hidden')

            this.E_PathInput.focus()
            this.E_PathInput.value = this.path
            this.E_PathInput.selectionStart = 0
            this.E_PathInput.selectionEnd = this.path.length
        })

        this.E_PathInput.addEventListener('focusout', () => {
            this.E_PathInput.classList.add('hidden')
            this.E_PathElement.classList.remove('hidden')
        })

        this.E_PathInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                let o_path = this.path
                
                try {
                    this.change_dir(this.E_PathInput.value)
                    this.E_PathInput.blur()
                } catch (ex) {
                    this.change_dir(o_path)
                }

                e.preventDefault()
            }
        })

        this.E_NavParentDir.addEventListener('click', () => {
            this.change_dir(normalize(this.path + '../'))
        })

        this.E_NavSort.addEventListener('click', e => {
            let menu = new ContextMenu()

            menu.add_item({ text: 'Organizar por nome', click: () => { this.sorting_method = 'name'; this.updateListing() } })
            menu.add_item({ text: 'Organizar por data de criação', click: () => { this.sorting_method = 'cdate'; this.updateListing() } })
            menu.add_item({ text: 'Organizar por data de modificação', click: () => { this.sorting_method = 'mdate'; this.updateListing() } })

            menu.popup({ x: e.clientX, y: e.clientY })
        })
    }

    public change_dir(newPath: string) : void {
        newPath = normalize(newPath + '/')

        this.path = newPath
        this.updateListing()

        this.E_PathElement.innerHTML = ''

        let segments: string[] = newPath.split(sep).filter(s => s.length > 1)
        let e_segments: HTMLDivElement[] = segments.map((s, i) => CreatePathSegment(s, segments.slice(0, i+1).join(sep)))

        e_segments.forEach(seg => {
            this.E_PathElement.appendChild(seg)
            
            seg.addEventListener('click', (e) => {
                this.change_dir(seg.getAttribute('x-path'))
            })
        })
    }

    public async updateListing () : Promise<void> {
        this.E_DirContents.innerHTML = ''

        let filenames: string[] = await readdir(this.path)
        let files: DirectoryItem[] = []

        for (let filename of filenames) {
            let path: string = join(this.path, filename)

            try {
                let file: DirectoryItem = await this.parseDirectoryItem(path)

                files.push(file)
            } catch(ex) {
                console.warn(`Não foi possível adicionar o arquivo ${path} à lista`, ex)
            }
        }

        this.sortFiles(files)
            .sort((a, b) => Number(b.directory) - Number(a.directory)) // folders first
            .forEach(file => this.addItemToListing(file))
    }

    public async updateDriveListing() : Promise<void> {
        const drives: Drive[] = await getDiskInfo()

        this.E_DriveCollection.innerHTML = ''

        drives.sort((a, b) => b.filesystem.localeCompare(a.filesystem))

        for (let drive of drives) {
            const e_drive: HTMLDivElement = CreateDriveItemElement(drive)

            e_drive.addEventListener('click', () => this.change_dir(drive.mounted))

            this.E_DriveCollection.appendChild(e_drive)

            console.info(`Disco ${drive.mounted} adicionado`, drive)
        }
    }

    public updateFavoriteListing() : void {
        this.E_FavoriteCollection.innerHTML = ''

        for (let favorite of this.favorites) {
            if (!favorite.directory) continue;

            let e_fav: HTMLDivElement = CreateFavoriteDirectoryElement(favorite)

            e_fav.addEventListener('click', () => this.change_dir(join(favorite.path, favorite.name)))
            e_fav.addEventListener('contextmenu', e => {
                let menu = new ContextMenu()

                menu.add_item({ icon: 'close', text: 'Remover dos favoritos', click: () => {
                    this.favorites.splice(this.favorites.indexOf(favorite), 1)
                    this.updateFavoriteListing()
                } })

                menu.popup({ x: e.clientX, y: e.clientY })
            })

            this.E_FavoriteCollection.appendChild(e_fav)
        }
    }

    public async parseDirectoryItem(fullpath: string) : Promise<DirectoryItem> {
        let s = await stat(fullpath)

        return {
            name: basename(fullpath),
            extension: extname(fullpath),
            path: dirname(fullpath),
            creation_date: s.birthtime,
            mod_date: s.ctime,
            directory: s.isDirectory()
        }
    }

    private async addItemToListing(item: DirectoryItem): Promise<void> {
        let e_item: HTMLDivElement = CreateDirectoryItemElement(item)

        e_item.addEventListener('click', () => {
            e_item.classList.toggle('selected')
        })

        e_item.addEventListener('dblclick', () => {
            if (item.directory) {
                this.change_dir(e_item.getAttribute('x-path'))
            } else {
                shell.openItem(e_item.getAttribute('x-path'))

                // remover todas as outras seleções ao abrir o arquivo
                document.querySelectorAll('.directory-item.selected')
                    .forEach(item => item.classList.remove('selected'))
            }
        })

        e_item.addEventListener('contextmenu', e => {
            let ctx = new ContextMenu()

            ctx.add_item({ icon: 'create', text: 'Renomear', click: () => { throw 'não implementado' } })
            ctx.add_item({ icon: 'file_copy', text: 'Copiar', click: () => { throw 'não implementado' } })
            ctx.add_item({ icon: 'clear', text: 'Apagar', click: () => { throw 'não implementado' } })
            ctx.add_separator()
            ctx.add_item({ icon: 'star', text: 'Adicionar aos favoritos', click: () => {
                this.addToFavorites(item)
                e_item.classList.remove('selected')
            } })
            ctx.add_item({ icon: 'list', text: 'Detalhes', click: () => { throw 'não implementado' } })

            ctx.popup({ x: e.clientX, y: e.clientY })
            e_item.classList.add('selected')
        })

        this.E_DirContents.appendChild(e_item)
    }

    public addToFavorites(file: DirectoryItem) : void {
        this.favorites.push(file)
        this.updateFavoriteListing()
    }

    public sortFiles(files: DirectoryItem[]) : DirectoryItem[] {
        switch (this.sorting_method) {
            case 'cdate':
                return files.sort((a, b) => a.creation_date.getMilliseconds() - b.creation_date.getMilliseconds())
            case 'cdate':
                return files.sort((a, b) => a.mod_date.getMilliseconds() - b.mod_date.getMilliseconds())
            case 'name':
            default:
                return files.sort((a, b) => a.name.localeCompare(b.name))
        }
    }
}

export default new FileManager()