<script lang="ts">
	import MV from '../../../core/mv';
	import SearchableSelect from '../../ui/SearchableSelect.svelte';
	import Custom from './Custom.svelte';

	export let name: string = 'Change';
	export let value: string = '';
	export let list: string[] = MV.get$dataSystem().switches.map((i, ii) => `${ii}: ${i}`);

	let to: HTMLInputElement | undefined = undefined;

	const handleEval = () => {
		const index = list.indexOf(value);
		if (index === -1) {
			return;
		}
		const changeTo = !!to?.checked;
		MV.get$gameSwitches().setValue(index, changeTo);
		MV.playSound(changeTo);
	};

	$: {
		if (to) {
			to.checked = MV.get$gameSwitches().value(list.indexOf(value));
		}
	}
</script>

<Custom func={handleEval} editing={$$props.editing} bind:name={name}>
	<SearchableSelect placeholder="Search for switches" list={list} bind:value={value}>
		<input bind:this={to} style:flex="unset" type="checkbox">
	</SearchableSelect>
</Custom>
