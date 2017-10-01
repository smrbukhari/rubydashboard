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
      color: 'rgb(49,130,189)',
      opacity: 0.7,
      }
    };

var barData0 = [plBar0_1]

var layoutBar0 = {
      title: "HW Audit",
      barmode: 'group', // can be "stack" also

      xaxis: {
        title: "Region",
        titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      },
      yaxis: {
        title: "Count of DU"
      },

      
    }
    };

Plotly.newPlot('static_plBarDiv1', barData0, layoutBar0);

};