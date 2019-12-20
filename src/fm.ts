import { readdir, stat } from 'mz/fs'
import { join, dirname, extname, basename } from 'path'
import { CreateDirectoryItemElement } from './elements'
import DirectoryItem from './interfaces/directoryitem'

class FileManager {
    public path: string = 'C:/'

    private E_DirContents: HTMLDivElement = document.querySelector('.directory-contents')
    private E_PathElement: HTMLDivElement = document.querySelector('.path')

    public change_dir(newPath: string) : void {
        this.path = newPath
        this.updateListing()
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

            if (item.directory)
                e_item.addEventListener('dblclick', () =>
                    this.change_dir(e_item.getAttribute('x-path')))
    
            this.E_DirContents.appendChild(e_item)
            console.log(`Adicionado à lista: ${path}`)
        } catch(ex) {
            console.error(`Impossível adicionar ${path} à lista`, ex)
        }
    }
}

export default new FileManager()