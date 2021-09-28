<script>
  let className;
  export { className as class };

  export let x;
  export let y;
  export let fontSize = FONT_SIZE;
  export let fill = FONT_FILL;
  export let textAnchor = "start";
  export let dy = fontSize / 2;


  import { FONT_FILL, FONT_SIZE } from './constants';
</script>

<svelte:options namespace="svg" />

<text
  class={className}
  x={x}
  y={y}
  dy={`${dy}px`}
  font-size={`${fontSize}px`}
  fill={fill}
  text-anchor={textAnchor}
>
  <slot />
</text>
