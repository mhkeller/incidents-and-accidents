/* --------------------------------------------
 *
 * Write your JavaScript here.
 *
 * It will get rolled up. On `build`, it gets minified.
 * --------------------------------------------
 */

import * as d3 from 'd3';
// import traverse from 'traverse';
import treeFactory from './modules/treeFactory.js';
import traverse from './modules/traverse.js';
import uniqueId from './modules/uniqueId.js';

const myTree = treeFactory(d3);

window.currentId = uniqueId('q');

let treeData = {
  id: window.currentId,
  children: []
};

updateChart();

d3.select('#input-button')
  .on('click', e => {
    const query = document.getElementById('input-textarea').value;
    saveQuery(query);
  });

function saveQuery (query) {
  const node = traverse(treeData, window.currentId);
  if (!node.children) {
    node.children = [];
  }
  node.children.push(newChild(query));
  updateChart();
}

function newChild (query) {
  window.currentId = uniqueId('q');
  return {
    id: window.currentId,
    query
  };
}

function updateChart () {
  d3.select('#tree-container')
    .datum(treeData)
    .call(myTree);
}
