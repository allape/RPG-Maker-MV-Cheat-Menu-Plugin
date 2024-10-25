<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import { DefaultValue, type IOptionSelect } from './DefaultValue';

	interface Props {
		value?: ReturnType<IOptionSelect['OptionSelect']>;
		script?: Script;
	}

	let { value = $bindable(DefaultValue.OptionSelect()), script = $bindable('') }: Props = $props();

	const maker = getRPGMaker();

	// if (!scene._list._ascm_listPacthed) {
	//     scene._list = scene._list.map((i, ii) => ({
	//         ...i,
	//         name: `[${ii}] ` + i.name,
	//     }));
	//     scene._list._ascm_listPacthed = true;
	// }

	function make() {
		script = `
if (!window.SceneManager) return;

var scene = SceneManager._scene;
if (!scene) return;

var windowName = decodeURIComponent('${encodeURIComponent(value.sceneWindowName)}');

if (windowName) {
	scene = scene[windowName];
	if (!scene) return;
}

if (!(scene instanceof Window_Selectable)) {
	var found = Object.entries(scene).reverse().find(([name, value]) => value instanceof Window_Selectable && value.visible);
	scene = found[1];
}

if (!scene) return;

var index = parseInt('${value.index}');
if (isNaN(index) || index < 0) {
	alert('Invalid index');
}

scene._index = parseInt('${value.index}');
scene.processOk();
`;
		return script;
	}

	function run() {
		maker.evaluate(make());
	}

	onMount(() => {
		window.addEventListener(MakeScriptEventName, make);
		return () => {
			window.removeEventListener(MakeScriptEventName, make);
			make();
		};
	});
</script>

<input type="text" placeholder="Window name (optional)" bind:value={value.sceneWindowName}>
<FormItemWithButton onclick={run}>
	<input placeholder="Selected index of option" type="number" step="1" min="0" bind:value={value.index}>
	{#snippet button()}Choose{/snippet}
</FormItemWithButton>
