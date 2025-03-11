// Processus principal

const {app, BrowserWindow} = require("electron")
const path = require('path');

// Créer la fenetre principal
function createWindow(){
    const window = new BrowserWindow({
        width: 800,
        height : 600,
        webPreferences : {
            nodeIntegration : false, // Acces au API Node depuis notre processus de rendu
            contextIsolation : true,
            preload : path.join(__dirname,'src/js/preload.js')
        }
    })

    window.loadFile('src/pages/index.html')

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