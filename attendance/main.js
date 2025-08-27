const notificationChild = document.getElementById('notification-container').children;
const successNotification = document.getElementById('success');
const processingNotification = document.getElementById('processing');
const errorNotification = document.getElementById('error');
const registrationForm = document.getElementById('registration-form');
const presentList = document.getElementById('present-list');
const absentList = document.getElementById('absent-list');

const url = 'https://json.extendsclass.com/bin/';
const key = '4a0afbfff4b5';

let cache = null;

function randomNumber() {
	const num = Math.floor(Math.random() * 1e5);
	return num;
}

const notification = {
	processing() {
		this.hideAll();
		processingNotification.lastElementChild.textContent = 'Processing your request...';
		processingNotification.classList.remove('hidden');
	},
	success(text) {
		this.hideAll();
		successNotification.lastElementChild.textContent = text;
		successNotification.classList.remove('hidden');
		
		setTimeout(() => successNotification.classList.add('hidden'), 4000);
	},
	error(text) {
		this.hideAll();
		errorNotification.lastElementChild.textContent = text;
		errorNotification.classList.remove('hidden');
		
		setTimeout(() => errorNotification.classList.add('hidden'), 4000);
	},
	hideAll() {
		for (let child of notificationChild) {
			if (!child.classList.contains('hidden')) {
				child.classList.add('hidden');
			}
		};
	}
}

const list = {
	map(array) {
		this.clear();
		
		array.forEach((person) => {
			const listItem = document.createElement('li');
			listItem.className = 'text-sm';
			listItem.textContent = person.name;
			
			const icon = document.createElement('i')
			icon.className = person.status === 'present' ? 'fas fa-circle-check text-green-500 mr-2' : 'fas fa-circle-xmark text-red-500 mr-2';
			listItem.prepend(icon);
			
			if (person.status === 'present') {
				presentList.appendChild(listItem);
			} else {
				absentList.appendChild(listItem);
			}
		});
	},
	clear() {
		presentList.innerHTML = '';
		absentList.innerHTML = '';
	}
}

async function getData() {
	try {
		notification.processing();
		
		const response = await fetch(`${url}${key}?serial=${randomNumber()}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
		}
		
		const data = await response.json();
		cache = data;
		list.map(data);
		
		notification.success('Register loaded!');
	} catch (error) {
		notification.error('Error loading data.');
		console.error('Error fetching data:', error);
	}
}

async function updateData(updatedFields) {
	try {
		notification.processing();
		
		const response = await fetch(`${url}${key}?serial=${randomNumber()}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json-patch+json',
			},
			body: JSON.stringify(updatedFields)
		});
		
		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}
		
		const data = await response.json();
		cache = data;
		
		list.map(JSON.parse(data.data));
		
		notification.success('Attendance registered successfully!');
	} catch (error) {
		console.error('Error updating data:', error);
		notification.error('Attendance registration failed.');
	}
}

function register(e) {
	e.preventDefault();
	
	if (!this.id.value || !cache) {
		notification.error('Something went wrong! Please refresh the page.')
		return;
	}
	
	if (this.id.value > (cache.length - 1)) {
		notification.error('No person found with corresponding id.')
		return;
	}
	
	localStorage.setItem('ga-id', this.id.value);
	
	const patchOps = [
		{ op: "replace", path: `/${this.id.value}/status`, value: this.status.value.toLowerCase() }
	];
	
	updateData(patchOps);
	
	this.reset();
	isIdNeeded();
}

function isIdNeeded() {
	const id = localStorage.getItem('ga-id');
	if (id) {
		registrationForm.id.value = parseInt(id);
		registrationForm.id.disabled = true;
	}
}

getData();
isIdNeeded();

registrationForm.addEventListener('submit', register);