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

	const app = new App({
		target: root
	});

	// @ts-ignore
	window.__AsCheaterApp = app;

	MV.playSound(true);
}, 3000);
