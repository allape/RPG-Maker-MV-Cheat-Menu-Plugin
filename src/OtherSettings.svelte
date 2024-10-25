<script lang="ts">
	import { getRPGMaker } from './rpgmaker';

	interface Props {
		maxOpacity: number;
		opacity: number;
		exportDisabled?: boolean;
		onimport?: () => void;
		onexport?: () => void;
	}

	let {
		maxOpacity,
		opacity = $bindable(3),
		exportDisabled,
		onimport,
		onexport
	}: Props = $props();

</script>

<style lang="scss">
  .wrapper {
    .otherSettings {
      padding: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .setting {
        flex: 1;
        display: flex;
        align-items: center;

        button:not(:first-child) {
          margin-left: 10px;
        }
      }
    }

    .versions {
      margin: -5px 0 10px;
      padding: 0 10px;
      text-align: right;
      user-select: text !important;
    }
  }
</style>

<div class="wrapper">
	<div class="otherSettings">
		<div class="setting">
			Opacity:
			<input type="range" min="0" max={maxOpacity} step="1"
						 bind:value={opacity}>
		</div>
		<div class="setting" style="justify-content: flex-end;">
			<button onclick={onimport}>Import</button>
			<button disabled={exportDisabled} onclick={onexport}>Export</button>
		</div>
	</div>
	<div class="versions">
		{__APP_VERSION__}, {getRPGMaker().getVersionString()}
	</div>
</div>
