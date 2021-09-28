<script>
  export let labels;
  export let totals;
  export let colors;
  export let format; // function
  export let truncate = false;
  export let maxPoints = 20;

  import { getExtraWidth } from '../../js/utils/constants';
  import { getDimensions, getMeasures } from './BaseChart.svelte';
  import LegendDot from './draw/LegendDot.svelte';

  const measures = getMeasures();
  const dimensions = getDimensions();

  $: dots = totals.slice(0, maxPoints).map((d, i) => {
    let barWidth = 150;
    let divisor = Math.floor(
      ($dimensions.width - getExtraWidth(measures)) / barWidth
    );
    if (totals.length < divisor) {
      barWidth = $dimensions.width / totals.length;
    }
    let x = barWidth * (i % divisor) + 5;
    let y = 20 * Math.floor(i / divisor);
    let label = truncate
      ? truncateString(labels[i], barWidth / 10)
      : labels[i];
    let formatted = format
      ? format(d)
      : d;

    return {
      x,
      y,
      label: `${label}: ${formatted}`,
      fill: colors[i],
    };
  });

</script>

{#each dots as dot}
  <LegendDot
    x={dot.x}
    y={dot.y}
    size={5}
    label={dot.label}
    fill={dot.fill}
  />
{/each}
