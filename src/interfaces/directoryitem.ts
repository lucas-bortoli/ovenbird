interface DirectoryItem {
    name: string,
    extension: string,
    path: string,
    creation_date: Date,
    mod_date: Date,
    directory: boolean
}

export default DirectoryItem