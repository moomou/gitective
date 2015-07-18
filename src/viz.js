import React from 'react';
import _und from 'lodash';
import d3 from 'd3';
import moment from 'moment';

import Tip from './comp/Tip';

import '../sass/style.scss';

const TODAY = new Date();
const BROWSER_WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const MOBILE_WIDTH = BROWSER_WIDTH < 1024;

const width = 960;
const height = 210;
const cellSize = 17;
const weekdays = moment.weekdays();
const heatMapClass = d3.range(11).map((d) => 'q' + d + '-11' );
const currentMonthClass = (d) => d.getMonth() === TODAY.getMonth() ? 'current-month' : '';

const monthBlockSize = width / 12;
const currentMonthOffset = TODAY.getMonth() * monthBlockSize - 100;

const percent = d3.format('.1%');
const format = d3.time.format('%Y-%m-%d');

let gradeLevel = null;

function grade(work) {
  // not loaded yet
  if (!gradeLevel) return '';
  if (work >= gradeLevel.s) return 'S';
  if (work >= gradeLevel.a) return 'A';
  if (work >= gradeLevel.b) return 'B';
  if (work >= gradeLevel.c) return 'C';
  return 'F';
}

function monthPath(t0) {
  let t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0);
  let d0 = t0.getDay();
  let w0 = d3.time.weekOfYear(t0);
  let d1 = t1.getDay();
  let w1 = d3.time.weekOfYear(t1);
  return 'M' + (w0 + 1) * cellSize + ',' + d0 * cellSize
      + 'H' + w0 * cellSize + 'V' + 7 * cellSize
      + 'H' + w1 * cellSize + 'V' + (d1 + 1) * cellSize
      + 'H' + (w1 + 1) * cellSize + 'V' + 0
      + 'H' + (w0 + 1) * cellSize + 'Z';
}

function monthLabelOffset(t0) {
  // start at 1
  let prevMonth = moment(t0).subtract(1, 'month').endOf('month');
  // starts at 0
  let w0 = d3.time.weekOfYear(t0);
  return (w0 * cellSize) + cellSize * ((prevMonth.week() === w0 + 1) ? 1 : 0);
}

let svg = d3.select('#viz').selectAll('svg')
    .data([TODAY.getFullYear()])
  .enter().append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'RdYlGn')
  .append('g')
    .attr('transform', () => {
      return 'translate(' + ((width - cellSize * 53) / 2) + ',' + (height - cellSize * 9 - 1) + ')';
    });

svg.selectAll('text')
    .data(d3.range(7))
  .enter().append('text')
    .filter((d) => d % 2)
    .attr('transform', (d) => 'translate(-15,' + (parseInt(d, 10) * (cellSize) + 15) + ')')
    .style('text-anchor', 'middle')
    .text((d) => weekdays[d].charAt(0));

let dayGroup = svg.selectAll('.day')
    .data((d) => d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
  .enter().append('g');

let rect = dayGroup
  .append('rect')
    .attr('class', (d) => 'day ' + currentMonthClass(d))
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('x', (d) => d3.time.weekOfYear(d) * cellSize)
    .attr('y', (d) => d.getDay() * cellSize)
    .datum(format);

let rectTxt = dayGroup
  .append('text')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('x', (d) => d3.time.weekOfYear(d) * cellSize + 4)
    .attr('y', (d) => d.getDay() * (17) + 15)
    .datum(format);

// month path
svg.selectAll('.month')
  .data((d) => d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
  .enter().append('path')
    .attr('class', 'month')
    .attr('d', monthPath);

// month label
svg.selectAll('.month-label')
  .data((d) => d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
  .enter().append('text')
    .attr('x', monthLabelOffset)
    .attr('y', -5)
    .text((d) => d3.time.format('%b')(d));

// Heat map guide
svg.selectAll('.viz-guide')
  .append('g')
  .data(d3.range(11))
  .enter().append('rect')
    .attr('class', (d) => heatMapClass[d])
    .attr('width', cellSize)
    .attr('height', cellSize / 2)
    .attr('x', (d) => d * (cellSize + 1) + 705)
    .attr('y', 130);

// Year guide
svg.append('text')
  .attr('y', 140)
  .text(TODAY.getFullYear());

d3.select(self.frameElement).style('height', '2910px');

export function updateGrading(newGrading) {
  gradeLevel = Object.keys(newGrading).reduce((acc, k) => {
    acc[k] = parseInt(newGrading[k], 10);
    return acc;
  }, {});
}

export function visualize(inputData, tracks) {
  if (!inputData) return;

  let max = Number.NEGATIVE_INFINITY;
  let data = Object.keys(inputData).reduce((acc, date) => {
    acc[date] = _und.chain(inputData[date]).values().sum().value();
    if (acc[date] > max) max = acc[date];
    return acc;
  }, {});

  let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html((d) => {
      return React.renderToStaticMarkup(<Tip date={d} details={inputData[d]} tracks={tracks}/>);
    });

  let color = d3.scale.quantize()
    .domain([0, gradeLevel && gradeLevel.s || 10])
    .range(heatMapClass);

  svg.call(tip);

  rectTxt.filter((d) => d in data)
    .attr('class', (d) => 'g-' + grade(data[d]))
    .text((d) => grade(data[d]))
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  rect.filter((d) => d in data)
    .attr('class', (d) => 'day ' + color(data[d]) + ' ' + currentMonthClass(new Date(d)))
      .select('title')
    .text((d) => d + ': ' + percent(data[d]));
}

export function getMonthScrollOffset() {
  return currentMonthOffset;
}
