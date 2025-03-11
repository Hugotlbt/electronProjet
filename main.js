// Processus principal

const {app, BrowserWindow,ipcMain, Menu} = require("electron")
const path = require('path');

let window;

// Créer la fenetre principal
function createWindow(){
    window = new BrowserWindow({
        width: 800,
        height : 600,
        webPreferences : {
            nodeIntegration : false, // Acces au API Node depuis notre processus de rendu
            contextIsolation : true,
            sandbox: true,
            preload : path.join(__dirname,'src/js/preload.js')
        }

    })
// Creation du menu
    createMenu()

    window.loadFile('src/pages/index.html')

}

// Fonction permettant de crée un menu personnalisé
function createMenu(){
    // Crée un tableau qui va representer le menu -> modele
    const template = [
        {
            label : 'App',
            submenu : [
                {
                    label : 'Versions',
                    click : () => window.loadFile('src/pages/index.html')
                },
                {
                  type: 'separator'
                },
                {
                    label : "Quitter",
                    accelerator : process.platform === 'darwin' ? 'Cmd+Q':'Ctrl+Q',
                    click : () => app.quit()
                }
            ]
        },
        {
            label : 'Taches',
            submenu: [
                {
                    label: "Lister",
                    click: () => window.loadFile('src/pages/list-taches.html')
                },
                {
                    label: "Ajouter",
                    click: window.loadFile('src/pages/ajout-taches.html')
                }
            ]

        }
    ]

    // Crée le menu a partir du modele
    const menu = Menu.buildFromTemplate(template)
    // Définir le menu comme etant le menu de l'application
    Menu.setApplicationMenu(menu)

}

// Attendre l'initialisation de l'application au démarrage
app.whenReady().then( () => {

        createWindow()

    app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0){
        createWindow()
        }
     })
}
)

app.on('window-all-closed',() => {
    if (process.platform !== 'darwin'){
        app.quit()
    }
})

// Ecouter sur le canal "get-versions"
ipcMain.handle('get-versions', ()=> {
    // Renvoyer un objet contenant les versions des outils
    return{
        electron: process.versions.electron,
        node: process.versions.node,
        chrome: process.versions.chrome
    }
})