import debounce from './debounce.js';

export default function treeChart (d3) {
  function chart (selection) {
    let margin;
    let chartContainer;
    let svg;
    let g;
    let width;
    let height;

    selection.each(renderSelection);

    // What to do for each div captured by our selector
    function renderSelection (data, i) {
      setValues.call(this, data);
      bakeLayout.call(this, data);
      renderChartElements.call(this, data);
    }

    // Measure DOM elements and set scales from data accordingly
    function setValues (data) {
      margin = {top: 0, right: 20, bottom: 20, left: 20};

      // Set dimensions from div dimensions
      var canvasWidth = this.getBoundingClientRect().width;
      var canvasHeight = this.getBoundingClientRect().height;

      width = canvasWidth - margin.left - margin.right;
      height = canvasHeight - margin.top - margin.bottom;
    }

    // Render the main svg components, i.e. nothing that represents data itself
    function bakeLayout (d) {
      let containerSel = d3.select(this).selectAll('.chart-container').data(['']);
      chartContainer = containerSel.enter().append('div')
        .classed('chart-container', true)
        .merge(containerSel);

      let svgSel = chartContainer.selectAll('svg').data(['']);
      svg = svgSel.enter().append('svg')
        .merge(svgSel)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      let gSel = svg.selectAll('g.svg-g').data(['']);
      g = gSel.enter().append('g')
        .classed('svg-g', true)
        .merge(gSel)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    }

    // Render elements bound to data elements
    function renderChartElements (data) {
      const tree = d3.tree()
        .size([height, width - 50]);

      var root = d3.hierarchy(data);

      let links = g.selectAll('.link')
        .data(tree(root).links());

      // enter links
      links.enter().append('path')
        .attr('class', 'link')
        .merge(links)
        .attr('d', d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x)
        );

      // Exit links
      links.exit().remove();

      let nodes = g.selectAll('.node')
        .data(root.descendants());

      // Exit nodes
      nodes.exit().remove();

      let enterNodes = nodes.enter().append('g');

      enterNodes
        .merge(nodes)
        .attr('class', d => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
        .attr('transform', d => 'translate(' + d.y + ',' + d.x + ')');

      enterNodes.append('circle')
        .attr('r', 2.5);

      enterNodes.append('text')
        .attr('dy', 3)
        // .merge(nodes)
        .attr('x', d => d.children ? -8 : 8)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name);
    }

    function relayout () {
      selection.each(renderSelection);
    }

    var relayoutDebounced = debounce(relayout, 200);
    d3.select(window).on('resize.treeFactory', relayoutDebounced);
  }

  // chart.xKey = function (__) {
  //   if (typeof __ === 'undefined') {
  //     return __;
  //   }
  //   xKey = __;
  //   return chart;
  // };

  return chart;
}
