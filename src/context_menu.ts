class ContextMenu {
    private element: HTMLDivElement = document.createElement('div')
    private overlay: HTMLDivElement = document.createElement('div')

    constructor() {
        /**
         * <div class="context-menu">
         *     <div class="menu-item">...</div>
         *     <div class="menu-item">...</div>
         * </div>
         */

        this.overlay.classList.add('context-menu-overlay')
        this.element.classList.add('context-menu')

        this.overlay.appendChild(this.element)
    }

    public add_item(settings: { icon?: string, text: string, click(): void }) : void {
        /**
         * <div class="menu-item">
         *     <span class="icon material-icons">save</span>
         *     <span class="text">Salvar</span>
         * </div>
         */

        let e_wrapper = document.createElement('div')
            e_wrapper.classList.add('menu-item')
        let e_icon = document.createElement('span')
            e_icon.classList.add('icon', 'material-icons')
            e_icon.innerText = settings.icon
            if (settings.icon) e_wrapper.appendChild(e_icon)
        let e_text = document.createElement('span')
            e_text.classList.add('text')
            e_text.innerText = settings.text
            e_wrapper.appendChild(e_text)

        e_wrapper.addEventListener('click', () => { settings.click();  })

        this.element.appendChild(e_wrapper)
    }

    public add_separator() : void {
        /**
         * <div class="menu-separator"></div>
         */

        let e_sep = document.createElement('div')
            e_sep.classList.add('menu-separator')

        this.element.appendChild(e_sep)
    }

    public popup(where: { x: number, y: number }) : void {
        document.body.appendChild(this.overlay)

        this.element.style.left = `${where.x}px`
        this.element.style.top = `${where.y}px`

        let listener = (e: MouseEvent) => {
            e.stopPropagation()
            this.overlay.removeEventListener('click', listener)
            this.overlay.removeEventListener('contextmenu', listener)
            this.close()
        }

        this.overlay.addEventListener('click', listener)
        this.overlay.addEventListener('contextmenu', listener)
    }

    public close() : void {
        document.body.removeChild(this.overlay)
        this.overlay = null
    }
}

export default ContextMenu