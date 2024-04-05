import App from './App.svelte';
import MV, { errorEnhancement } from './core/mv';

try {
	errorEnhancement();
} catch (e) {
	console.error(e);
}

setTimeout(() => {
	const root = document.createElement('div');
	window.document.body.appendChild(root);

	// @ts-ignore
	window.__AsCheaterApp = new App({
		target: root
	});

	MV.playSound(true);
}, 1000);
