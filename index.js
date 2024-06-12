console.log('200 баллов')

// BURGER MENU
document.addEventListener("DOMContentLoaded", function() {

const burger = document.getElementById('burger')
const header = document.querySelector('header')
const navRow = document.querySelector('.nav-row')
const navLinks = document.querySelectorAll('.nav-list__link')

burger.addEventListener('click', () => {
	header.classList.toggle('open')
})

navLinks.forEach(link => {
	link.addEventListener('click', () => {
		header.classList.remove('open')
	})
})

document.addEventListener('click', e => {
  if (!navRow.contains(e.target)) {
    header.classList.remove('open')
	}
})

// DROP MENU

const body = document.querySelector('body')

const profile = document.querySelector('.profile')
const dropMenu = document.querySelector('.drop-menu')
const dropLogin = document.querySelector('.drop-login')
const dropRegister = document.querySelector('.drop-reg')
const dropProfile = document.querySelector('.drop-menu__profile')
const btnLogin = document.querySelector('.btn-form.login-btn')
const btnRegister = document.querySelector('.btn-form.register-btn')

const modal = document.querySelector('.modal')
const modalLogin = document.querySelector('.modal__login')
const closeLogin = document.querySelector('.close__btn')

const modalRegister = document.querySelector('.modal-register__container')
const register = document.querySelector('.modal__register')
const closeRegister = document.querySelector('.close__btn-reg')

const modalProfile = document.querySelector('.modal__profile-container')
const profileBg = document.querySelector('.modal__profile')
const closeProfile = document.querySelector('.close__btn-modal-profile')
const copyCardNumber = document.querySelector('.copy__card-number')
const cardNumber = document.querySelector('.card-number')

const modalBuyBooks = document.querySelector('.buy-books__modal__box')
const buyBooks = document.querySelector('.buy-books__modal')
const closeBuyBooks = document.querySelector('.buy-books__modal__close-btn')


profile.addEventListener('click', e => {
  e.stopPropagation()
  if (header.classList.contains('open')) {
		header.classList.remove('open')
	}
	dropMenu.classList.toggle('none')
})

body.addEventListener('click', e => {
  if (!dropMenu.classList.contains('none') && !dropMenu.contains(e.target)) {
    dropMenu.classList.add('none');
  }
})  

let scrollPosition = 0 

const showElement = element => {
  element.classList.remove('none')
	dropMenu.classList.add('none')
  const scrollPosition = window.scrollY
	document.body.classList.add('modal-open')
	document.body.dataset.scroll = scrollPosition
	document.body.style.top = `-${scrollPosition}px`
}

const hideElement = element => {
	element.classList.add('none')
	document.body.classList.remove('modal-open')
	const scrollPosition = parseInt(document.body.dataset.scroll || 0, 10)
	delete document.body.dataset.scroll
	document.body.style.top = ''
	window.scrollTo(0, scrollPosition)
}

const hideElementEvent = (firtElement, endElemetn, event) => {
  if (!firtElement.contains(event.target)) {
		hideElement(endElemetn)
	}
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    !modal.classList.contains('none') 
    ? hideElement(modal)
	  : !modalRegister.classList.contains('none') 
    ? hideElement(modalRegister)
    : !dropMenu.classList.contains('none')
    ? hideElement(dropMenu)
    : !modalProfile.classList.contains('none')
    ? hideElement(modalProfile)
    : null 
  }
})


dropLogin.addEventListener('click', () => {
  showElement(modal)
})

btnLogin.addEventListener('click', () => {
  showElement(modal)
})
modal.addEventListener('click', e => {
  hideElementEvent(modalLogin, modal, e)
})
closeLogin.addEventListener('click', () => {
  hideElement(modal)
})

dropRegister.addEventListener('click', () => {
  showElement(modalRegister)
})
btnRegister.addEventListener('click', () => {
  showElement(modalRegister)
})
modalRegister.addEventListener('click', e => {
  hideElementEvent(register, modalRegister, e)
})
closeRegister.addEventListener('click', () => {
  hideElement(modalRegister)
})

// dropProfile.addEventListener('click', () => {
//   showElement(modalProfile)
// })

modalProfile.addEventListener('click', e => {
  hideElementEvent(profileBg, modalProfile, e)
})
copyCardNumber.addEventListener('click', () => {
  const cardNumberValue = cardNumber.textContent || cardNumber.innerText;
  const textarea = document.createElement('textarea');
  textarea.value = cardNumberValue;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
})
closeProfile.addEventListener('click', () => {
  hideElement(modalProfile)
})

// AUTH 

const registerButton = document.querySelector('.mod-btn__register');
const numberVisits = document.querySelector('.number.visits');
const numberVisitsEnd = document.querySelector('.number.visits.end');

let isAuth = false;
let user = {};
let activeUser = {};

registerButton.addEventListener('click', handleRegistration);

function handleRegistration() {
	const inputs = document.querySelectorAll('.modal-input__reg');
  removeErrorInput(inputs)
	const allInputsFilled = checkLengthInput(inputs)
	if (allInputsFilled) {
    const { firstName, lastName, email, password } = getUserData(inputs);
    if (!isValidEmail(email)) {
      removeError(inputs[2])
      createError(inputs[2], 'Invalid email address')
      return;
    }
		const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
		const existingUser = storedUsers.find(u => u.email === email);
		if (!existingUser) {
			const randomNum = generateRandomHexNumber(9);
			const newUser = createNewUser(firstName, lastName, email, password, randomNum);
			hideElement(modalRegister);
			updateLocalStorage(newUser);
			updateIcon(newUser);
			isAuth = true;
      location.reload()
		} else {
      createError(inputs[2], 'A user with this email already exists')
		}
	}
}

const removeError = input => {
  const parent = input.parentElement

  if (parent.classList.contains('error')) {
    parent.querySelector('.error-label').remove()
    parent.classList.remove('error')
    input.style.borderColor = ''
  }
}

const createError = (input, text) => {
  const parent = input.parentElement
  const errorLabel = document.createElement('label')
  errorLabel.classList.add('error-label')
  errorLabel.textContent = text
  parent.classList.add('error')
  parent.appendChild(errorLabel)
  input.style.borderColor = 'red'
}

const checkLengthInput = inputs => {
	let isValid = true


	const validateInputLength = (input, minLength, maxLength) => {
		const inputValue = input.value.replace(/[\s-]+/g, '')
		if (minLength && inputValue.length < minLength) {
			createError(input, `Min length: ${minLength}`)
			isValid = false
		}

		if (maxLength && inputValue.length > maxLength) {
			createError(input, `Max length: ${maxLength}`)
			isValid = false
		}
	}

	for (const input of inputs) {
		removeError(input)

		const minLength = parseInt(input.getAttribute('data-minLength'))
		const maxLength = parseInt(input.getAttribute('data-maxLength'))

		const inputValue = input.value
		if (!inputValue.trim()) {
			createError(input, 'Fill in this field')
			isValid = false
		} else {
      if (minLength || maxLength) {
				validateInputLength(input, minLength, maxLength)
			}
    }

	}

	return isValid
}

const removeErrorInput = (inputs) => {
  for (const input of inputs) {
    input.addEventListener('input', () => {
      removeError(input)
    })
  }
}

function validateInputs(inputs) {
	return Array.from(inputs).every(input => input.value.trim() !== '');
}

function getUserData(inputs) {
	const userData = {};
	Array.from(inputs).forEach(input => {
		userData[input.name] = input.value;
	});
	return userData;
}

function createNewUser(firstName, lastName, email, password, randomNum) {
	const newUser = {
		firstName,
		lastName,
		email,
		password,
		buyBooks: 0,
		libraryCard: {},
		cardInfo: '',
		rentedBooks: [],
		cardNumber: randomNum,
		visits: 1
	};
	activeUser = { ...newUser };
	return newUser;
}

function updateLocalStorage(newUser) {
	const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
	storedUsers.push(newUser);
	localStorage.setItem('users', JSON.stringify(storedUsers));
	localStorage.setItem('activeUser', JSON.stringify(activeUser));
	numberVisits.textContent = 1;
}


function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

document.querySelector('.btn-login').addEventListener('click', () => {
  hideElement(modalRegister)
  showElement(modal)
})

function updateIcon(user) {
	const firstIcon = user.firstName[0].toUpperCase()
	const lastIcon = user.lastName[0].toUpperCase()
	const icon = firstIcon + lastIcon
	const iconProfile = document.querySelector('.profile-is-auth')
  const profileAva = document.querySelector('.profile-ava')
  const porfileName = document.querySelector('.profile-name')
	const prof = document.querySelector('.icon_profile')
  dropLogin.addEventListener('click', () => {
    hideElement(modal)
    showElement(modalProfile)
  })

  dropRegister.addEventListener('click', () => {
		hideElement(modalRegister)
		logout()
		location.reload()
	})
  dropLogin.textContent = 'My profile'

  dropRegister.textContent = 'Log Out'
  
	const fullName = `${user.firstName} ${user.lastName}`
	iconProfile.classList.add('active-profile')
	iconProfile.textContent = icon
	profileAva.textContent = icon
	iconProfile.title = fullName
	porfileName.textContent = fullName
	prof.classList.add('none')
}

function clearIcon() {
	const iconProfile = document.querySelector('.profile-is-auth')
	const prof = document.querySelector('.icon_profile')
	iconProfile.classList.remove('active-profile')
	iconProfile.textContent = ''
	iconProfile.title = ''
	prof.classList.remove('none')
}

function logout() {
const storedUserData = localStorage.getItem('activeUser')
const userObject = JSON.parse(storedUserData)
  isAuth = false 
	clearIcon() 
	dropLogin.textContent = 'Login' 
	dropRegister.textContent = 'Register'
  localStorage.removeItem('registerUser')
  localStorage.removeItem('activeUser')
  updateUser(userObject)
}

const changeCardNumber = (user) => {
  cardNumber.textContent = dropProfile.textContent = user.cardNumber
	dropProfile.style.fontSize = '12px'
}

const loginButton = document.querySelector('.mod-btn__login')

loginButton.addEventListener('click', () => {
  const inputs = document.querySelectorAll('.modal-input')
  removeErrorInput(inputs)
	let allInputsFilled = checkLengthInput(inputs)
	inputs.forEach(input => {
		user[input.name] = input.value
	})

	if (allInputsFilled) {
    if (!isValidEmail(user.email)) {
			removeError(inputs[0])
			createError(inputs[0], 'Invalid email address')
			return
		}
    const storedUsers = JSON.parse(localStorage.getItem('users')) || []
    const loggedInUser = storedUsers.find(u => u.email === user.email)
    if (loggedInUser) {
      if (loggedInUser.password === user.password) {
        updateIcon(loggedInUser)
        hideElement(modal)
        localStorage.setItem('activeUser', JSON.stringify(loggedInUser))
        location.reload()
        updateVisits()
        isAuth = true
      } else {
        removeError(inputs[1])
        createError(inputs[1], 'Invalid password')
      }
    } else {
      removeError(inputs[0])
      createError(inputs[0], 'Your email address could not be found')
    }
  } 
})

if (localStorage.getItem('activeUser')) {
	isAuth = true
	user = JSON.parse(localStorage.getItem('activeUser'))
	updateIcon(user)
} 

document.querySelector('.btn-register').addEventListener('click', () => {
	hideElement(modal)
	showElement(modalRegister)
})


function getVisits() {
  const storedUserData = localStorage.getItem('activeUser')
  const userObject = JSON.parse(storedUserData)
  const currentVisits = userObject.visits
	numberVisitsEnd.textContent = currentVisits
	return currentVisits
}

const updateUser = (user) => {
  const storedUsers = JSON.parse(localStorage.getItem('users')) || []
	const indexToUpdate = storedUsers.findIndex(u => u.email === user.email)
	if (indexToUpdate !== -1) {
		storedUsers[indexToUpdate] = user
		const updatedData = JSON.stringify(storedUsers)
		localStorage.setItem('users', updatedData)
	} else {
		console.log('Користувач не знайдений')
	}
}

function updateVisits() {
  const storedUserData = localStorage.getItem('activeUser')
	const userObject = JSON.parse(storedUserData)
	const currentVisits = userObject.visits
  const newVisits = currentVisits + 1
  userObject.visits = newVisits
  const updatedUserData = JSON.stringify(userObject)
  localStorage.setItem('activeUser', updatedUserData)
  numberVisits.textContent = newVisits
  updateUser(userObject)
}

const buyBookCount = document.querySelector('.buy-book__count')
const buyBookCountEnd = document.querySelector('.number.buy-book__count.end')
const findLibraryNoAuth = document.querySelector('.no-auth')
const findLibraryAuth = document.querySelector('.auth')
const inputPlaceholderName = document.querySelector('.library-input.end.name')
const inputPlaceholderCardNumber = document.querySelector('.library-input.end.cod')

const activeUserDate = JSON.parse(localStorage.getItem('activeUser'))


function generateRandomHexNumber(length) {
	const characters = '0123456789ABCDEF'
	let result = ''
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length)
		result += characters[randomIndex]
	}
	return result
}

const inputs = document.querySelectorAll('.buy-books__input')
const btnBuy = document.querySelector('.btn-buy-books')
const buttons = document.querySelectorAll('.btn')

const checkInputs = () => {
	return [...inputs].every(input => input.value.trim() !== '')
}

const updateButtonState = (button, active) => {
	button.classList.toggle('btn--active', active)
	button.textContent = active ? 'Own' : 'Buy'
  button.disabled = active
}

const buyBook = () => {
  const storedUserData = localStorage.getItem('activeUser')
	const userObject = JSON.parse(storedUserData)
  let libraryCardData = userObject.libraryCard
  const keys = Object.keys(libraryCardData)
  const buyBooks = keys.length
  return buyBooks
}

if (isAuth) {
  const number = activeUserDate.cardNumber
  const buyBookNumber = buyBook()
  findLibraryAuth.classList.remove('none')
  findLibraryNoAuth.classList.add('none')
  inputPlaceholderName.placeholder = user.firstName + ' ' + user.lastName
  inputPlaceholderCardNumber.placeholder = number
  buyBookCount.textContent = buyBookNumber
  buyBookCountEnd.textContent = buyBookNumber
  dropProfile.style.fontSize = '12px'
  dropProfile.textContent = number
  cardNumber.textContent = number
  numberVisits.textContent = getVisits()
  dropRegister.addEventListener('click', () => {
    hideElement(modalRegister)
    logout()
    location.reload()
  })
} else {
  findLibraryAuth.classList.add('none')
  findLibraryNoAuth.classList.remove('none')
  cardNumber.textContent = 'F00234030'
  numberVisits.textContent = 0
  buyBookCount.textContent = 0
}

buttons.forEach((button, index) => {
	button.addEventListener('click', () => {
		const container = button.closest('.books-containder')
		const bookTitle = container.querySelector('.text-title').textContent.trim()
		const bookAuthorCon = container.querySelector('.text-title_autor').textContent.trim()
		const bookAuthor = bookAuthorCon.replace('By', '')
		const cleanBookTitle = bookTitle.replace(/\n/g, '').trim()

		if (!isAuth) {
			showElement(modal)
			return
		}
		const storedUserData = localStorage.getItem('activeUser')
		const userObject = JSON.parse(storedUserData)
		const { cardInfo, libraryCard, rentedBooks } = userObject
		if (!cardInfo) {
			showElement(modalBuyBooks)
      removeErrorInput(inputs)
			btnBuy.addEventListener('click', () => {
        const checkLength = checkLengthInput(inputs)
        if (checkLength) {
					updateButtonState(button, true)

					const inputValue = {}
					inputs.forEach(input => {
						inputValue[input.name] = input.value
					})

					hideElement(modalBuyBooks)
					userObject.cardInfo = inputValue
					libraryCard[index] = true

					rentedBooks.push({ title: cleanBookTitle, author: bookAuthor })

					const updatedUserData = JSON.stringify(userObject)
					localStorage.setItem('activeUser', updatedUserData)

					updateRentedBooksList()
					buyBookCount.textContent = buyBookCountEnd.textContent = buyBook()
				}
			})
		} else {
			libraryCard[index] = true

			updateButtonState(button, true)
			const bookCount = buyBook()
			buyBookCount.textContent = buyBookCountEnd.textContent = bookCount + 1

			rentedBooks.push({ title: cleanBookTitle, author: bookAuthor })

			const updatedUserData = JSON.stringify(userObject)
			localStorage.setItem('activeUser', updatedUserData)

			updateRentedBooksList()
		}
	})
})

const rentedBooksContainer = document.querySelector('.rented-books__list')

const updateRentedBooksList = () => {
  rentedBooksContainer.innerHTML = ''
  const storedUserData = localStorage.getItem('activeUser') || []
  if (storedUserData.length > 0) {
    const userObject = JSON.parse(storedUserData)
    const rentedBooks = userObject.rentedBooks
    rentedBooks.forEach(book => {
      const listItem = document.createElement('li')
      listItem.textContent = `${book.title}, ${book.author}`
      rentedBooksContainer.appendChild(listItem)
    })
  }
}

updateRentedBooksList()

if (localStorage.getItem('activeUser')) {
	const storedUserData = localStorage.getItem('activeUser')
	const userObject = JSON.parse(storedUserData)
	const savedLibraryCard = userObject.libraryCard
	updateIcon(userObject)
	buttons.forEach((button, index) => {
		if (savedLibraryCard[index] === true) {
			updateButtonState(button, true)
		}
	})
}

closeBuyBooks.addEventListener('click', () => {
  hideElement(modalBuyBooks)
})
modalBuyBooks.addEventListener('click', e => {
	hideElementEvent(buyBooks, modalBuyBooks, e)
})

const profileEnd = document.querySelector('.profile-btn')

profileEnd.addEventListener('click', () => {
  showElement(modalProfile)
})

//FAVORITES

const booksSeoson = {
	winter: document.querySelector('.winter'),
	spring: document.querySelector('.spring'),
	summer: document.querySelector('.summer'),
	autumn: document.querySelector('.autumn'),
}

const form = document.querySelector('.favorites__form')

form.addEventListener('change', (e) => {
  const formValue = e.target.value
  for (const season in booksSeoson) {
    const book = booksSeoson[season]
    if (season === formValue) {
      book.classList.remove('none') 
      book.classList.add('fade') 
    } else {
      book.classList.add('none') 
    }
  }
})

const favoritesForm = document.querySelector('.favorites__form')
const favoritesSection = document.getElementById('favorites')
let isSticky = false

window.addEventListener('scroll', () => {
	const { scrollY } = window
	const { offsetTop } = favoritesSection
	const shouldBeSticky = scrollY >= offsetTop && scrollY <= 4052

	if (isSticky !== shouldBeSticky) {
		isSticky = shouldBeSticky
		favoritesForm.classList.toggle('sticky', isSticky)
    favoritesForm.classList.toggle('fade')
	}
})
})

// SLIDER

let slideIndex = 1
showSlide(slideIndex)

const btn__next = document.querySelector('.btn-swiper__next')
const btn__prev = document.querySelector('.btn-swiper__prev')

btn__next.addEventListener('click', () => {
  (slideIndex === 1) ? changeSlide(0): changeSlide(-1)
})

btn__prev.addEventListener('click', () => {
  (slideIndex >= 5) ? changeSlide(0): changeSlide(1)
})

function changeSlide(n) {
  showSlide((slideIndex += n))
}

function showSlide(n) {
  const screenWidth = window.innerWidth
  const slides =
    screenWidth > 1024
    ? document.querySelectorAll('.slider')
    : document.querySelectorAll('.slider-img')
  const dots = document.querySelectorAll('.dot')
  if (n > slides.length) slideIndex = 1
  if (n < 1) slideIndex = slides.length
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.add('none') 
    slides[i].classList.remove('fade') 
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active')
  }
  slides[slideIndex - 1].classList.remove('none')
  slides[slideIndex - 1].classList.add('fade')
  dots[slideIndex - 1].classList.add('active')
}

function currentSlide(n) {
  showSlide((slideIndex = n))
}