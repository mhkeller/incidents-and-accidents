/* --------------------------------------------
 *
 * Write your JavaScript here.
 *
 * It will get rolled up. On `build`, it gets minified.
 * --------------------------------------------
 */

import * as d3 from 'd3';
import treeFactory from './modules/treeFactory.js';
import traverse from './modules/traverse.js';
import uniqueId from './modules/uniqueId.js';
import queryDb from './modules/queryDb.js';
import displayResults from './modules/displayResults.js';

const myTree = treeFactory(d3);

window.currentId = uniqueId('q');

let treeData = {
  id: window.currentId,
  children: []
};

updateChart();

const inputButton = document.getElementById('input-button');

inputButton
  .addEventListener('click', onQuery);

inputButton.addEventListener('animationend', () => inputButton.classList.remove('active'));
inputButton.addEventListener('webkitAnimationEnd', () => inputButton.classList.remove('active'));

document.getElementById('input-textarea')
  .addEventListener('keypress', function (e) {
    if (e.code === 'Enter' && e.metaKey === true) {
      inputButton.classList.add('active');
      inputButton.click();
    }
  });

function onQuery (e) {
  const query = document.getElementById('input-textarea').value;
  if (query.trim()) {
    queryDb(query, (err, json) => {
      if (err) {
        console.error(err);
      } else {
        saveQuery(query);
        displayResults(json);
      }
    });
  }
}

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
