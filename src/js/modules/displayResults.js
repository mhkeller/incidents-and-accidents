import * as d3 from 'd3';
const tableContainer = d3.select('#table-container');

export default function displayResults (json) {
  const row = tableContainer.selectAll('.table-row').data(json).enter()
    .append('div')
    .classed('table-row', true);

  row.selectAll('.cell').data(d => Object.keys(d).map(q => [q, d[q]])).enter()
    .append('div')
    .classed('cell', true)
    .html(d => d.join(':'));
}
