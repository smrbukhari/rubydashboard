function plotlyBarChart(response) {
var plBar0_1 = {
    //x: response.data[1], 
      x: response.data.x_axis, //col_val,
      y: response.data.y_axis, //row_val,
      name: response.data.chart_label,
      //y: response.data[0],
      //name: 'CPU Util', 
      type: 'bar',
      marker: {
      color: 'rgb(128,0,0)',
      opacity: 0.7,
      }
    };

var barData0 = [plBar0_1]

var layoutBar0 = {
      title: response.data.chart_label,
      barmode: 'group', // can be "stack" also
      //showlegend: true,
      //legend: {
      //  x: 0.2,
      //  y: 0.5,

      //},
      xaxis: {
        title: $('#filter1').val(),
        titlefont: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
      yaxis: {
        title: "Count of " + $('#filter2').val(),
        titlefont: {
          family: 'Courier New, monospace',  
          size: 16,
          color: '#7f7f7f'
        },
      }
};

Plotly.newPlot('static_plBarDiv1', barData0, layoutBar0);

};