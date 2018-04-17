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
import uniqueId from './modules/uniqueId.js';

window.testData = {
  "name": "Eve",
  "children": [
    {
      "name": "Cain"
    },
    {
      "name": "Seth",
      "children": [
        {
          "name": "Enos"
        },
        {
          "name": "Noam"
        }
      ]
    },
    {
      "name": "Abel"
    },
    {
      "name": "Awan",
      "children": [
        {
          "name": "Enoch"
        }
      ]
    },
    {
      "name": "Azura"
    }
  ]
};

const myTree = treeFactory(d3);

// let parentId;
let currentId = uniqueId('q');

let treeData = {
  id: currentId,
  children: []
};

updateChart();

d3.select('#input-button')
  .on('click', e => {
    const query = document.getElementById('input-textarea').value;
    saveQuery(query);
  });

function saveQuery (query) {
  const node = traverse(treeData, currentId);
  if (!node.children) {
    node.children = [];
  }
  node.children.push(newChild(query));
  updateChart();
}

function newChild (query) {
  return {
    id: uniqueId('q'),
    query
  };
}

function traverse (node, target) {
  let result;
  if (node.id === target) {
    result = node;
  }
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      let r = traverse(node.children[i], target);
      if (r !== undefined) {
        result = r;
        break;
      }
    }
  }
  return result;
}

function updateChart () {
  d3.select('#tree-container')
    .datum(treeData)
    .call(myTree);
}
