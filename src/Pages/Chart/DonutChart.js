import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './chart.css';

const DonutChart = ({ data }) => {
    const ref = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        const width = 300;
        const height = 300;
        const innerRadius = 90;
        const outerRadius = 120;

        const svg = d3.select(ref.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const colorMap = {
            'Issued': '#006666', // Ensure proper RGBA format
            'Redeemed': '#ffae1a',
            'Total Loyalty Points': '#fe6a49',
        };

        const pie = d3.pie().value(d => d.value);
        const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

        const arcs = svg.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc')

        arcs.append('path')
            .attr('d', arc)
            // .attr('fill', (d, i) => color(i));
            .attr('fill', d => colorMap[d.data.label] || 'gray')
            .on('mouseover', (event, d) => {
                const tooltip = d3.select(tooltipRef.current)
                tooltip.style('visibility', 'visible')
                    .text(`${d.data.label}: ${d.data.value}`)
                    .style('top', `${event.pageY - 10}px`)
                    .style('left', `${event.pageX + 10}px`);
            })
            .on('mousemove', (event) => {
                d3.select(tooltipRef.current)
                    .style('top', `${event.pageY - 10}px`)
                    .style('left', `${event.pageX + 10}px`);
            })
            .on('mouseout', () => {
                d3.select(tooltipRef.current).style('visibility', 'hidden');
            });

        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '.35em')
            .style('font-size', '14px')
            .style('text-anchor', 'middle')
            .style('fill', 'white')
        // .text(d => d.data.label);
    }, [data]);

    return (
        <>
            <svg ref={ref} className="donut-chart"></svg>
            <div ref={tooltipRef} className="tooltip_donut"></div>
        </>
    );
};

export default DonutChart;