const listeTaches = document.querySelector('#ListeTaches');


async function getListeTaches() {
    const taches = await todosAPI.getAll();
    listeTaches.innerHTML =
        taches.map( (tache) => `<div class="list-group mt-1">
<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
    <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">${tache.titre.toLocaleUpperCase()}</h5>
            </div>
        <p class="mb-1 ">${tache.termine === 1 ? 'Cette tache est terminé' : 'Cette tache nest pas terminé'}</p>
        <small>${tache.createdAt.toLocaleDateString()} à ${tache.createdAt.toLocaleTimeString()}</small>
         </a>
    </div>`).join('  ');
}
getListeTaches()

