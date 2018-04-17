/* --------------------------------------------
 *
 * Write your JavaScript here.
 *
 * It will get rolled up. On `build`, it gets minified.
 * --------------------------------------------
 */

import * as d3 from 'd3';
import treeFactory from './modules/treeFactory.js';

const treeData = {
  name: 'Eve',
  children: [
    {
      name: 'Cain'
    },
    {
      name: 'Seth',
      children: [
        {
          name: 'Enos'
        },
        {
          name: 'Noam'
        }
      ]
    },
    {
      name: 'Abel'
    },
    {
      name: 'Awan',
      children: [
        {
          name: 'Enoch'
        }
      ]
    },
    {
      name: 'Azura'
    }
  ]
};

const myTree = treeFactory(d3);

const sel = d3.select('#container')
  .datum(treeData)
  .call(myTree);

setTimeout(() => {
  const newData = {
    name: 'lulz',
    children: [
      {
        name: 'hi'
      },
      {
        name: 'Awan',
        children: [
          {
            name: 'Enoch'
          }
        ]
      },
      {
        name: 'Azura'
      }
    ]
  };
  sel
    .datum(newData)
    .call(myTree);
  console.log('fired');
}, 3000);
