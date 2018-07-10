import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';
import final from '../staticData/data';

class App extends Component {
  constructor(props) {
    super(props);

    this.initGraph = this.initGraph.bind(this);
  }

  initGraph() {
    const ticked = () => {
      link.attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y);
    },
          dragStarted = (d) => {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          },
          dragged = (d) => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          },
          dragended = (d) => {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }
    const svg = d3.select(this.refs.refName),
          width = 960,
          height = 600;
    
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    let simulation = d3.forceSimulation()
                       .force('link', d3.forceLink().id((d) => d.id))
                       .force('charge', d3.forceManyBody())
                       .force('center', d3.forceCenter(width/2, height/2));
    let link = svg.append('g')
                  .attr('class', 'links')
                  .selectAll('line')
                  .data(final.links)
                  .enter()
                  .append('line')
                  .attr('stroke-width', (d) => Math.sqrt(d.value));
    
    let node = svg.append('g')
                  .attr('class', 'nodes')
                  .selectAll('circle')
                  .data(final.nodes)
                  .enter().append('circle')
                          .attr('r', 5)
                          .attr('fill', (d) => color(d.group))
                          .call(d3.drag()
                                  .on('start', dragStarted)
                                  .on('drag', dragged)
                                  .on('end', dragended));
    
    node.append('title')
        .text((d) => d.id);
    
    simulation.nodes(final.nodes)
              .on('tick', ticked);
    
    simulation.force('link')
              .links(final.links);
  }

  componentDidMount() {
    this.initGraph();
  }
  componentDidUpdate() {
    this.initGraph();
  }
  render() {
    return (
      <div className="App" onClick={() => console.log(final)}>
        <svg style={{width: '960px', height: '600px'}} ref="refName" ></svg>
      </div>
    );
  }
}

export default App;
