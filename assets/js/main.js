const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="showPokemonDetail(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function showPokemonDetail(id) {
    pokeApi.getPokemon(id).then(pokemon => {
        const types = pokemon.types.map(type => `<span class="type ${type}">${type}</span>`).join('');
        const abilities = pokemon.abilities ? pokemon.abilities.join(', ') : '';

        const html = `
            <div class="pokemon-detail ${pokemon.type}">
                <h2 class="detail-title">${pokemon.name}</h2>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
                <div class="types">${types}</div>
                <p class="detail-abilities"><strong>Abilities:</strong> ${abilities}</p>
                <button onclick="closeDetail()">Close</button>
            </div>
        `;

        const detailContainer = document.createElement('div');
        detailContainer.classList.add('detail-overlay');
        detailContainer.innerHTML = html;
        document.body.appendChild(detailContainer);
    });
}

function closeDetail() {
    const detail = document.querySelector('.detail-overlay')
    if (detail) {
        detail.remove()
    }
}
