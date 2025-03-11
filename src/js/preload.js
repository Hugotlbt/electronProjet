// Ce script sera executer avant le chargement de la page
// Accés aux API Node et Electron

const {contextBridge} = require('electron');

contextBridge.exposeInMainWorld('versions',{
    electron : process.versions.electron,
    node: process.versions.node,
    chrome: process.versions.chrome
})

console.log("preload chargé avec succes")