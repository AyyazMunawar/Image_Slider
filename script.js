const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const pills = document.querySelectorAll('.pill');
const cur = document.getElementById('cur');
const pauseButton = document.getElementById('pause');
const progressFill = document.getElementById('progressFill');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const storyModal = document.getElementById('storyModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalFact = document.getElementById('modalFact');
const modalCard = storyModal.querySelector('.modal-card');
const progressName = document.getElementById('progressName');
const activeHero = document.getElementById('activeHero');
const nav = document.getElementById('nav');
const statPower = document.getElementById('statPower');
const statStyle = document.getElementById('statStyle');
const statStatus = document.getElementById('statStatus');
const DURATION = 5000;


const heroes = [
	{
		name: 'Daredevil',
		habitat: "Hell's Kitchen, New York",
		power: 'Heightened senses',
		style: 'Acrobat / martial artist',
		status: 'Active guardian',
		fact: 'Matt Murdock uses heightened hearing, touch, smell, and spatial awareness to navigate the city.',
		story: "By day, Matt Murdock fights for justice in the courtroom. By night, Daredevil protects Hell's Kitchen from the shadows."
	},
	{
		name: 'Punisher',
		habitat: 'New York and global conflict zones',
		power: 'Elite conditioning',
		style: 'Tactical warfare',
		status: 'One-man war',
		fact: 'Frank Castle is a highly trained strategist who relies on planning, surveillance, and precision.',
		story: 'Frank Castle turns grief into a mission, dismantling criminal networks with military discipline and relentless focus.'
	},
	{
		name: 'Batman',
		habitat: 'Gotham City',
		power: 'Human potential',
		style: 'Detective / strategist',
		status: 'Gotham protector',
		fact: 'Bruce Wayne has no superpowers; his edge comes from detective work, training, technology, and preparation.',
		story: 'When Gotham goes dark, Batman becomes its signal of resistance, solving the impossible cases no one else can touch.'
	},
	{
		name: 'Thor',
		habitat: 'Asgard and the Nine Realms',
		power: 'Storm command',
		style: 'Asgardian warrior',
		status: 'Realm defender',
		fact: 'Thor is the Asgardian God of Thunder and wields lightning through his connection to the storm.',
		story: 'A warrior prince shaped by loss and responsibility, Thor carries the thunder of Asgard wherever the fight leads.'
	}
];

let idx = 0;
let timer;
let userPaused = false;
let hoverPaused = false;
let modalPaused = false;
let pointerStartX = 0;
let lastFocusedElement = null;
const modalClose = storyModal.querySelector('.modal-close');

storyModal.inert = true;

function updateControls() {
	const isPaused = userPaused || hoverPaused;
	const activeSlideStyles = getComputedStyle(slides[idx]);
	const accent = activeSlideStyles.getPropertyValue('--hero-accent').trim();
	const glow = activeSlideStyles.getPropertyValue('--hero-glow').trim();
	slider.style.setProperty('--hero-accent', accent);
	slider.style.setProperty('--hero-glow', glow);
	nav.style.setProperty('--hero-accent', accent);
	nav.style.setProperty('--hero-glow', glow);
	progressName.textContent = heroes[idx].name.toUpperCase();
	activeHero.textContent = heroes[idx].name.toUpperCase();
	document.title = `${heroes[idx].name} | Unmasked Archives`;
	pills.forEach((pill, index) => pill.setAttribute('aria-current', index === idx ? 'true' : 'false'));
	pauseButton.classList.toggle('is-paused', userPaused);
	pauseButton.setAttribute('aria-pressed', String(userPaused));
	pauseButton.setAttribute('aria-label', userPaused ? 'Resume slideshow' : 'Pause slideshow');
	pauseButton.querySelector('.pause-text').textContent = userPaused ? 'Play' : 'Pause';
}

function restartProgress() {
	progressFill.classList.remove('running');
	progressFill.classList.toggle('paused', userPaused || hoverPaused || modalPaused);
	void progressFill.offsetWidth;
	if (!userPaused && !hoverPaused && !modalPaused) progressFill.classList.add('running');
}

function goTo(nextIndex) {
	const direction = nextIndex >= idx ? 'next' : 'previous';
	const enterClass = direction === 'next' ? 'enter-right' : 'enter-left';
	const exitClass = direction === 'next' ? 'exit-left' : 'exit-right';
	slides.forEach(slide => slide.classList.remove('previous', 'enter-right', 'enter-left', 'exit-left', 'exit-right'));
	const previousSlide = slides[idx];
	previousSlide.classList.remove('active');
	previousSlide.classList.add('previous', exitClass);
	pills[idx].classList.remove('active');

	idx = (nextIndex + slides.length) % slides.length;
	const nextSlide = slides[idx];
	nextSlide.classList.remove('previous');
	nextSlide.classList.add(enterClass);
	void nextSlide.offsetWidth;
	nextSlide.classList.add('active');

	const image = nextSlide.querySelector('.slide-bg')?.dataset.image;
	if (image) new Image().src = image;

	const pill = pills[idx];
	pill.classList.remove('active');
	void pill.offsetWidth;
	pill.classList.add('active');
	cur.textContent = String(idx + 1).padStart(2, '0');
	updateControls();
	restartProgress();
}

function startAuto() {
	clearInterval(timer);
	if (userPaused || hoverPaused || modalPaused) return;
	timer = setInterval(() => goTo(idx + 1), DURATION);
}

function setHoverPaused(value) {
	hoverPaused = value;
	progressFill.classList.toggle('paused', hoverPaused || userPaused);
	startAuto();
	updateControls();
}

function openStory(action) {
	const hero = heroes[idx];
	lastFocusedElement = document.activeElement;
	const activeSlideStyles = getComputedStyle(slides[idx]);
	modalCard.style.setProperty('--hero-accent', activeSlideStyles.getPropertyValue('--hero-accent').trim());
	modalCard.style.setProperty('--hero-glow', activeSlideStyles.getPropertyValue('--hero-glow').trim());
	modalTitle.textContent = hero.name;
	modalBody.textContent = action === 'explore' ? hero.story : `${hero.story} Base of operations: ${hero.habitat}.`;
	statPower.textContent = hero.power;
	statStyle.textContent = hero.style;
	statStatus.textContent = hero.status;
	modalFact.textContent = `CASE FACT: ${hero.fact}`;
	storyModal.classList.add('open');
	storyModal.setAttribute('aria-hidden', 'false');
	storyModal.inert = false;
	modalPaused = true;
	startAuto();
	restartProgress();
	modalClose.focus();
}

function closeStory() {
	storyModal.classList.remove('open');
	storyModal.setAttribute('aria-hidden', 'true');
	storyModal.inert = true;
	modalPaused = false;
	startAuto();
	restartProgress();
	if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

document.getElementById('next').addEventListener('click', () => {
	goTo(idx + 1);
	startAuto();
});

document.getElementById('prev').addEventListener('click', () => {
	goTo(idx - 1);
	startAuto();
});

pills.forEach(pill => pill.addEventListener('click', () => {
	goTo(Number(pill.dataset.i));
	startAuto();
}));

pauseButton.addEventListener('click', () => {
	userPaused = !userPaused;
	startAuto();
	updateControls();
	restartProgress();
});

slider.addEventListener('mouseenter', () => setHoverPaused(true));
slider.addEventListener('mouseleave', () => setHoverPaused(false));

slider.addEventListener('pointerdown', event => {
	pointerStartX = event.clientX;
});

slider.addEventListener('pointerup', event => {
	const distance = event.clientX - pointerStartX;
	if (Math.abs(distance) < 50) return;
	goTo(distance < 0 ? idx + 1 : idx - 1);
	startAuto();
});

document.querySelectorAll('[data-action]').forEach(button => {
	button.addEventListener('click', () => openStory(button.dataset.action));
});

document.querySelectorAll('[data-close-modal]').forEach(element => {
	element.addEventListener('click', closeStory);
});

hamburger.addEventListener('click', () => {
	const isOpen = hamburger.classList.toggle('open');
	navMenu.classList.toggle('open', isOpen);
	hamburger.setAttribute('aria-expanded', String(isOpen));
	hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
	hamburger.classList.remove('open');
	navMenu.classList.remove('open');
	hamburger.setAttribute('aria-expanded', 'false');
	hamburger.setAttribute('aria-label', 'Open menu');
}));

document.querySelector('[data-open-story]').addEventListener('click', event => {
	event.preventDefault();
	openStory('story');
});

document.addEventListener('keydown', event => {
	if (storyModal.classList.contains('open')) {
		if (event.key === 'Escape') closeStory();
		if (event.key === 'Tab') {
			event.preventDefault();
			modalClose.focus();
		}
		return;
	}
	if (event.key === 'ArrowRight') {
		goTo(idx + 1);
		startAuto();
	}
	if (event.key === 'ArrowLeft') {
		goTo(idx - 1);
		startAuto();
	}
	if (event.key === ' ') {
		event.preventDefault();
		pauseButton.click();
	}
});

goTo(0);
startAuto();
