 function static_plots() {

 	$.ajax({
    url: "/bidash_hw_audit",
    type: "get",
    datatype: "json",
 //   data: JSON.stringify(data),
 //   headers: {"content-type": "application/json"},
    success: function (response) {


/*        var plLine1 = {
      x: response.data[1], 
      //y: cpu_util, 
      //x: xaxis,
      y: response.data[0],
      //name: 'CPU Util',
      type: 'scatter',
      mode: 'lines',
      line: {shape: 'linear', width: 2}
      
    };
*/

      var plBar0_1 = {
    //x: response.data[1], 
      x: response.data[0], //col_val,
      y: response.data[1], //row_val,
      name: 'BB5216',
      //y: response.data[0],
      //name: 'CPU Util', 
      type: 'bar',
      marker: {
      color: 'rgb(49,130,189)',
      opacity: 0.7,
      }
    };

      var plBar0_2 = {
    //x: response.data[1], 
      x: response.data[0], //col_val,
      y: response.data[1], //row_val1
      name: 'DUS41',
      //y: response.data[0],
      //name: 'CPU Util', 
      type: 'bar',
      marker: {
      color: 'rgb(204,204,204)',
      opacity: 0.5
  }
    };

    	var plBar1 = {
 		//x: response.data[1], 
 		x: ['giraffes', 'orangutans', 'monkeys'],
  		y: [12, 18, 29],
  		//y: response.data[0],
  		//name: 'CPU Util', 
  		type: 'bar'
		};

    	var plBar2 = {
    	x: ['giraffes', 'orangutans', 'monkeys'],
  		y: [20, 19, 39],
 		//x: response.data[1], 
  		//y: response.data[0], 
  		//name: 'CPU Idle',
  		type: 'bar'
		};

		var plBar3 = {
 		x: ['giraffes', 'orangutans', 'monkeys'],
  		y: [22, 38, 49],
 		//x: response.data[1], 
  		//y: response.data[0], 
  		//name: 'CPU Idle',
  		type: 'bar'
		};


      // data assignements to a plotly variable
      //var lineData = [plLine1];
      var barData0 = [plBar0_1,plBar0_2]
    	var barData = [plBar1,plBar2,plBar3];



      //layout generation for above variable
      var layout = {
        title: "Google Volume Vs Stock Price",

        xaxis: {
          title: "Region"
        },
        yaxis: {
          title: "BB5216"
        }

      }

      
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



    	var layoutBar = {
		  title: "HW Audit",
		  barmode: 'group', // can be "stack" also

		  xaxis: {
		    title: "animals"
		  },
		  yaxis: {
		    title: "count"
		  }
		};



		Plotly.newPlot('static_plBarDiv1', barData0, layoutBar0);
    Plotly.newPlot('static_plBarDiv2', barData, layoutBar);
    Plotly.newPlot('static_plBarDiv3', barData, layoutBar);
    Plotly.newPlot('static_plBarDiv4', barData, layoutBar);

    	}, //success closing


 	 error: function (response){

    	}
	}); //closing of first ajax main
   }; //function close



