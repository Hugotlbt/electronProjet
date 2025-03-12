// Ce script sera executer avant le chargement de la page
// Accés aux API Node et Electron

const {contextBridge,ipcRenderer} = require('electron');


contextBridge.exposeInMainWorld('versions',{
    // Fonction qui récupere les versions via IPC (InterProcessusCommunication)
    getVersions : () => ipcRenderer.invoke('get-versions')
})

contextBridge.exposeInMainWorld('todosAPI',{
    // Fonction qui récupere la liste des taches via IPC
    getAll : () => ipcRenderer.invoke('todos:getAll')
})


console.log("preload chargé avec succes")