let audioContext = null;

// Initialize audio context on first user interaction
function initAudio() {
	if (!audioContext) {
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
	}
	return audioContext;
}

// Handle URL generation
const generateBtn = document.getElementById('generateBtn');
const originalUrlInput = document.getElementById('originalUrl');
const redirectUrlInput = document.getElementById('redirectUrl');
const resultContainer = document.getElementById('resultContainer');
const copyBtn = document.getElementById('copyBtn');
const redirectSection = document.getElementById('redirect');
const generatorSection = document.getElementById('generator');
const pixelContainer = document.getElementById('pixelContainer');

// Create floating pixels effect
function createPixels() {
	for (let i = 0; i < 50; i++) {
		const pixel = document.createElement('div');
		pixel.className = 'pixel';
		pixel.style.left = `${Math.random() * 100}%`;
		pixel.style.top = `${Math.random() * 100}%`;
		pixel.style.animationDelay = `${Math.random() * 1}s`;
		pixelContainer.appendChild(pixel);
	}
}

// Add retro sound effects
const createBeepSound = () => {
	const context = initAudio();
	const oscillator = context.createOscillator();
	const gainNode = context.createGain();

	oscillator.connect(gainNode);
	gainNode.connect(context.destination);

	oscillator.type = 'square';
	oscillator.frequency.setValueAtTime(440, context.currentTime);
	gainNode.gain.setValueAtTime(0.1, context.currentTime);

	oscillator.start();
	gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
	setTimeout(() => oscillator.stop(), 100);
};

// Create warp sound effect
const createWarpSound = () => {
	const context = initAudio();
	const oscillator = context.createOscillator();
	const gainNode = context.createGain();

	oscillator.connect(gainNode);
	gainNode.connect(context.destination);

	oscillator.type = 'sawtooth';
	oscillator.frequency.setValueAtTime(100, context.currentTime);
	oscillator.frequency.exponentialRampToValueAtTime(
		2000,
		context.currentTime + 2
	);

	gainNode.gain.setValueAtTime(0.1, context.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 2);

	oscillator.start();
	setTimeout(() => oscillator.stop(), 2000);
};

// Check if we're on a redirect page
window.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const redirectUrl = urlParams.get('url');

	if (redirectUrl) {
		generatorSection.classList.add('hidden');
		redirectSection.classList.remove('hidden');
		redirectSection.classList.add('flex');
		createPixels();

		// Create countdown element
		const countdownEl = document.createElement('p');
		countdownEl.className =
			'text-yellow-400 text-2xl retro-font mb-4 countdown';
		countdownEl.id = 'countdown';
		countdownEl.textContent = '5';

		// Insert countdown before the "WARPING TO DESTINATION" text
		const loadingText = document.querySelector('.loading-text');
		loadingText.parentNode.insertBefore(countdownEl, loadingText);

		// Update the skip text to match the original
		const skipText = document.querySelector('.text-green-500');
		skipText.textContent = 'PRESS START TO SKIP';

		let countdownValue = 5;
		let countdownInterval;
		let redirectTimeout;

		// Initialize audio on first interaction
		const startRedirect = () => {
			createWarpSound();

			// Start countdown
			countdownInterval = setInterval(() => {
				countdownValue--;
				countdownEl.textContent = countdownValue;

				if (countdownValue <= 0) {
					clearInterval(countdownInterval);
				}
			}, 1000);

			// Set timeout for redirect
			redirectTimeout = setTimeout(() => {
				window.location.href = redirectUrl;
			}, 5000);
		};

		// Allow skipping the animation with any key press (not clicks)
		const skipHandler = (e) => {
			// Clear the countdown and timeout if skip is triggered
			clearInterval(countdownInterval);
			clearTimeout(redirectTimeout);
			window.location.href = redirectUrl;
		};

		// Start countdown automatically when page loads
		startRedirect();

		// Add event listener for skipping with key press only
		window.addEventListener('keydown', skipHandler);
	}
});

// Generate redirect URL
generateBtn.addEventListener('click', () => {
	const originalUrl = originalUrlInput.value.trim();
	if (!originalUrl) return;

	createBeepSound();
	const redirectUrl = `${window.location.origin}${
		window.location.pathname
	}?url=${encodeURIComponent(originalUrl)}`;
	redirectUrlInput.value = redirectUrl;
	resultContainer.classList.remove('hidden');

	// Auto copy to clipboard
	navigator.clipboard
		.writeText(redirectUrl)
		.then(() => {
			generateBtn.textContent = 'URL COPIED!';
			setTimeout(() => {
				generateBtn.textContent = 'GENERATE REDIRECT URL';
			}, 2000);
		})
		.catch(console.error);
});

// Copy button functionality
copyBtn.addEventListener('click', () => {
	createBeepSound();
	navigator.clipboard
		.writeText(redirectUrlInput.value)
		.then(() => {
			copyBtn.textContent = 'COPIED!';
			setTimeout(() => {
				copyBtn.textContent = 'COPY';
			}, 2000);
		})
		.catch(console.error);
});
