"use strict";

// ===== LOAD PAGE =====
const href = location.href;

const createSeasonsContainers = (seasonsInfo)=>{
	let serversObject = seasonsInfo.servers;
	let counter = 0;
	let seasonsHTMLArray = [];

	for(let langElement in serversObject){
		let serverElement = serversObject[langElement];

		for(let server in serverElement){
			let documentFragment = document.createDocumentFragment();
			let objectSeasonsContainer = serverElement[server];

			for(let seasonElement in objectSeasonsContainer){
				let linkSeason = objectSeasonsContainer[seasonElement];

				let seasonContainer = document.createElement("DIV");
				let seasonItem = document.createElement("H4");
				let flagsContainer = document.createElement("DIV");
				let serverOptionSelected = document.createElement("IMG");
				let flagOptionSelected = document.createElement("IMG");

				let seasonTextTittle = seasonElement.split('-');
				seasonTextTittle = seasonTextTittle.join(' ');

				flagOptionSelected.src = `../img/flag${langElement}.png`;
				serverOptionSelected.src = `../img/logo_${server}.png`;
				seasonItem.textContent = `${seasonTextTittle}`;
				seasonContainer.classList.add('main-cards');

				flagsContainer.appendChild(flagOptionSelected);
				flagsContainer.appendChild(serverOptionSelected);
				seasonItem.appendChild(flagsContainer);
				seasonContainer.appendChild(seasonItem);

				seasonContainer.addEventListener('click',()=>{window.open(linkSeason)});

				documentFragment.appendChild(seasonContainer);
			}

			const seasonsContainer = document.createElement("DIV");
			seasonsContainer.id = 'main';
			seasonsContainer.classList.add('.main-cards--seasons');
			seasonsContainer.appendChild(documentFragment);

			seasonsHTMLArray[counter] = [seasonsContainer,langElement,server];
			counter++;
		}
	}

	return seasonsHTMLArray;
}

const getSeasonsContainer = (langSelected,serverSelected,seasonsContainers)=>{

	for(let selectSeasons of seasonsContainers){
		if(selectSeasons[1] == langSelected && selectSeasons[2] == serverSelected){
			return selectSeasons[0];
			break;
		}
	}
}

const serversLinksHTML = (nameKey,leng,availServers,seasonsInfo)=>{

	let mainDocumentFragment = document.createDocumentFragment();

	// ========== PRESENTACION ==========
	const presentation = document.createElement('DIV');
	const caratula = document.createElement('DIV');
	const imgCaratula = document.createElement('IMG');
	const serverSelect = document.createElement('DIV');
	const serversSelectTittle = document.createElement('H4');
	const lengsSelect = document.createElement('DIV');

	let presentationDocumentFragment = document.createDocumentFragment();
	let serversAvailDocumentFragment = document.createDocumentFragment();
	let lengAvailDocumentFragment = document.createDocumentFragment();

	let firstServerSelected = false;
	let firstLangSelected = false;

	let selecteds = [];

	const changeSelect = (avail,optionHTML,option)=>{
		let newSelect = avail;
		let selected;
		let changeSeasonsContainer;

		if(option == 'server'){
			selected = selecteds[0];
			selecteds[1] = newSelect;
			changeSeasonsContainer = getSeasonsContainer(selected,newSelect,seasonsContainers);
		}
		else if(option == 'lenguege'){
			selected = selecteds[1];
			selecteds[0] = newSelect;
			changeSeasonsContainer = getSeasonsContainer(newSelect,selected,seasonsContainers);
		}

		const parentOptionHTML = optionHTML.parentElement;
		const childs = parentOptionHTML.children;
		for(let child of childs){
			child.classList.toggle(`${option}-selected`,false);
		}

		optionHTML.classList.toggle(`${option}-selected`,true);
		const mainContainer = document.querySelector('.main-cards--container');
		const mainSeasonsContainer = document.getElementById('main');

		mainContainer.removeChild(mainSeasonsContainer);
		mainContainer.appendChild(changeSeasonsContainer);
	};

	for(let avail of availServers){
		let serverAvail = document.createElement('IMG');
		let option = 'server';

		serverAvail.id = avail;
		serverAvail.src = `../img/logo_${avail}.png`;
		serverAvail.classList.add('server-logo');

		if(firstServerSelected == false){serverAvail.classList.add('server-selected')};
		firstServerSelected = true;

		serverAvail.addEventListener('click',()=>{changeSelect(avail,serverAvail,option)});

		serversAvailDocumentFragment.appendChild(serverAvail);
	}

	for(let avail of leng){
		let lengAvail = document.createElement('DIV');
		let flag = document.createElement('IMG');

		flag.src = `../img/flag${avail}.png`;
		lengAvail.id = avail;
		lengAvail.classList.add('btn-lenguege');

		if(firstLangSelected == false){lengAvail.classList.add('lenguege-selected')};
		firstLangSelected = true;

		lengAvail.addEventListener('click',()=>{changeSelect(avail,lengAvail,'lenguege')});

		lengAvail.appendChild(flag);
		lengAvailDocumentFragment.appendChild(lengAvail);
	}

	imgCaratula.src = `../img/miniatura_${nameKey}.jpg`;
	caratula.classList.add('caratula');
	serversSelectTittle.textContent = 'Servidor - Idioma';
	serverSelect.classList.add('select-server');
	lengsSelect.classList.add('flags-container');
	presentation.classList.add('main-presentation');

	caratula.appendChild(imgCaratula);
	serverSelect.appendChild(serversSelectTittle);
	serverSelect.appendChild(serversAvailDocumentFragment);
	lengsSelect.appendChild(lengAvailDocumentFragment);
	serverSelect.appendChild(lengsSelect);
	presentationDocumentFragment.appendChild(caratula);
	presentationDocumentFragment.appendChild(serverSelect);
	presentation.appendChild(presentationDocumentFragment);

	mainDocumentFragment.appendChild(presentation);

	// ========== SEASONS CARDS ==========

	let serversObject = seasonsInfo.servers;
	let serverSelected, langSelected;

	for(let langElement in serversObject){
		const objectInLang = serversObject[langElement];
		
		for(let serverElement in objectInLang){
			serverSelected = serverElement;
			break;
		}

		langSelected = langElement;
		break;
	}

	selecteds[0] = langSelected;
	selecteds[1] = serverSelected;

	const seasonsContainers = createSeasonsContainers(seasonsInfo);
	const seasonsContainerSelected = getSeasonsContainer(langSelected,serverSelected,seasonsContainers);

	mainDocumentFragment.appendChild(seasonsContainerSelected);

	return mainDocumentFragment;
}

const insertServersLinks = async (nameKey,leng,availServers)=>{
	const getSeasons = await fetch('../seriesinfo/serieslinks.txt');
	let seasonsInfo = await getSeasons.json();
	seasonsInfo = seasonsInfo.serieslinks;

	for(let seasonInfo of seasonsInfo){
		if(seasonInfo.nameKey == nameKey){
			let codeHTML = serversLinksHTML(nameKey,leng,availServers,seasonInfo);
			document.querySelector('.main-cards--container').appendChild(codeHTML);
			break;			
		};
	};
};

const loadPage = async ()=>{
	const getInfoSeries = await fetch('../seriesinfo/series.txt');
	let infoSeries = await getInfoSeries.json();
	infoSeries = infoSeries['series'];
	
	for(let serie of infoSeries){
		const infoSerie = serie['serie'];
		if(href.includes(infoSerie.nameKey)){
			const nameSerieHTMLContainer = document.getElementById('nameSerie');
			nameSerieHTMLContainer.textContent = infoSerie.name;

			insertServersLinks(infoSerie.nameKey,infoSerie.lengueges,infoSerie.availServers);
			break;
		};
	};
};

loadPage();

document.getElementById('header').innerHTML = `
		<div class="header-container">
			<div class="header__background background-white"></div>
			<div class="header__content">
				<div class="header__img">
					<img src="../img/img_perfil.png">
				</div>
				<div class="header__name-pag">
					<h1>SUPER SERIES J</h1>
				</div>
				<div class="header__servers">
					<h2>Servidores</h2>
					<img src="../img/logo_mediafire.png">
					<img src="../img/logo_mega.png">
				</div>
			</div>
		</div>
		<nav>
			<ul>
				<li>Inicio</li>
				<li>Series</li>
				<li>Peliculas</li>
				<li>Anime</li>
			</ul>
		</nav>
	`
document.querySelector('.intro').innerHTML = `
			<div class="intro__info">	
				<p>Aquí en <b>Super Series J</b> puedes encontrar y/o descubrir algunas o muchas de tus series favoritas y disfrutar de horas de contenido, tan solo con saltar un poco de publicidad. Los videos están disponibles en dos nubes (mega y mediafire). Si no sabes como acceder a los videos, has click en la siguiente tarjeta;</p>
			</div>
			<div class="skyads">
				<div class="skyads__menu">
					<div class="skyads__tittle">
						<h3>¿Cómo accedo a los videos?</h3>
						<i class="fa-solid fa-angle-right arrow__item"></i>
					</div>
					<div class="skyads__devices">
						<div id="cell" class="skyads__device">
							<div class="skyads__device-tittle">
								<h4>Desde celular</h4>
								<i class="fa-solid fa-angle-right subarrow__item"></i>
							</div>
							<div class="skyads__video">
								<video class="video" src="../video/prueba.mp4" controls></video>
							</div>
						</div>
						<div id="pc" class="skyads__device">
							<div class="skyads__device-tittle">
								<h4>Desde Pc</h4>
								<i class="fa-solid fa-angle-right subarrow__item"></i>
							</div>
							<div class="skyads__video">
								<video class="video" src="../video/prueba.mp4" controls></video>
							</div>
						</div>
					</div>
				</div>
			</div>
		`

// addEventListener('load',e=>{console.log(e)});


// ===== DESPLEGAR MENU SKYADS =====

let skyads = document.querySelector('.skyads__tittle');
let skyadsMenu = document.querySelector('.skyads__menu')
let devices = document.querySelector('.skyads__devices')
let device = document.querySelectorAll('.skyads__device');
let video = document.querySelectorAll('video');

let cell = document.getElementById('cell');
let pc = document.getElementById('pc');

let skyadsOpen = false;
let skyadsOptionOpen = false;

let defaultMenuHeight;
let defaultOptionHeight;

skyadsMenu.style.height = `${skyadsMenu.clientHeight}px`;

const openSkyadsMenu = ()=>{
	let newHeightMenu = skyads.scrollHeight + devices.scrollHeight;
	skyadsMenu.style.height = `${newHeightMenu}px`;
	devices.style.height = `${devices.scrollHeight}px`;
	defaultOptionHeight = devices.firstElementChild.scrollHeight;

	setTimeout(()=>{skyadsOpen = true},300);
}

const closeSkyadsMenu = ()=>{
	skyadsMenu.style.height = `${skyads.clientHeight}px`;
	devices.style.height = `0px`;

	cell.lastElementChild.style.height = '0px';
	pc.lastElementChild.style.height = '0px';
	
	setTimeout(()=>{
		cell.style.height = `${defaultOptionHeight}px`;
		pc.style.height = `${defaultOptionHeight}px`;
		skyadsOpen = false;
	},300)

	skyadsOptionOpen = false;
}

const openSkyadsOption = target=>{
	let tittleContainer = target.firstElementChild;
	let videoContainer = target.lastElementChild;

	let videoHeight = videoContainer.scrollHeight;
	let newHeightDevices = tittleContainer.scrollHeight + videoHeight;
	let newHeightMenu = tittleContainer.clientHeight + videoContainer.scrollHeight + skyads.clientHeight;

	skyadsMenu.style.height = `${newHeightMenu}px`;
	videoContainer.style.height = `${videoHeight}px`;

	devices.style.height = `${newHeightDevices}px`;

	if(target.nextElementSibling){
		let optionHide = target.nextElementSibling;
		optionHide.style.height = '0px';
	}
	else if(target.previousElementSibling){
		let optionHide = target.previousElementSibling;
		optionHide.style.height = '0px';
	};

	target.style.height = 'auto';
	setTimeout(()=>{skyadsOptionOpen = true},300);
};

const closeSkyadsOption = (target,menuHeight)=>{
	let videoContainer = target.lastElementChild;
	videoContainer.style.height = '0px';
	skyadsMenu.style.height = `${menuHeight}px`;

	let optionShow, optionHeight;

	if(target.nextElementSibling){
		optionShow = target.nextElementSibling;
		optionHeight = optionShow.scrollHeight;
		optionShow.style.height = `${optionHeight}px`;
	}
	else if(target.previousElementSibling){
		optionShow = target.previousElementSibling;
		optionHeight = optionShow.scrollHeight;
		optionShow.style.height = `${optionHeight}px`;
	};
	setTimeout(()=>{skyadsOptionOpen = false},400);
};

let skyadsContainer = document.querySelector('.skyads');

skyads.addEventListener('click',()=>{
	if(skyadsOpen == false){
		openSkyadsMenu();
		skyadsMenu.classList.add('arrow');
	}
	else if(skyadsOpen == true){
		closeSkyadsMenu();
		skyadsMenu.classList.remove('arrow');
	};
});

for(let dev of device){
	let target = dev;
	defaultMenuHeight = skyads.scrollHeight + devices.scrollHeight;

	dev.addEventListener('click',()=>{
		if(skyadsOptionOpen == false){
			openSkyadsOption(target);
			devices.classList.add('subarrow');
		}
		else if(skyadsOptionOpen == true){
			closeSkyadsOption(target,defaultMenuHeight);
			devices.classList.remove('subarrow');
		};
	});
};

video.forEach(vid=>{
	vid.addEventListener('click',e=>{
		e.stopPropagation();
	});
});

// // ===== OBTENER SERIE =====
// let getSerie = async ()=> {
// 	let series = [];
// 	let requestSerie = await fetch("../series.txt");
// 	let objectSeries = await requestSerie.json();
// 	let counter = 0;
// 	for(serie in objectSeries) {
// 		series[counter] = objectSeries[`${serie}`];
// 		series[counter] = series[counter].split(",");
// 		counter++;
// 	}
// 	return series;
// }

// let link;
// let linkMega = "linksmega";
// let linkMediafire = "linksmediafire";
// let btnMegaSelected;
// let btnMediafireSelected;
// let logo;

// let linkCastellano = "castellano";
// let linkLatino = "mediafire";
// let lenguegeSelected;

// let seasonsCardsContainer;

// let getSeasonsSerie = async (server)=> {
// 	console.log(`../${lenguegeSelected}/${server}/${link}.txt`);
// 	let getSeasons = await fetch(`../${lenguegeSelected}/${server}/${link}.txt`);
// 	let obtainedSeasons = await getSeasons.json();
// 	return obtainedSeasons;
// };

// let insertSeasons = (seasons)=>{
// 	let mainContainer = document.querySelector(".main-cards--container");
// 	let fragmento = document.createDocumentFragment();

// 	let counter = 0;
// 	let seasonNumber = [];
// 	let urlSeason = [];
// 	for (let season in seasons) {
// 		seasonNumber[counter] = season;
// 		urlSeason[counter] = seasons[season];
// 		let mainCard = document.createElement("DIV");
// 		mainCard.id = season;
// 		mainCard.classList.add("main-cards");
// 		newSeasonText = season.split("-");
// 		newSeasonText = newSeasonText.join(" ");
// 		mainCard.innerHTML = `
// 			<h4>
// 				${newSeasonText}
// 				<div>
// 					<img src="../img/flag${lenguegeSelected}.png">
// 					<img src="../img/${logo}.png">
// 				</div>
// 			</h4>
// 		`;
// 		fragmento.appendChild(mainCard);
// 		counter++;
// 	}

// 	if (seasonsCardsContainer.innerHTML == ""){
// 		seasonsCardsContainer.appendChild(fragmento);
// 		mainContainer.appendChild(seasonsCardsContainer);
// 	} else {
// 		seasonsCardsContainer.innerHTML = "";
// 		seasonsCardsContainer.appendChild(fragmento);
// 		mainContainer.appendChild(seasonsCardsContainer);
// 	}
	
// 	let mainCards = document.querySelectorAll(".main-cards");

// 	let urlCounter = 0;
// 	urlSeason.forEach(url => {
// 		let card = document.getElementById(`${seasonNumber[urlCounter]}`);
// 		card.addEventListener("click",()=>{
// 			window.open(url);
// 		});
// 		urlCounter++;
// 	});
// }

// let obtainedSeries = getSerie();
// obtainedSeries.then((arraySeries)=>{
// 	let getNameSerie = document.getElementById("nameSerie").textContent;

// 	for (serie in arraySeries) {
// 		if (getNameSerie == arraySeries[serie][0]) {
// 			link = arraySeries[serie][1];
// 			let mainContainer = document.querySelector(".main-cards--container");
// 			mainContainer.innerHTML = `
// 			<div class="main-presentation">
// 				<div class="caratula">
// 					<img src="../img/miniatura_${link}.jpg">
// 				</div>
// 				<div class="select-server">
// 					<h4>Servidor - Idioma</h4>
// 					<img id="mega" class="server-logo server-selected" src="../img/logo_mega.png">
// 					<img id="mediafire" class="server-logo" src="../img/logo_mediafire.png">
// 					<div class="flags-container"></div>
// 				</div>
// 			</div>
// 		`;
			
// 			lengueges = arraySeries[serie][2];
// 			lengueges = lengueges.split(" ");

// 			let lenguegesCodeHTML = ``;
// 			for (let lenguege in lengueges) {
// 				let leng = lengueges[lenguege];
// 				lenguegesCodeHTML+= `
// 						<div id="${leng}" class="btn-lenguege">
// 							<img src="../img/flag${leng}.png">
// 						</div>
// 					`;
// 			}

// 			let lenguegesContainerHTML = document.querySelector(".flags-container");
// 			lenguegesContainerHTML.innerHTML = lenguegesCodeHTML;
// 			let lenguegeSelectedHTML = lenguegesContainerHTML.firstElementChild;
// 			lenguegeSelectedHTML.classList.add("lenguege-selected");

// 			seasonsCardsContainer = document.createElement("DIV");
// 			seasonsCardsContainer.classList.add(".main-cards--seasons");
// 			mainContainer.appendChild(seasonsCardsContainer);

// 			lenguegeSelected = lenguegeSelectedHTML.id;
// 			server = linkMega;
// 			logo = "logo_mega";
// 			let seasons = getSeasonsSerie(server,lenguegeSelected);
// 			return seasons;
// 			break;
// 		}
// 	}
// }).then((seasons)=>{
// 	insertSeasons(seasons);
// }).then(()=>{
// 	let btnMediafire = document.getElementById("mediafire");
// 	let btnMega = document.getElementById("mega");
// 	let btnLenguege = document.querySelectorAll(".btn-lenguege");

// 			btnMega.addEventListener("click",()=>{
// 				logo = "logo_mega";
// 				server = linkMega;
// 				seasons = getSeasonsSerie(server,logo);
// 				seasons.then((seasons)=>{
// 					insertSeasons(seasons);
// 				});
// 				btnMega.classList.add("server-selected");
// 				if (btnMediafire.classList.contains("server-selected")) {
// 					btnMediafire.classList.remove("server-selected");
// 				}
// 			});

// 			btnMediafire.addEventListener("click",()=>{
// 				logo = "logo_mediafire";
// 				let server = linkMediafire;
// 				seasons = getSeasonsSerie(server,logo);
// 				seasons.then((seasons)=>{
// 					insertSeasons(seasons);
// 				});
				
// 				btnMediafire.classList.add("server-selected");
// 				if (btnMega.classList.contains("server-selected")) {
// 					btnMega.classList.remove("server-selected");
// 				}
// 			});

// 	let btnLenguegeHTML = [];
// 	for (let btn in btnLenguege) {
// 		if (typeof btnLenguege[btn] == "object") {
// 			btnLenguegeHTML[btn] = btnLenguege[btn];
// 		}
// 	}

// 	let changeLenguege = false;

// 	for (let btn in btnLenguegeHTML) {
// 		let btnHTML = btnLenguegeHTML[btn];
// 		btnHTML.addEventListener("click",()=>{
// 			lenguegeSelected = btnLenguegeHTML[btn].id;
// 			console.log(lenguegeSelected);
// 			for (let btn in btnLenguegeHTML) {
// 				btnLenguegeHTML[btn].classList.toggle("lenguege-selected",false);
// 			}

// 			if (btnHTML.classList.contains("lenguege-selected") == false){
// 				btnHTML.classList.add("lenguege-selected");
// 			}

// 			let btnMega = document.getElementById("mega");
// 			let btnMediafire = document.getElementById("mediafire");
// 			let server;

// 			if (btnMega.classList.contains("server-selected")) {
// 				server = linkMega;
// 			} else if (btnMediafire.classList.contains("server-selected")) {
// 				server = linkMediafire;
// 			}
// 			let seasons = getSeasonsSerie(server,lenguegeSelected);
// 			seasons.then((seasons)=>{
// 				insertSeasons(seasons);
// 			});
// 		});
// 	}
// })
// .catch((e)=>{
// 	let mainCardContainer = document.querySelector(".main-cards--container");
// 	mainCardContainer.innerHTML = "Ha ocurrido un error";
// })