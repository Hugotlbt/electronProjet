// Ce script sera executer avant le chargement de la page
// Accés aux API Node et Electron

const {contextBridge,ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('versions',{
    // Fonction qui récupere les versions via IPC (InterProcessusCommunication)
    getVersions : () => ipcRenderer.invoke('get-versions')
})

console.log("preload chargé avec succes")