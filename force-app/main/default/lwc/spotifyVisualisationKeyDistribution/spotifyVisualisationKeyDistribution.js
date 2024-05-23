import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import D3 from '@salesforce/resourceUrl/D3_min';
import STYLES from '@salesforce/resourceUrl/styles';

export default class SpotifyVisualisationKeyDistribution extends LightningElement {
         svgWidth      = 450;
         svgHeight     = 300;
         d3Initialized = false;
    @api analysis      = [];

    renderedCallback() {
        if (this.d3Initialized) {
            return;
        }

        Promise.all([loadScript(this, D3), loadStyle(this, STYLES)])
            .then(() => {
                this.initializeD3(this.analysis);
                console.log(this.analysis);
            })
            .catch(error => {
                this.handleError(error);
            });

        this.d3Initialized = true;
    }

    initializeD3(data) {
        data = JSON.parse(data);
        const svgElement = this.template.querySelector('svg');
        const svg = d3.select(svgElement);
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = this.svgWidth - margin.left - margin.right;
        const height = this.svgHeight - margin.top - margin.bottom;
        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    
        // Scales
        const x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .domain(data.map(d => d.key));
        const y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, d3.max(data, d => d.frequency)]);
    
        // Zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .extent([[margin.left, 0], [width - margin.right, height]])
            .on('zoom', zoomed);
    
        // Apply the zoom behavior to the SVG element
        svg.call(zoom);
    
        // Append bars
        g.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.key))
            .attr('y', d => y(d.frequency))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.frequency));
    
        // Append axes
        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));
        g.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y));
    
        function zoomed(event) {
            // Create new scale objects based on event
            const newX = event.transform.rescaleX(x);
            const newY = event.transform.rescaleY(y);
    
            // Update axes
            g.select('.axis--x').call(d3.axisBottom(newX));
            g.select('.axis--y').call(d3.axisLeft(newY));
    
            // Update bars
            g.selectAll('.bar')
                .attr('x', d => newX(d.key))
                .attr('width', newX.bandwidth())
                .attr('y', d => newY(d.frequency))
                .attr('height', d => height - newY(d.frequency));
        }
    }
    
    handleError(error) {
        console.error('Error:', error);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading D3 or data',
                message: error.message,
                variant: 'error',
            }),
        );
    }
}