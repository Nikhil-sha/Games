const gameBrd = document.getElementById('gameBoard');
const choiceBrd = document.getElementById('choiceBoard');
const choiceInp = document.getElementById('choiceInput');
const choiceVal = document.getElementById('choiceValue');

let choiceBoardVisible = true;

function removeElementByOpacity(element, callback) {
	let opacity = 1;
	const remove = () => element.remove();
	const iterate = () => {
		element.style.opacity = opacity;
		opacity -= 0.1;
		
		if (opacity >= 0) {
			requestAnimationFrame(iterate);
		} else {
			remove();
			if (callback && typeof callback === 'function') {
				callback();
			}
		}
	}
	
	iterate();
}

function clearGameBoard(callback) {
	const content = gameBrd.children;
	
	if (!content) {
		return;
	}
	
	for (let element of content) {
		removeElementByOpacity(element, callback);
	}
}

function showFinalChoices(choices = [38, 29, 58, 04, 02]) {
	const choiceContainer = document.createElement('ol');
	choiceContainer.className = 'w-full list-style-none flex gap-2 items-center justify-center';
	
	choices.forEach((choice, i) => {
		const li = document.createElement('li');
		li.textContent = choice;
		
		li.className = 'size-8 flex items-center justify-center text-sm rounded-lg border border-gray-100';
		li.style.opacity = 0;
		li.style.animation = 'fadeInUp 0.8s ease-out forwards';
		li.style.animationDelay = i * 1000 + 'ms';
		
		choiceContainer.appendChild(li);
	});
	
	gameBrd.appendChild(choiceContainer);
	
	const timeout = (choices.length + 1) * 1000;
	console.log(timeout)
	setTimeout(() => {
		let answer = 0;
		choices.forEach(choice => {
			answer += choice;
		});
		const span = document.createElement('span');
		span.textContent = answer;
		
		span.className = 'size-8 flex items-center justify-center text-sm rounded-lg border border-gray-100';
		span.style.opacity = 0;
		span.style.animation = 'fadeInUp 0.5s ease-out forwards';
		// span.style.animationDelay = i * 1000 + 'ms';
		
		gameBrd.appendChild(span);
	}, timeout);
	
	setTimeout(() => {
		const winner = document.createElement('span');
		winner.textContent = 'Winner is Nikhil!';
		
		winner.className = 'px-3 py-2 text-sm rounded-lg border border-gray-100';
		winner.style.opacity = 0;
		winner.style.animation = 'fadeInUp 0.5s ease-out forwards';
		
		gameBrd.appendChild(winner);
	}, timeout + 1000)
}

function showFinalResult() {
	showFinalChoices();
}

function toggleChoiceBoard(setTo) {
	switch (setTo) {
		case 'show':
			choiceBrd.style.opacity = 1;
			choiceBrd.removeAttribute('inert');
			choiceBoardVisible = true;
			break;
			
		case 'hide':
			choiceBrd.style.opacity = 0.4;
			choiceBrd.setAttribute('inert', true);
			choiceBoardVisible = false;
			break;
			
		default:
			if (choiceBoardVisible) {
				toggleChoiceBoard('hide')
			} else {
				toggleChoiceBoard('show')
			}
	}
}

choiceInp.oninput = () => choiceVal.innerHTML = choiceInp.value;

toggleChoiceBoard('hide');