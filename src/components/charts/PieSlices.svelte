<script>
  export let totals;
  export let colors;
  export let labels;
  export let type = 'pie'; // can also be 'donut'

  export let strokeWidth = 30; // only applicable to type=donut
  export let hoverRadio = 0.1;
  export let startAngle = 0;
  export let clockWise = false;

  import { getDimensions } from './BaseChart.svelte';
  import { getPositionByAngle } from "../../js/utils/helpers";
  import { makeArcPathStr, makeCircleStr, makeStrokeCircleStr, makeArcStrokePathStr } from "../../js/utils/draw";
  import { getTooltip } from "./tooltip";
  import { getOffset } from '../../js/utils/dom';

  strokeWidth = type === 'donut' ? strokeWidth : 0;

  // TODO SSR responsiveness
  // https://codepen.io/gionkunz/pen/KDvLj

  // TODO accessibility
  // - https://www.sarasoueidan.com/blog/accessible-data-charts-for-khan-academy-2018-annual-report/
  // - https://blog.tenon.io/accessible-charts-with-aria/
  // - https://www.highcharts.com/blog/accessibility/#exploreFeatures
  // - https://www.fusioncharts.com/extensions/accessibility
  // (tabindex=-1 for data points etc) https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex

  const dimensions = getDimensions();
  const tooltip = getTooltip();

  let hoverIndex = null;
  let slices = [];

  function sum(values) {
    return values.reduce((a, b) => a + b, 0);
  }

  function getValueAngle(value) {
    return value / grandTotal * 360 * (clockWise ? -1 : 1);
  }

  $: grandTotal = sum(totals);
  $: center = {
    x: $dimensions.width / 2,
    y: $dimensions.height / 2,
  };
  $: radius = ($dimensions.height > $dimensions.width ? center.x : center.y) - strokeWidth / 2;

  $: baseAngle = 180 - startAngle;
  $: slices = totals.map((total, index) => {
    const sliceAngle = getValueAngle(total);

    const sliceStartAngle = getValueAngle(sum(totals.slice(0, index))) + baseAngle;

    const startPosition = getPositionByAngle(sliceStartAngle, radius);
    const endPosition = getPositionByAngle(sliceStartAngle + sliceAngle, radius);

    return {
      path: makePath(sliceAngle, startPosition, endPosition),
      color: colors[index],
      activeTransform: calTranslateByAngle(radius, sliceStartAngle, sliceAngle),
    };
  });

  function makePath(sliceAngle, startPosition, endPosition) {
    if (type === 'donut') {
      return makeStrokePath(sliceAngle, startPosition, endPosition);
    } else {
      return makeFillPath(sliceAngle, startPosition, endPosition);
    }
  }

  function makeFillPath(sliceAngle, startPosition, endPosition) {
    const absSliceAngle = Math.abs(sliceAngle);
    const largeArc = absSliceAngle > 180 ? 1 : 0;

    return (
      absSliceAngle === 360
        ? makeCircleStr(
            startPosition,
            endPosition,
            center,
            radius,
            clockWise,
            largeArc
          )
        : makeArcPathStr(
            startPosition,
            endPosition,
            center,
            radius,
            clockWise,
            largeArc
        )
    );
  }

  function makeStrokePath(sliceAngle, startPosition, endPosition) {
    const absSliceAngle = Math.abs(sliceAngle);
    const largeArc = absSliceAngle > 180 ? 1 : 0;

    return (
      absSliceAngle === 360
        ? makeStrokeCircleStr(
            startPosition,
            endPosition,
            center,
            radius,
            clockWise,
            largeArc
          )
        : makeArcStrokePathStr(
            startPosition,
            endPosition,
            center,
            radius,
            clockWise,
            largeArc
        )
    );
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
          value: `${((totals[hoverIndex] * 100) / grandTotal).toFixed(1)}%`,
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
  .slice {
    transition: transform .3s, filter .3s;
  }

  .slice:hover {
    filter: brightness(125%);
    transform: var(--active-transform);
  }

  .slice--pie {
    fill: var(--slice-color);
    stroke: none;
  }

  .slice--donut {
    fill: none;
    stroke: var(--slice-color);
    stroke-width: var(--stroke-width);
  }
</style>

<svelte:options namespace="svg" />
<g
  class="slices"
  on:mousemove={handleMouseMove}
  on:mouseout={handleMouseOut}
  style={`--stroke-width: ${strokeWidth}`}
>
  {#each slices as slice, index}
    <path
      d={slice.path}
      class={`slice slice--${type}`}
      data-index={index}
      style={`--slice-color: ${slice.color}; --active-transform: ${slice.activeTransform};`}
    />
  {/each}
</g>
