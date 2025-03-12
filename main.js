// Processus principal

const {app, BrowserWindow,ipcMain, Menu, dialog} = require("electron")
const path = require('path');
const mysql = require('mysql2/promise')

// Fenetre principale
let window;

// Configuration de l'acces a la BDD
const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'db_todos',
    connectionLimit : 10, // Le nombre maximal de connexion simultanée dans le pool
    waitForConnections : true,
    queueLimit : 0
}

// Créer le pool de connexion
const pool = mysql.createPool(dbConfig)

// Tester la connexion
async function testConnexion(){
    try {
        // Demander une connexion au pool
        const connexion = await pool.getConnection()
        console.log('Connexion avec la base de données etablie')
        connexion.release() // Rend la connexion disponible dans le pool
    } catch (error) {
        console.error('Erreur de connexion à la base de données')
    }
}

testConnexion()
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
    window.webContents.openDevTools()
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
                    click: () => window.loadFile('src/pages/ajout-taches.html')
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
})

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

async function getAllTodos() {
    try {
        const resultat = await pool.query('SELECT * FROM todos ORDER BY createdAt DESC')
        return resultat[0] // Retourne une promesse avec le resultat
    } catch (error) {
        console.error('Erreur lors de la récuperation des taches')
        throw error; // Retourne une promesse non résolue
    }
}

// Ecouter sur le canal "todos-getAll"
ipcMain.handle('todos:getAll',async () => {
    // Récuperer la liste des taches dans la BDD avec mySQL
    try {
       return await getAllTodos() // Retourne une promesse
    } catch (error) {
        dialog.showErrorBox('Erreur technique','Impossible de récuperer la liste des taches')
        return []; // Retourne une promesse avec un tableau vide
    }
})
