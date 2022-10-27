let topArtista = document.querySelector('header h1');
let img = document.querySelector('.album img');
let audio = document.querySelector('#musica-principal');
let nmMusica = document.querySelector('.player .top .artist-info .nome-musica');
let nmArtista = document.querySelector('.player .top .artist-info .nome-banda');
let tmpAtual = document.querySelector('.area-progresso .tempo .tempo-atual');
let tmpMaximo = document.querySelector('.area-progresso .tempo .tempo-maximo');
let btnAleatorio = document.querySelector('.player .controles .fa-random');
let btnAnterior = document.querySelector('.player .controles .fa-step-backward');
let btnPlayPause = document.querySelector('.player .controles #play-pause');
let btnProximo = document.querySelector('.player .controles .fa-step-forward');
let btnPlaylist = document.querySelector('.player .controles .fa-angle-down');
let lista = document.querySelector('.playlist');
let btnFechar = document.querySelector('.playlist .topo .fa-angle-up');
let progresso = document.querySelector('.barra-progresso');
let areaProgresso = document.querySelector('.area-progresso');
let ulTag = lista.querySelector("ul");
let license = document.querySelector(".license");
let btnClose = license.querySelector(".top_info");
let i = license.querySelector(".top_info label i");

let musicIndex = 0;

btnClose.addEventListener("click", () => {
    license.classList.toggle("close");
    if(license.classList.contains("close")){
        i.classList.replace("fa-times","fa-angle-down");
    }else{
        i.classList.replace("fa-angle-down","fa-times");
    }
});

const alterarCor = (index) =>{
    document.body.style.setProperty("--main-color",`rgb(${musicas[index].corFundo})`);
    document.body.style.setProperty("--primary-color",`rgb(${musicas[index].corPrincipal})`);
    document.body.style.setProperty("--secundary-color",`rgb(${musicas[index].corSecundaria})`);
};

const loadMusic = (index) => {
    img.src = musicas[index].img;
    audio.src = musicas[index].src;
    nmArtista.innerText = musicas[index].artista;
    topArtista.innerText = musicas[index].artista;
    nmMusica.innerText = musicas[index].nome;
};

window.addEventListener("load", () => {
    alterarCor(musicIndex);
    loadMusic(musicIndex);
});

btnPlayPause.addEventListener("click", () => {
    audio.paused ? 
    tocar() : pausar();
});

btnProximo.addEventListener('click', () => proximo());

btnAnterior.addEventListener('click', () => {

    musicIndex != 0 ?
        musicIndex-- :
        musicIndex = musicas.length -1;

        alterarMusica(musicIndex);
});

btnPlaylist.addEventListener("click", () => {
    lista.classList.toggle("show");
});

btnFechar.addEventListener("click", () => {
    lista.classList.toggle("show");
})

btnAleatorio.addEventListener("click", () => {
    let indiceAleatorio = 0;
    do{
        indiceAleatorio = Math.floor(Math.random()*musicas.length);
    }while(indiceAleatorio == musicIndex);
    
    alterarMusica(indiceAleatorio);
});

const proximo = () =>{
    musicIndex < musicas.length - 1 ?
        musicIndex++ :
        musicIndex = 0;

        alterarMusica(musicIndex);
};

const tocar = () => {
    audio.play();
    btnPlayPause.classList.replace("fa-play-circle","fa-pause-circle");
};

const pausar = () => {
    audio.pause();
    btnPlayPause.classList.replace("fa-pause-circle","fa-play-circle");
};

const alterarMusica = (index) => {
    musicIndex = index;
    loadMusic(index);
    alterarCor(index);

    btnPlayPause.classList.contains("fa-pause-circle") ? 
        tocar() : progresso.style.width = 0;
};

audio.addEventListener("timeupdate",(e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progresso.style.width = `${progressWidth}%`;

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    
    if(currentSec < 10){
       currentSec = `0${currentSec}`;
    }
    
    tmpAtual.innerText = `${currentMin}:${currentSec}`;

    if(currentTime == duration){
       proximo();
    }
});

audio.addEventListener("loadeddata", () => {

    let mainAdDuration = audio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);

    if(totalSec < 10){
        totalSec = `0${totalSec}`;
    }

    tmpMaximo.innerText = `${totalMin}:${totalSec}`;

});

areaProgresso.addEventListener("click", (e) =>{
    let progressWidth = areaProgresso.clientWidth; // pega o tamnho do progresso
    let clickedOffSetX = e.offsetX;
    let songDuration = audio.duration;

    audio.currentTime = (clickedOffSetX / progressWidth) * songDuration;
    tocar();
});

const listar = () =>{
    for(let item in musicas){
        let liTag = `<li id="${item}">
        <div class="musica-info">
            <span>${musicas[item].artista}</span>
            <p>${musicas[item].nome}</p>
        </div>
    </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag);
    }

}
listar();

for(let index of ulTag.querySelectorAll("li")){
    index.addEventListener("click", () => {
       alterarMusica(index.id);
       tocar();
       btnFechar.click();
    });
}