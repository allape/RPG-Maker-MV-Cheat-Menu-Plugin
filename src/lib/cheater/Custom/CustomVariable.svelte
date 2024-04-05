<script lang="ts">
	import MV from '../../../core/mv';
	import SearchableSelect from '../../ui/SearchableSelect.svelte';
	import Custom from './Custom.svelte';

	export let name: string = 'Var';
	export let value: string = '';
	export let list: string[] = MV.get$dataSystem().variables.map((i, ii) => `${ii}: ${i}`);

	let data: HTMLInputElement | undefined = undefined;

	const handleEval = () => {
		const index = list.indexOf(value);
		if (index === -1) {
			return;
		}
		const changeTo = data?.value || '';
		const oldValue = MV.get$gameVariables().value(index);
		MV.setVariable(index, typeof oldValue === 'number' ? parseInt(changeTo) || 0 : changeTo);
		MV.playSound(true);
	};

	$: {
		if (data) {
			data.value = MV.get$gameVariables().value(list.indexOf(value));
		}
	}
</script>

<Custom func={handleEval} editing={$$props.editing} bind:name={name}>
	<SearchableSelect placeholder="Search for variables" list={list} bind:value={value} />
	<input bind:this={data} type="text" placeholder="Variable value" />
</Custom>
