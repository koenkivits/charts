<script>
  export let data;
  export let colors;

  export let startAngle = 0;
  export let clockWise = false;

  import BaseChart from './BaseChart.svelte';
  import PieSlices from './PieSlices.svelte';
</script>

<svelte:options namespace="svg" />
<BaseChart type="pie">
  <PieSlices data={data} colors={colors} startAngle={startAngle} clockWise={clockWise} />
</BaseChart>
