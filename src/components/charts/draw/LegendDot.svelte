<script>
  export let x;
  export let y;
  export let size;
  export let label;
  export let fill = "none";
  export let truncate = false;

  import { FONT_SIZE, FONT_FILL, LABEL_MAX_CHARS } from './constants';

  label = truncate ? truncateString(label, LABEL_MAX_CHARS) : label;

</script>

<svelte:options namespace="svg" />

<g transform={`translate(${x}, ${y})`}>
  <circle
    class="legend-dot"
    cx="0"
    cy="0"
    r={size}
    fill={fill}
  />
  <text
    class="legend-dataset-text"
    x="0"
    y="0"
    dx={`${FONT_SIZE}px`}
    dy={`${FONT_SIZE / 3}px`}
    font-size={`${FONT_SIZE * 1.2}px`}
    text-anchor="start"
    fill={FONT_FILL}
  >
    {label}
  </text>
</g>
