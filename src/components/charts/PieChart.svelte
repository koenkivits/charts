<script>
  export let data;
  export let colors = DEFAULT_COLORS.pie;

  export let startAngle = 0;
  export let clockWise = false;

  import { validateColors } from '../../js/utils/colors';
  import { DEFAULT_COLORS } from '../../js/utils/constants';
  import BaseChart from './BaseChart.svelte';
  import PieSlices from './PieSlices.svelte';
  import AggregateLegend from './AggregateLegend.svelte';

  import { calc, configure } from "./aggregation";

  colors = validateColors(colors, 'pie');

  // TODO dedup from PieSlices
  const config = configure({}); // TODO
  const { sliceTotals, labels } = calc(config, colors, data);
</script>

<svelte:options namespace="svg" />
<BaseChart type="pie">
  <PieSlices data={data} colors={colors} startAngle={startAngle} clockWise={clockWise} />
  <AggregateLegend
    slot="legend"
    labels={labels}
    totals={sliceTotals}
    colors={colors}
  />
</BaseChart>
