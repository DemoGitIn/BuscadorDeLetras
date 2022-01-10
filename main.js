const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const API_URL = 'https://api.lyrics.ovh';

const searchSongs = async (value) => {
  const res = await fetch(`${API_URL}/suggest/${value}`);
  const data = await res.json();
  
  showData(data);
};

const showData = ({ data, next, prev }) => {          
    result.innerHTML = `
    <ul class="songs">
    ${data
      .map(
        (song) =>
          `<li><span><img src=${song.artist.picture} style="width:30px;"> &nbsp;<strong>${song.artist.name}</strong> - ${song.title}</span>
          <button class="btn" data-artistpic="${song.artist.picture}" data-artist="${song.artist.name}" data-songtitle="${song.title}">Letra</button></li>`
      )
      .join('')}
    
    </ul>
    `;

  if (prev || next) {
    more.innerHTML = `
            ${
              prev
                ? `<div class="centered"><button class="prev-btn" onclick="getMoreSongs('${prev}')">Anterior</button></div>`
                : ''
            }
            ${
              next
                ? `<div class="centered"><button class="next-btn" onclick="getMoreSongs('${next}')">Siguiente</button></div>`
                : ''
            }
        
        `;
  } else {
    more.innerHTML = '';
  }
};

const getMoreSongs = async (url) => {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  showData(data);
};

const getLyrics = async (artist, songTitle,artistPic) => {
  const res = await fetch(`${API_URL}/v1/${artist}/${songTitle}`);
  const data = await res.json();
  console.log(data.picture)

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');   
 
  result.innerHTML = ` 
  <div class="centered">
  <img src=${artistPic} class="btnPic">
  </div>
    <h2><strong>${artist}</strong> - ${songTitle} </h2>
    <span>${lyrics}</span>
    	
 <!--  <button id="btnVolver" class="btn" >Volver</button> -->
    `;
  more.innerHTML = '';

  /* let btn = document.getElementById('btnVolver')
  btn.addEventListener('click', () => {
    const searchValue = artist;
    searchSongs(searchValue);
  }) */
};

//INIT
function init() {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = search.value.trim();
    if (!searchValue) {
      return;
    }
    searchSongs(searchValue);
  });

  result.addEventListener('click', (e) => {
    const element = e.target;
    if (element.nodeName === 'BUTTON') {
      const artist = element.dataset.artist;
      const songTitle = element.dataset.songtitle;
      const artistPicture = element.dataset.artistpic

      getLyrics(artist, songTitle, artistPicture);
    }
  });
}

init();