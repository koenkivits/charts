<script context="module">
  import { getContext, setContext } from "svelte";

  const dimensionsContextKey = {};
  export function getDimensions() {
    return getContext(dimensionsContextKey);
  }

  const measuresContextKey = {};
  export function getMeasures() {
    return getContext(measuresContextKey);
  }
</script>

<script>
  export let title = "";
  export let type = "";

  export let height;
  export let colors;

  export let isNavigable = false;
  export let animate = true;
  export let truncateLegends = true;

  import Text from "./draw/Text.svelte";
  import Tooltip from "../Tooltip.svelte";
  import { initTooltip } from "./tooltip";
  import {
    $ as _$,
    getElementContentWidth
  } from "../../js/utils/dom";
  import {
    BASE_MEASURES,
    getExtraHeight,
    getExtraWidth,
    getLeftOffset,
    getTopOffset,
  } from "../../js/utils/constants";
  import { writable } from "svelte/store";

  // this.realData = this.prepareData(options.data);
  // this.data = this.prepareFirstData(this.realData); // TODO?

  let config = {
    showTooltip: true, // calculate
    showLegend: true, // calculate
    isNavigable: isNavigable || false,
    animate: typeof animate !== "undefined" ? animate : 1,
    truncateLegends: truncateLegends || true,
  };

  let measures = JSON.parse(JSON.stringify(BASE_MEASURES));
  if (!title.length) {
    measures.titleHeight = 0;
  }

  if (!config.showLegend) {
    measures.legendHeight = 0;
  }

  if (type === 'pie') {
    // TODO this shouldn't be necessary
    // (this probably needs fixing for other types as well)
    measures.paddings.left = measures.paddings.right;
  }

  setContext(measuresContextKey, measures);

  let container;
  let containerWidth = 0;
  let argHeight = height || measures.baseHeight;
  let baseHeight = argHeight;

  // TODO make independent from parentNode. It shouldn't be necessary?
  let baseWidth = container ? getElementContentWidth(container.parentNode) : 0;

  // TODO isNavigable
  // TODO makeTooltip()
  // TODO calc()
  // TODO showLegend
  // TODO updateNav
  // TODO setupNavigation()
  // TODO cleanup on destroy
  // TODO export
  // TODO components?
  // TODO responsiveness
  // TODO animate

  const dimensions = writable({});
  setContext(dimensionsContextKey, dimensions);

  // TODO https://svelte.dev/docs#Block-level_element_bindings ?
  $: baseHeight = argHeight;
  $: baseWidth = container ? getElementContentWidth(container.parentNode) : 0;
  $: {
    $dimensions = {
      width: baseWidth - getExtraWidth(measures),
      height: baseHeight - getExtraHeight(measures),
    };
  }

  const tooltip = initTooltip({
    colors,
  });
  // TODO independentWidth
</script>

<style>
   .chart-container {
    position: relative; /* for absolutely positioned tooltip */

    /* https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/ */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
  }
</style>

<div class="chart-container" bind:this={container} bind:offsetWidth={containerWidth}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="frappe-chart chart"
    width={baseWidth}
    height={baseHeight}
  >
    <defs />
    {#if title}
      <Text
        class="title"
        x={measures.margins.left}
        y={measures.margins.top}
        fontSize={measures.titleFontSize}
        fill="#666666"
        dy={measures.titleFontSize}
      >
        {title}
      </Text>
    {/if}
    <g
      class={`${type}-chart chart-draw-area`}
      transform={`translate(${getLeftOffset(measures)}, ${getTopOffset(measures)})`}
    >
      <slot />
    </g>
    {#if $$slots.legend}
      <g
        class="chart-legend"
        transform={`translate(${getLeftOffset(measures)}, ${getTopOffset(measures) + $dimensions.height + measures.paddings.bottom})`}
      >
        <slot name="legend" />
      </g>
    {/if}
  </svg>
  <Tooltip {...$tooltip} {containerWidth} />
</div>
