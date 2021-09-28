<script>
  export let data;
  export let colors = DEFAULT_COLORS.pie;

  export let startAngle = 0;
  export let clockWise = false;

  import { getDimensions } from './BaseChart.svelte';
  import { getPositionByAngle } from "../../js/utils/helpers";
  import { makeArcPathStr, makeCircleStr } from "../../js/utils/draw";
  import { FULL_ANGLE, DEFAULT_COLORS } from "../../js/utils/constants";
  import { calc, configure } from "./aggregation";
  import { validateColors } from '../../js/utils/colors';

  let sliceStrings = [];

  const dimensions = getDimensions();
  $: {
    const config = configure({}); // TODO
    const { sliceTotals, grandTotal } = calc(config, colors, data);

    sliceStrings = [];

    const center = {
      x: $dimensions.width / 2,
      y: $dimensions.height / 2,
    };
    const radius = $dimensions.height > $dimensions.width ? center.x : center.y;

    let curAngle = 180 - startAngle;
    sliceTotals.forEach((total) => {
      const startAngle = curAngle;
      const originDiffAngle = (total / grandTotal) * FULL_ANGLE;
      const largeArc = originDiffAngle > 180 ? 1 : 0;
      const diffAngle = clockWise ? -originDiffAngle : originDiffAngle;
      const endAngle = (curAngle = curAngle + diffAngle);
      const startPosition = getPositionByAngle(startAngle, radius);
      const endPosition = getPositionByAngle(endAngle, radius);

      let curStart, curEnd;
      curStart = startPosition;
      curEnd = endPosition;
      const curPath =
        originDiffAngle === 360
          ? makeCircleStr(
              curStart,
              curEnd,
              center,
              radius,
              clockWise,
              largeArc
            )
          : makeArcPathStr(
              curStart,
              curEnd,
              center,
              radius,
              clockWise,
              largeArc
            );

      sliceStrings.push(curPath);
    });
  }

  const validColors = validateColors(colors, 'pie');
  // TODO mouse interaction
</script>

<svelte:options namespace="svg" />
<g class="pie-slices">
  {#each sliceStrings as sliceString, index}
    <path
      d={sliceString}
      class="pie-path"
      style={`stroke: none; fill: ${validColors[index]}; transition: transform: .3s;`}
    />
  {/each}
</g>
