<script lang="ts">
	import MV from '../../../core/mv';
	import SearchableSelect from '../../ui/SearchableSelect.svelte';
	import Custom from './Custom.svelte';

	export let name: string = 'Togg';
	export let value: string = '';
	export let list: string[] = MV.get$dataSystem().switches.map((i, ii) => `${ii}: ${i}`);

	let to: boolean = false;

	const handleEval = () => {
		const index = list.indexOf(value);
		if (index === -1) {
			return;
		}
		to = !to;
		MV.get$gameSwitches().setValue(index, to);
		MV.playSound(to);
	};

	const handleChange = (e: CustomEvent<string>) => {
		to = MV.get$gameSwitches().value(list.indexOf(e.detail));
	};
</script>

<Custom func={handleEval} editing={$$props.editing} bind:name={name}>
	<SearchableSelect placeholder="Search for switches" list={list} bind:value={value} on:change={handleChange}>
		<input bind:checked={to} style:flex="unset" type="checkbox">
	</SearchableSelect>
</Custom>
