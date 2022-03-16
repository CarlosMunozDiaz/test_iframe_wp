let tooltip = d3.select('#chartTooltip');

//Variables para colores
let one_color = '#005578';
let two_colors_first = '#FFB612', two_colors_second = '#005578';
let three_colors_first = '#FFB612', three_colors_second = '#005578', three_colors_third = '#9B918B';
let more_colors_first = '#FFB612', more_colors_second = '#7B96AA', more_colors_third = '#005578', more_colors_fourth = '#9B918B', more_colors_fifth = '#5F5C59';

function getEighteenthChart() {
    //Bloque de la visualización
    let chartBlock = d3.select('#chart-eighteen');

    //Lectura de datos
    let driveFile = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTwwEw1toOPxVQ_DRPCMC5Xd_eW_kmhGQrtm9pJ5P2Ja8auGT-ITZ1772aiNHAZKI-0P0Nq8GopCyOV/pub?gid=845969318&single=true&output=csv';
    
    d3.csv(driveFile, function(d) {
        return {
            Fecha: d.Fecha,
            Promedio: +d['Promedio'].replace(/,/g, '.'),            
            'Software_y_Servicios_IT': +d['Software y Servicios IT'].replace(/,/g, '.'),
            'Sin_fines_de_lucro': +d['Sin fines de lucro'].replace(/,/g, '.'),
            'Finanzas': +d['Finanzas'].replace(/,/g, '.'),
            'Comercio_al_menudeo': +d['Comercio al menudeo'].replace(/,/g, '.'),            
            'Salud': +d['Salud'].replace(/,/g, '.'),
            'Transporte_y_Logística': +d['Transporte y Logística'].replace(/,/g, '.'),
            'Medios_y_comunicación': +d['Medios y comunicación'].replace(/,/g, '.'),
            'Bienestar_y_salud': +d['Bienestar y salud'].replace(/,/g, '.'),
            'Bienes_raíces': +d['Bienes raíces'].replace(/,/g, '.'),
            'Servicios_corporativos': +d['Servicios corporativos'].replace(/,/g, '.'),
            'Agricultura': +d['Agricultura'].replace(/,/g, '.'),
            'Construcción': +d['Construcción'].replace(/,/g, '.'),
            'Bienes_de_consumo': +d['Bienes de consumo'].replace(/,/g, '.'),
            'Hardware_y_redes': +d['Hardware y redes'].replace(/,/g, '.'),
            'Legal': +d['Legal'].replace(/,/g, '.'),
            'Manufactura': +d['Manufactura'].replace(/,/g, '.'),
            'Energía_y_minas': +d['Energía y minas'].replace(/,/g, '.'),
            'Entretenimiento': +d['Entretenimiento'].replace(/,/g, '.'),
            'Diseño': +d['Diseño'].replace(/,/g, '.'),
            'Administración_pública': +d['Administración pública'].replace(/,/g, '.'),
            'Educación': +d['Educación'].replace(/,/g, '.'),
            'Recreación_y_viajes': +d['Recreación y viajes'].replace(/,/g, '.')
        }
    }, function(error, data) {
        if (error) throw error;
        
        //Creación del elemento SVG en el contenedor
        let margin = {top: 5, right: 10, bottom: 25, left: 25};
        let {width, height, chart} = setChart(chartBlock, margin);

        //Disposición del eje X
        let x = d3.scaleBand()
            .domain(data.map(function(d) { return d.Fecha }))
            .range([0, width])
            .paddingInner(0.75);

        //Estilos para eje X
        let xAxis = function(g){
            g.call(d3.axisBottom(x).tickValues(x.domain().filter(function(d,i){ return !(i%3)})))
            g.call(function(g){
                g.selectAll('.tick line')
                    .attr('y1', '0%')
                    .attr('y2', `-${height}`)
            })
            g.call(function(g){g.select('.domain').remove()});
        }
        
        //Inicialización eje X
        chart.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //Disposición del eje Y
        let y = d3.scaleLinear()
            .domain([0,4])
            .range([height,0])
            .nice();
    
        let yAxis = function(svg){
            svg.call(d3.axisLeft(y).ticks(4).tickFormat(function(d) { return d.toString().replace(/\./g, ',') + '%'; }))
            svg.call(function(g){
                g.selectAll('.tick line')
                    .attr('class', function(d,i) {
                        if (d == 0) {
                            return 'line-special';
                        }
                    })
                    .attr("x1", `${x.bandwidth() / 2}`)
                    .attr("x2", `${width - x.bandwidth() / 2}`)
            })
            svg.call(function(g){g.select('.domain').remove()})
        }
        
        chart.append("g")
            .call(yAxis);

        let lines = [];
        let columns = data.columns.slice(1);
        for(let i = 0; i < columns.length; i++) {
            let aux = {lineName: `${columns[i].replace(/\s/g, '_')}`, xAxis: 'Fecha', cssName: `${columns[i].replace(/\s/g, '_')}`};
            lines.push(aux);
        }

        //Ordenar con Promedio primero
        let promedio = lines.slice(12,13);
        let aux = [...lines];
        aux.splice(12, 1);
        let newLines = [...promedio, ...aux];

        let currentIndustry = 'null';

        initChart(newLines);

        function initChart(lines) {
            for(let i = 0; i < lines.length; i++) {
                let line = d3.line()
                    .x(function(d) { return x(d[lines[i].xAxis]) + x.bandwidth() / 2; })
                    .y(function(d) { return y(d[lines[i].lineName]); });

                if(lines[i].lineName == 'Promedio') {
                    
                    //Línea real
                    let path = chart.append("path")
                        .data([data])
                        .attr("class", `line-${lines[i].cssName}`)
                        .attr("fill", "none")
                        .attr("stroke", two_colors_first)
                        .attr("stroke-width", "1.5px")
                        .attr("d", line)
                        .on('mouseenter mousedown mousemove mouseover', function(d,i,e) {
                            //Posibilidad visualización línea diferente            
                            let currentLine = e[i];
            
                            currentLine.style.opacity = '1';
                            currentLine.style.strokeWidth = '3.5px';
                        })
                        .on('mouseout', function(d,i,e) {
                            //Quitamos los estilos de la línea
                            let currentLine = e[i];
                            currentLine.style.strokeWidth = '1.5px';
                        });
        
                    let length = path.node().getTotalLength();
            
                    path.attr("stroke-dasharray", length + " " + length)
                        .attr("stroke-dashoffset", length)
                        .transition()
                        .ease(d3.easeLinear)
                        .attr("stroke-dashoffset", 0)
                        .duration(4500);
        
                    chart.selectAll('.circles')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr('class', `circle-${lines[i].cssName}`)
                        .attr("r", 5)
                        .attr("cx", function(d) { return x(d[lines[i].xAxis]) + x.bandwidth() / 2; })
                        .attr("cy", function(d) { return y(d[lines[i].lineName]); })
                        .style("fill", '#000')
                        .style('opacity', '0')
                        .on('mouseenter mousedown mousemove mouseover', function(d, i, e) {
                            let css = e[i].getAttribute('class').split('-')[1];
            
                            //Texto
                            let html = `<p class="chart__tooltip--title">${d.Fecha}</p>
                                <p class="chart__tooltip--text">${css.replace(/\_/g, ' ')}: ${numberWithCommas(d[css])}%</p>`;
            
                            tooltip.html(html);
            
                            //Posibilidad visualización línea diferente
                            let currentLine = chartBlock.select(`.line-${css}`);
                            currentLine.style('stroke-width','3.5px');
            
                            //Tooltip
                            positionTooltip(window.event, tooltip);
                            getInTooltip(tooltip);               
                        })
                        .on('mouseout', function(d, i, e) {
                            //Quitamos los estilos de la línea
                            let css = e[i].getAttribute('class').split('-')[1];
                            let currentLine = chartBlock.select(`.line-${css}`);
                            currentLine.style('stroke-width','1.5px');
            
                            //Quitamos el tooltip
                            getOutTooltip(tooltip);                
                        });

                } else {

                    let path = chart.append("path")
                    .data([data])
                    .attr("class", `line line-${lines[i].cssName}`)
                    .attr("fill", "none")
                    .attr("stroke", `#081C29`)
                    .attr("stroke-width", '0px')
                    .attr("d", line)
                    .on('mouseenter mousedown mousemove mouseover', function(d,i,e) {
                        //Posibilidad visualización línea diferente            
                        let currentLine = e[i];
        
                        currentLine.style.opacity = '1';
                        currentLine.style.strokeWidth = '3.5px';
                    })
                    .on('mouseout', function(d,i,e) {
                        //Quitamos los estilos de la línea
                        let currentLine = e[i];
                        currentLine.style.strokeWidth = '1.5px';
                    });
        
                let length = path.node().getTotalLength();
        
                path.attr("stroke-dasharray", length + " " + length)
                    .attr("stroke-dashoffset", length)
                    .transition()
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0)
                    .duration(4500)
        
                chart.selectAll('.circles')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('class', `circle-${lines[i].cssName}`)
                    .attr("r", 5)
                    .attr("cx", function(d) { return x(d[lines[i].xAxis]) + x.bandwidth() / 2; })
                    .attr("cy", function(d) { return y(d[lines[i].lineName]); })
                    .style("fill", 'none')
                    .style('opacity', '0')
                    .on('mouseenter mousedown mousemove mouseover', function(d, i, e) {
                        let css = e[i].getAttribute('class').split('-')[1];
        
                        //Texto
                        let html = `<p class="chart__tooltip--title">${d.Fecha}</p>
                                    <p class="chart__tooltip--text">${css.replace(/\_/g, ' ')}: ${numberWithCommas(d[css])}%</p>`;
        
                        tooltip.html(html);
        
                        //Posibilidad visualización línea diferente
                        let currentLine = chartBlock.select(`.line-${css}`);
                        currentLine.style('stroke-width','3.5px');

                        //Tooltip
                        positionTooltip(window.event, tooltip);
                        getInTooltip(tooltip);               
                    })
                    .on('mouseout', function(d, i, e) {
                        //Quitamos los estilos de la línea
                        let css = e[i].getAttribute('class').split('-')[1];
        
                        //Posibilidad visualización línea diferente
                        let currentLine = chartBlock.select(`.line-${css}`);
                        currentLine.style('stroke-width','1.5px');

                        //Quitamos el tooltip
                        getOutTooltip(tooltip);                
                    });

                }               
            }
        }

        //Se actualiza con el país seleccionado
        function updateChart(currentIndustry, industry) {
            if(currentIndustry != 'null') {
                let formerLine = chartBlock.select(`.line-${currentIndustry}`);
                let formerCircles = chartBlock.selectAll(`.circle-${currentIndustry}`);

                formerLine.style('stroke-width','0px');
                formerCircles.each(function() {
                    this.style.fill = 'none';
                });
            }            

            //Tras ello, damos nuevos estilos al país seleccionado >> Si es null, sólo mostramos 'Promedio'
            if(industry != 'null') {
                let line = chartBlock.select(`.line-${industry}`);
                let circles = chartBlock.selectAll(`.circle-${industry}`);

                line.style('stroke-width','1.5px');
                circles.each(function() {
                    this.style.fill = '#000';
                });
            }
        }

        document.getElementById('empleoEighteen').addEventListener('change', function(e) {
            let auxIndustry = currentIndustry;
            currentIndustry = e.target.value;
            
            updateChart(auxIndustry, currentIndustry);            
        });

    });
}
getEighteenthChart();
// PRUEBA SCROLL PARA INICIAR ANIMACIÓN CUANDO ENTRE
let charts = document.getElementsByClassName('chart__viz');

/* Inicialización del gráfico */
function setChart(chartBlock, margin) {
    let width = parseInt(chartBlock.style('width')) - margin.left - margin.right,
    height = parseInt(chartBlock.style('height')) - margin.top - margin.bottom;

    let chart = chartBlock
        .append('svg')
        .lower()
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return {margin, width, height, chart};
}

function numberWithCommas(x) {
    //return x.toString().replace(/\./g, ',').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
    return x.toString().replace(/\./g, ',');
}