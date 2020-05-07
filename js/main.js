'use strict';
const buttonAuth = document.querySelector('.button-auth'),
	modalAuth = document.querySelector('.modal-auth'),
	closeAuth = document.querySelector('.close-auth'),
	logInForm = document.querySelector('#logInForm'),
	loginInput = document.querySelector('#login'),
	passInput = document.querySelector('#password'),
	alertLogin = document.querySelector('#alertLogin'),
	alertPass = document.querySelector('#alertPass'),
	userName = document.querySelector('.user-name'),
	buttonOut = document.querySelector('.button-out'),
	cardsRestaurants = document.querySelector('.cards-restaurants'),
	containerPromo = document.querySelector('.container-promo'),
	restaurants = document.querySelector('.restaurants'),
	menu = document.querySelector('.menu'),
	logo = document.querySelector('.logo'),
	cardsMenu = document.querySelector('.cards-menu'),
	cartButton = document.querySelector("#cart-button"),
	modal = document.querySelector(".modal"),
	close = document.querySelector(".close"),
	headerMenu = document.querySelector('#headerMenu');
	

let login = localStorage.getItem('Delivery');

const getData = async (url) => {
	const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Ошибка по адресу ${url}, 
			статус ошибки: ${response.status}.`)
		}
		return await response.json();
};

const toggleModalAuth = () => {
	modalAuth.classList.toggle('is-open');
};
const toggleModal = () => {
	modal.classList.toggle("is-open");
};

const authorized = () => {
	const logOut = () => {
		login = '';
		localStorage.removeItem('Delivery')
		buttonAuth.style.display = '';
		buttonOut.style.display = '';
		userName.style.display = '';
		loginInput.classList.remove('not-value');
		alertLogin.textContent = 'Логин';
		alertLogin.style.color = '';
		passInput.classList.remove('not-value');
		alertPass.textContent = 'Пароль';
		alertPass.style.color = '';
		buttonOut.removeEventListener('click', logOut);
		checkAuth();
	}
	console.log('Авторизован');
	userName.textContent = login;

	buttonAuth.style.display = "none";
	buttonOut.style.display = 'flex';
	userName.style.display = 'flex';

	buttonOut.addEventListener('click', logOut);
};

const notAuthorized = () => {
	console.log('Не авторизован');

	const logIn = (e) => {
		e.preventDefault();	
		if (!loginInput.value) {
			loginInput.classList.add('not-value');
			alertLogin.textContent = 'Введите логин';
			alertLogin.style.color = 'red';
		} if (!passInput.value) {
			passInput.classList.add('not-value');
			alertPass.textContent = 'Введите пароль';
			alertPass.style.color = 'red';
		} else {
			login = loginInput.value;
			localStorage.setItem('Delivery', login)
			toggleModalAuth();
			buttonAuth.removeEventListener('click', toggleModalAuth);
			closeAuth.removeEventListener('click', toggleModalAuth);
			logInForm.removeEventListener('submit', logIn);
			logInForm.reset();
			checkAuth();
		}
	};

	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	logInForm.addEventListener('submit', logIn);
};

const checkAuth = () => {
	if (login) {
		authorized();
	} else {
		notAuthorized();
	}
};

checkAuth();

const renderHeader = ({ kitchen, name, stars, price }) => {
	headerMenu.innerHTML = '';
	const header = `
		<h2 class="section-title restaurant-title">${name}</h2>
		<div class="card-info">
			<div class="rating">
				${stars}
			</div>
			<div class="price">От ${price} ₽</div>
			<div class="category">${kitchen}</div>
		</div>
	`;
	headerMenu.insertAdjacentHTML('beforeend', header);
};

const createCardRestaurants = ({ image, name, time_of_delivery: timeOfDelivery, kitchen, price, stars, products }) => {
	const card = `
	<a class="card card-restaurant" 
		data-products="${products}"
		data-name="${name}"
		data-kitchen="${kitchen}"
		data-stars="${stars}"
		data-price="${price}" >
		<img src="${image}" alt="${name}" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title">"${name}"</h3>
				<span class="card-tag tag">${timeOfDelivery} мин</span>
			</div>
			<!-- /.card-heading -->
			<div class="card-info">
				<div class="rating">
					${stars}
				</div>
				<div class="price">От ${price} ₽</div>
				<div class="category">${kitchen}</div>
			</div>
		</div>
	</a>
	`;

	cardsRestaurants.insertAdjacentHTML('beforeend', card);
};



const createCardGood = ({ description, id, image, name, price }) => {
	const card = document.createElement('div');
	card.className = 'card';
	card.insertAdjacentHTML('beforeend', `
			<img src="${image}" alt="${name}" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title card-title-reg">${name}</h3>
				</div>
				<div class="card-info">
					<div class="ingredients">
						${description}
					</div>
				</div>
				<div class="card-buttons">
					<button class="button button-primary button-add-cart">
						<span class="button-card-text">В корзину</span>
						<span class="button-cart-svg"></span>
					</button>
					<strong class="card-price-bold">${price} ₽</strong>
				</div>
			</div>
	`);

	cardsMenu.insertAdjacentElement('beforeend', card)
};

const openGoods = (event) => {
	if (login) {
		const target = event.target;
		const restaurant = target.closest('.card-restaurant');
		if (restaurant) {
			cardsMenu.textContent = '';
			containerPromo.classList.add('hide');
			restaurants.classList.add('hide');
			menu.classList.remove('hide');
			getData(`./db/${restaurant.dataset.products}`)
			.then((data) => {
				data.forEach(createCardGood)
			});
			renderHeader(restaurant.dataset);
		}
	} else {
		toggleModalAuth();
	}
};




logo.addEventListener('click', () => {
	containerPromo.classList.remove('hide')
	restaurants.classList.remove('hide')
	menu.classList.add('hide')
});

function init() {
	getData('./db/partners.json')
	.then((data) => {
		data.forEach(createCardRestaurants)
	});

	cartButton.addEventListener("click", toggleModal);
	close.addEventListener("click", toggleModal);
	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	cardsRestaurants.addEventListener('click', openGoods);
};

init();
