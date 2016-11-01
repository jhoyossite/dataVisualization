    var nuWidth,nuHeight
    var chartWidth, chartHeight
    var obMargin
    var obSvg = d3.select("#graph").append("svg")
    var axisLayer = obSvg.append("g").classed("axisLayer", true)
    var chartLayer = obSvg.append("g").classed("chartLayer", true)
    
    
    var xScale = d3.scaleBand()
        
        
    
    var xInScale = d3.scaleBand();
    
    var yScale = d3.scaleLinear()
    
    var arColor = d3.scaleOrdinal()
        .range(["#FF6D19", "#00B2B0"]);
    
    var metric=2014;

    var loadData = function() {
        metric = document.getElementById('metric').selectedOptions[0].text;
        d3.csv("presupuesto.csv", cast,  main)
        console.log(metric);
    }
    
    function cast(d) {
        Object.keys(d).forEach(function(key){
            if (!isNaN(+d[key])) d[key] = +d[key]
        })
        return d 
    }
    
    function main(data) {
        //console.log(data)
        
        
        var nested = d3.nest()
            .rollup(function(arData){
                //console.log(arData);

                var nuLength = arData.length;

                for (var i = 0; i < nuLength; i++) {
                    if (arData[i].Ano == metric) {
                        delete arData[i].Ano;
                        delete arData[i].Proceso; 
                        return arData[i];
                    }                    
                }
            })
            .key(function(d){ return d.Proceso })
            .entries(data)

        nested = nested.filter(function(element){
            return element.value !== undefined;
        });

        /*for (var j = 0; j < nested.length; j++) {
            if (nested[j].value === null) {
                nested.splice(j,1);
                j--;
            }
        }*/

        nested.forEach(function(d){
            d.age = Object.keys(d.value).map(function(key){
                return {key:key, value:d.value[key]}
            })
        })

        setSize(nested)
        drawAxis()
        drawChart(nested)    
    }
    
    function setSize(nested) {
        nuWidth = 900;//document.querySelector("#graph").clientWidth
        nuHeight = 500;//document.querySelector("#graph").clientHeight
    
        obMargin = {top:0, left:100, bottom:40, right:0 }
        
        
        chartWidth = nuWidth - (obMargin.left+obMargin.right)
        chartHeight = nuHeight - (obMargin.top+obMargin.bottom)
        
        obSvg.attr("width", nuWidth+10)
            .attr("height", nuHeight)
            .attr("class", "sizeSvg")
        
        axisLayer.attr("width", nuWidth+10).attr("height", nuHeight)
        
        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate("+[obMargin.left+10, obMargin.top]+")")
            
        
                
        xScale.domain(nested.map(function(d) { return d.key }))
            .range([0, chartWidth]).paddingInner(0.1)
            
        
        var ageNames = Object.keys(nested[0].value)
        
        xInScale.domain(ageNames).range([0, xScale.bandwidth()])
        
        var yMax = d3.max(nested.map(function(d){
            var values = Object.keys(d.value).map(function(key){
                return d.value[key]
            })
            return d3.max(values)
        }))

        yScale.domain([0, yMax]).range([chartHeight, 0])

            
    }
    
    function drawChart(nested) {
        var t = d3.transition()
            .duration(1000)
            .ease(d3.easeLinear)

        chartLayer.selectAll(".contry").remove()
        var contry = chartLayer.selectAll(".contry")
            .data(nested)
            
        var newCountry = contry.enter().append("g").attr("class", "contry")
        

        contry.merge(newCountry)
            .attr("transform", function(d) { return "translate(" + [xScale(d.key), 0] + ")"; });

        
        var bar = newCountry.selectAll(".barTasks")
            .data(function(d){ return d.age })

        var newBar = bar.enter().append("rect").attr("class", "barTasks")

                        
        bar.merge(newBar)
            .attr("width", xInScale.bandwidth())
            .attr("height", 0)
            .attr("fill", function(d) { return arColor(d.key); })
            .attr("transform", function(d) { return "translate(" + [xInScale(d.key), chartHeight] + ")" })

       bar.merge(newBar).transition(t)
            .attr("height", function(d) { return chartHeight - yScale(d.value); })
            .attr("transform", function(d) { return "translate(" + [xInScale(d.key), yScale(d.value)] + ")" })
    }
    
    function drawAxis(){
        axisLayer.select(".y.axis").remove();
        axisLayer.select(".x.axis").remove();
        var yAxis = d3.axisLeft(yScale)
            .tickSizeInner(-chartWidth)
        
        axisLayer.append("g")
            .attr("transform", "translate("+[obMargin.left, obMargin.top]+")")
            .attr("class", "axis y")
            .call(yAxis);
            
        var xAxis = d3.axisBottom(xScale)
    
        axisLayer.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate("+[obMargin.left, chartHeight]+")")
            .call(xAxis);
        
    }    
    loadData();