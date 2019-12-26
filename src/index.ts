import './titlebar'
import FM from './fm'
import { homedir } from 'os'

FM.change_dir(homedir())
FM.updateFavoriteListing()
FM.updateDriveListing()

//@ts-ignore
window.fm = FM