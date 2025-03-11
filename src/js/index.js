// Processus de rendu

const electronVersion = document.querySelector("#electron-version")
const nodeVersion = document.querySelector("#node-version")
const chromiumVersion = document.querySelector("#chromium-version")

async function lesVersions() {
    const v = await versions.getVersions()


    electronVersion.textContent = v.electron
    nodeVersion.textContent = v.node
    chromiumVersion.textContent = v.chrome
}
lesVersions()