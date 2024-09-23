import App from './App.svelte';
import MV, { errorEnhancement } from './core/mv';
import './style.scss';

try {
	errorEnhancement();
} catch (e) {
	console.error(e);
}

interface IGlobal {
	__AsCheaterApp?: App;
}

setTimeout(() => {
	const root = document.createElement('div');
	window.document.body.appendChild(root);

	(window as IGlobal).__AsCheaterApp = new App({
		target: root
	});

	MV.playSound(true);
}, 1000);
