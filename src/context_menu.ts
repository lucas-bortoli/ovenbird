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

        let menu = this.element

        menu.style.left = `${where.x}px`
        menu.style.top = `${where.y}px`

        let bound_menu = menu.getBoundingClientRect()
        let bound_screen = document.body.getBoundingClientRect()

        if (bound_menu.right > bound_screen.right)
            menu.style.left = `${bound_screen.right - bound_menu.width}px`
        if (bound_menu.bottom > bound_screen.bottom)
            menu.style.top = `${bound_screen.bottom - bound_menu.height}px`
            
        if (bound_menu.left < bound_screen.left)
            menu.style.left = `0px`
        if (bound_menu.top < bound_screen.top)
            menu.style.top = `0px`

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