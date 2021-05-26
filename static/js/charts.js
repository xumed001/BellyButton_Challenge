function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// d3.json("samples.json").then(function(data){
//   console.log(data);
// });

//1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("data/samples.json").then((data) => {
    console.log(data)
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    //console.log(samplesArray);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samplesArray.filter(x => x.id === sample)
    console.log(filteredSample)
    //console.log(filteredSample[0].sample_values);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSample[0]
    console.log(firstSample)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sotuIds = firstSample.otu_ids
    var sotuLabels = firstSample.otu_labels
    var sampleValues = firstSample.sample_values
 
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var values = sampleValues.slice(0,10);
    var ids = sotuIds.slice(0,10);
    var labels = sotuLabels.slice(0,10);


    function buildyticks(){
      result=[]
      for (let x of ids) {
        a = `OTU ID-${x}`
        result.push(a)
      }
      return result
    };

    function buildBar() {
      out = {x:-1,y:-1,type:""}
      yticks = buildyticks()

      return [{
        x: values.reverse(),
        y: yticks.reverse(),
        type: 'bar',
        orientation: 'h',
        text: labels
      }]
    };
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      paper_bgcolor: "rgb(255, 254, 242, 1)",
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: {
        l: 150,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      }
    };

    var barData = buildBar();
    Plotly.newPlot("bar", barData, barLayout);
    
    // Create the trace for the bubble chart.
    var bubbleData = {
      x: sotuIds,
      y: sampleValues,
      text: sotuLabels,
      mode: 'markers',
      marker: {
        color: sotuIds,
        size: sampleValues
      }
    };

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Culltures Pre Sample',
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    };

    // D2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout);
    
    // // 4. Create the trace for the gauge chart.

    var metaData = data.metadata
    var washArr = metaData.filter(x => x.id == sample);
    var wFirst = washArr[0].wfreq

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wFirst,
        title: { text: "Belly Button Washing Frequency <br> Scrubs per Week"}, 
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10], tickwidth: 2, tickcolor: "black" },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ],}
      }];
    
    // // 5. Create the layout for the gauge chart.
    var glayout = { width: 500, height: 500, margin: { t: 0, b: 0 }, paper_bgcolor: "rgb(255, 254, 242, 1)" }

    Plotly.newPlot('gauge', gaugeData, glayout);
    // Belly Button Washing Frequency
  });
}

