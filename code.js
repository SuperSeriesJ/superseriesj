"use strict";

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

// ===== INSERTAR SERIES =====

const cardSerieHTML = (name,keyname,leng)=>{
	const container = document.createElement('DIV');
	const imgContainer = document.createElement('DIV');
	const img = document.createElement('IMG');
	const h4 = document.createElement('H4');

	container.classList.add('main-cards');
	imgContainer.classList.add('main-cards--img');
	img.src = `img/miniatura_${keyname}.jpg`
	h4.textContent = name;


	imgContainer.appendChild(img)
	container.appendChild(imgContainer);
	container.appendChild(h4);

	container.addEventListener('click',e=>{
		window.open(`pag/${keyname}.html`)
	});

	return container;
};

const insertSeries = async ()=>{
	const getSeriesInfo = await fetch('seriesinfo/series.txt');
	let seriesInfo = await getSeriesInfo.json();
	seriesInfo = seriesInfo['series'];

	const documentFragment = document.createDocumentFragment();

	for(let serie of seriesInfo){
		const serieInfo = serie['serie'];

		const serieName = serieInfo['name'];
		const serieKeyName = serieInfo['nameKey'];
		const serieLengueges = serieInfo['lengueges'];

		const serieContainerHTML = cardSerieHTML(serieName,serieKeyName,serieLengueges);
		documentFragment.appendChild(serieContainerHTML);
	}
	
	document.querySelector('.main-cards--container').appendChild(documentFragment);
}

insertSeries();