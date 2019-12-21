import { remote } from 'electron'

const curr_window = remote.getCurrentWindow()

const E_CloseButton: HTMLButtonElement = document.querySelector('#titlebar-close')
const E_MinimizeButton: HTMLButtonElement = document.querySelector('#titlebar-minimize')


E_CloseButton.addEventListener('click', () => curr_window.close())
E_MinimizeButton.addEventListener('click', () => curr_window.minimize())