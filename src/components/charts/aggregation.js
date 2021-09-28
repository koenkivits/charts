import { round } from "../../js/utils/helpers";

export function configure(args) {
  return {
    formatTooltipY: (args.tooltipOptions || {}).formatTooltipY,
    maxSlices: args.maxSlices || 20,
    maxLegendPoints: args.maxLegendPoints || 20,
  };
}

// TODO this file implements the common logic for aggregate charts. Rename/refactor to make
// that more clear
// https://frappe.io/charts/docs/basic/aggr_sliced_diags

export function calc(config, colors, data) {
  const state = {};
  let maxSlices = config.maxSlices;
  state.sliceTotals = [];

  let allTotals = data.labels
    .map((label, i) => {
      let total = 0;
      data.datasets.map((e) => {
        total += e.values[i];
      });
      return [total, label];
    })
    .filter((d) => {
      return d[0] >= 0;
    }); // keep only positive results

  let totals = allTotals;
  if (allTotals.length > maxSlices) {
    // Prune and keep a grey area for rest as per maxSlices
    allTotals.sort((a, b) => {
      return b[0] - a[0];
    });

    totals = allTotals.slice(0, maxSlices - 1);
    let remaining = allTotals.slice(maxSlices - 1);

    let sumOfRemaining = 0;
    remaining.map((d) => {
      sumOfRemaining += d[0];
    });
    totals.push([sumOfRemaining, "Rest"]);
    colors[maxSlices - 1] = "grey";
  }

  state.labels = [];
  totals.map((d) => {
    state.sliceTotals.push(round(d[0]));
    state.labels.push(d[1]);
  });

  state.grandTotal = state.sliceTotals.reduce((a, b) => a + b, 0);

  return state;
}

// TODO render legend
