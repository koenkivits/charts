<script>
  export let data;
  export let colors;
  export let labels;

  export let hoverRadio = 0.1;
  export let startAngle = 0;
  export let clockWise = false;

  import { getDimensions } from './BaseChart.svelte';
  import { getPositionByAngle } from "../../js/utils/helpers";
  import { makeArcPathStr, makeCircleStr } from "../../js/utils/draw";
  import { FULL_ANGLE } from "../../js/utils/constants";
  import { calc, configure } from "./aggregation";
  import { getTooltip } from "./tooltip";
  import { getOffset } from '../../js/utils/dom';

  const tooltip = getTooltip();

  const config = configure({}); // TODO
  const { sliceTotals, grandTotal } = calc(config, colors, data);

  let hoverIndex = null;
  let slices = [];

  const dimensions = getDimensions();
  $: {
    // TODO this reactive block _shouldn't be necessary. I think

    slices = [];

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

      slices.push({
        path: curPath,
        activeTransform: calTranslateByAngle(radius, startAngle, diffAngle),
      });
    });
  }

  function calTranslateByAngle(radius, startAngle, diffAngle) {
    const position = getPositionByAngle(
      startAngle + diffAngle / 2,
      radius
    );
    return `translate(${position.x * hoverRadio}px,${
      position.y * hoverRadio
    }px)`;
  }

  function handleMouseMove(evt) {
    const targetIndex = evt.target.dataset.index;
    if (typeof targetIndex !== "undefined") {
      hoverIndex = Number(targetIndex);

      const svg = evt.target.closest("svg");
      let g_off = getOffset(svg);
      let x = evt.pageX - g_off.left; // TODO this used to do +10, probably to compensate for
                                      //      the off-center charts in Frappe?
      let y = evt.pageY - g_off.top - 10; // TODO where does this 10 come from?

      tooltip.update({
        x,
        y,
        visible: true,
        title: {
          name: `${labels[hoverIndex]}: `,
          value: `${((sliceTotals[hoverIndex] * 100) / grandTotal).toFixed(1)}%`,
        }
      });
    }
  }

  function handleMouseOut(evt) {
    const targetIndex = evt.target.dataset.index;
    if (
      typeof targetIndex !== "undefined" &&
      Number(targetIndex) === hoverIndex
    ) {
      hoverIndex = undefined;
      tooltip.update({
        visible: false,
      });
    }
  }

  // TODO animation
  // TODO tooltip
</script>

<style>
  .pie-slice {
    stroke: none;
    transition: transform .3s, filter .3s;
  }

  .pie-slice:hover {
    filter: brightness(125%);
    transform: var(--active-transform);
  }
</style>

<svelte:options namespace="svg" />
<g class="pie-slices" on:mousemove={handleMouseMove} on:mouseout={handleMouseOut}>
  {#each slices as slice, index}
    <path
      d={slice.path}
      class="pie-slice"
      data-index={index}
      style={`fill: ${colors[index]}; --active-transform: ${slice.activeTransform};`}
    />
  {/each}
</g>
