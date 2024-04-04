<script lang="ts">
	import MV from "../../../core/mv";
	import Evaluate from "../Evaluate/Evaluate.svelte";

    const handleEval = () => {
        try {
            new Function('require(\'nw.gui\').Window.get().showDevTools()')();
            MV.playSound(true);
        } catch(e) {
            MV.playSound(false);
        }
    };
</script>

<Evaluate func={handleEval} disabled={$$props.editing}>
    Dev
    <br>
    Tools
</Evaluate>