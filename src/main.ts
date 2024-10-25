import { mount } from 'svelte';
import App from './App.svelte';
import './style.scss';
import { getRPGMaker } from './rpgmaker';

try {
	const maker = getRPGMaker();
	maker.evaluate(maker.getScriptGenerator().setup());
} catch (e) {
	console.error(e);
}

interface IGlobal {
	__AsCheaterApp?: App;
}

setTimeout(() => {
	const root = document.createElement('div');
	window.document.body.appendChild(root);

	(window as IGlobal).__AsCheaterApp = mount(App, {
		target: root
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}) as unknown as any;

	getRPGMaker().playSound(true);
}, 1000);
