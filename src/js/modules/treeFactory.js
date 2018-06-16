import debounce from './debounce.js';

export default function treeChart (d3) {
  let margin;
  function chart (selection) {
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
      margin = {top: 0, right: 20, bottom: 20, left: 40};

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

      var root = tree(d3.hierarchy(data));

      let links = g.selectAll('.link')
        .data(root.links());

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

      let enterNodes = nodes.enter()
        .append('g');

      enterNodes.append('text')
        .attr('dy', 4)
        .text(d => d.data.id);

      let allNodes = enterNodes
        .merge(nodes)
        .attr('class', d => 'node ' + (d.children ? ' node--internal' : ' node--leaf'))
        .attr('transform', d => 'translate(' + d.y + ',' + d.x + ')')
        .each(setActive)
        .on('click', function (d) {
          allNodes.classed('active', false).raise();
          d3.select(this).classed('active', true);
          // TODO, redo with dispatch
          window.currentId = d.data.id;
        });

      allNodes.select('text')
        .attr('x', d => d.data.children ? -8 : 8)
        .style('text-anchor', d => d.data.children ? 'end' : 'start');

      enterNodes.append('circle')
        .attr('r', 4.5);
    }

    function relayout () {
      selection.each(renderSelection);
    }

    var relayoutDebounced = debounce(relayout, 200);
    d3.select(window).on('resize.treeFactory', relayoutDebounced);
  }

  function setActive (d) {
    d3.select(this).classed('active', d.data.id === window.currentId);
  }

  chart.margin = function (__) {
    if (typeof __ === 'undefined') {
      return __;
    }
    margin = __;
    return chart;
  };

  return chart;
}
