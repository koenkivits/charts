<script>
	import { TOOLTIP_POINTER_TRIANGLE_HEIGHT } from "../utils/constants";

  export let colors;
  export let containerWidth;
  export let index; // ?? (default should be -1 btw?
  export let titleName = "";
  export let titleValue = "";
  export let listValues = [];
  export let titleValueFirst = false; // TODO this could be handled with CSS probably?

  export let x = 0;
  export let y = 0;

  export let visible = false;

	let container;
	let width = 0;
  let height = 0;

  let top = y - height - TOOLTIP_POINTER_TRIANGLE_HEIGHT;
  let left = x - width / 2;
  let maxLeft = containerWidth - width;

  let pointerOffset = '0px';
  if (left < 0) {
    pointerOffset = `${left}px`;
  } else if (left > maxOffset) {
    pointerOffset = `${left - maxLeft}px`;
  }

  let listItems = listValues.map((set, key) => ({
    color: colors[key] || "black",
    value: set.formatted === 0 || set.formatted ? set.formatted : set.value,
    title: set.title || '',
  }));
/* TODO for parent
	this.parent.addEventListener("mouseleave", () => {
		this.hideTip();
	}); */
</script> 

<style>
	/* TODO these styles need cleaning up */

	.graph-svg-tip {
		position: absolute;
		z-index: 99999; /* TODO no z-index hacking */
		padding: 10px;
		font-size: 12px;
		color: #959da5; /* TODO hardcoded color and font size */
		text-align: center;
		background: rgba(0, 0, 0, 0.8);
		border-radius: 3px;
    
		/* TODO these came from .comparison? But that class is always applied? */
		padding: 0;
    text-align: left;
    pointer-events: none;
	}

	ul {
		/* TODO this also targeted <ol>? */
		margin: 0;
		white-space: nowrap;
		list-style: none;
		padding-left: 0;
		display: flex;
	}

	strong {
		color: #dfe2e5;
		font-weight: 600;
	}

	.title {
		display: block;
		padding: 10px;
		margin: 0;
		font-weight: 600;
		line-height: 1;
		pointer-events: none;
	}

  .hidden {
    top: 0 !important;
    left: 0 !important;
    opacity: 0;
  }

  .data-point-item {
    border-top: 3px solid var(--value-color);
		min-width: 90px;
		flex: 1;
		font-weight: 600;
		display: inline-block;
		padding: 5px 10px;
  }

  .data-point-value {
    display: block;
  }

  .svg-pointer {
		position: absolute;
		height: 5px;
		margin: 0 0 0 -5px;
		content: " ";
		border: 5px solid transparent;
		border-top-color: rgba(0, 0, 0, 0.8);
    left: calc(50% + var(--pointer-offset));
  }
</style>

<div
	class="graph-svg-tip comparison"
	class:hidden={!visible}
	bind:this={container}
	bind:offsetWidth={width}
  bind:offsetHeight={height}
  data-point-index={index}
  style={`top: ${top}px; left: ${left}px;`}
>
  <span class="title">
    {#if titleValueFirst}
      <strong>{titleValue}</strong>{titleName}
    {:else}
      {titleName}<strong>{titleValue}</strong>
    {/if}
  </span>
  <ul class="data-point-list">
    {#each listItems as item}
      <li class="data-point-item" style={`--value-color: ${item.color}`}>
        <strong class="data-point-value">{ item.value }</strong>
        { item.title }
      </li>
    {/each}
  </ul>
	<div class="svg-pointer" style={`--pointer-offset: ${pointerOffset};`}></div>
</div>
