import { readdir, stat } from 'mz/fs'
import { join, dirname, extname, basename, sep, normalize } from 'path'
import { CreateDirectoryItemElement, CreatePathSegment } from './elements'
import { shell } from 'electron'
import DirectoryItem from './interfaces/directoryitem'
import ContextMenu from './context_menu'

class FileManager {
    public path: string = 'C:/'

    private E_DirContents: HTMLDivElement = document.querySelector('.directory-contents')
    private E_PathElement: HTMLDivElement = document.querySelector('.path')
    private E_PathInput: HTMLInputElement = document.querySelector('.path-input')
    private E_NavParentDir: HTMLInputElement = document.querySelector('#nav-parent-dir')

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
        let files: string[] = await readdir(this.path)

        this.E_DirContents.innerHTML = ''

        files.forEach(f => this.addItemToListing(join(this.path, f)))
    }

    public async parseDirectoryItem(fullpath: string) : Promise<DirectoryItem> {
        let s = await stat(fullpath)

        return {
            name: basename(fullpath),
            extension: extname(fullpath),
            path: dirname(fullpath),
            creation_date: s.ctime,
            mod_date: s.mtime,
            directory: s.isDirectory()
        }
    }

    private async addItemToListing (path: string) : Promise<void> {
        try {
            let item: DirectoryItem = await this.parseDirectoryItem(path)
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
                ctx.add_item({ icon: 'list', text: 'Detalhes', click: () => { throw 'não implementado' } })

                ctx.popup({ x: e.clientX, y: e.clientY })
                e_item.classList.add('selected')
            })
    
            this.E_DirContents.appendChild(e_item)

            console.log(`Adicionado à lista: ${path}`)
        } catch(ex) {
            console.error(`Impossível adicionar ${path} à lista`, ex)
        }
    }
}

export default new FileManager()