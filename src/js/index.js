// Processus de rendu

const electronVersion = document.querySelector("#electron-version")
const nodeVersion = document.querySelector("#node-version")
const chromiumVersion = document.querySelector("#chromium-version")

electronVersion.textContent = versions.electron
nodeVersion.textContent = versions.node
chromiumVersion.textContent = versions.chrome