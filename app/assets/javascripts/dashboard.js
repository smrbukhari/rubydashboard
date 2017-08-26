

   function plotly_function(colname,rowname,lastcollection) {

   	var col_array = [];
	var row_array = [];
	//var date_time = [];
	//var mem_usage = [];



//$("#button1").click(function(){
//alert ("Button pressed succ.");

$.ajax({
    url: "/plotly_line_api?lastcollection_name=" + lastcollection + "&colname="+ colname + "&rowname=" + rowname,
    type: "get",
    datatype: "json",
 //   data: JSON.stringify(data),
 //   headers: {"content-type": "application/json"},
    success: function (response) {
    	//alert ("success")

    	/*for (i = 0; i < response.data.length; i++)
    	{ */
    	 /*	cpu_idle.push(response.data[i].cpu_idle);
    		cpu_util.push(response.data[i].cpu_util);
    		date_time.push(response.data[i].date_time);
    		mem_usage.push(response.data[i].mem_usage);*/
    	//	alert(response.data[i].mem_usage);

    	//}
    	//alert("colname:" + colname + "  " + "rowname:" + rowname+ "  " + lastcollection)
     //   alert ("success");
     var x_axis = [];
     var y_axis = [];
     response.data.forEach(function(item) {
       x_axis.push(item[0]);
       item[1].forEach(function(second_item) {
         y_axis.push(second_item);
       })
     })
       //Define Plotly varaibles
    	var plLine1 = {
 		x: x_axis,
  		y: y_axis,
  		//name: 'CPU Util',
  		type: 'scatter',
  		mode: 'lines',
  		line: {shape: 'linear', width: 2}

		};

    // 	var plLine2 = {
 	// 	x: response.data[1],
  	// 	y: response.data[0],
  	// 	//name: 'CPU Idle',
  	// 	type: 'scatter',
  	// 	mode: 'lines',
  	// 	line: { dash: 'dot',width: 2}
		// };

		var plArea1 = {
 		x: x_axis,
  		y: y_axis,
  		//name: 'CPU Util',
  		type: 'scatter',
  		fill: 'tozeroy',

		};

		/*
    	var plArea2 = {
 		x: response.data[1],
  		y: response.data[0],
  		//name: 'CPU Idle',
  		type: 'scatter',
  		fill: 'tonexty'
		};


		var plScat1 = {
 		x: cpu_util,
  		y: cpu_idle,
  		name: 'CPU Util',
  		type: 'scatter',

		};

    	var plScat2 = {
 		x: date_time,
  		y: cpu_idle,
  		name: 'CPU Idle',
  		type: 'scatter',
  		fill: 'tonexty',
		};*/



 		var plBar1 = {
 		x: x_axis,
  		y: y_axis,
  		//name: 'CPU Util',
  		type: 'bar'
		};

    	/*var plBar2 = {
 		x: x_axis,
  		y: y_axis,
  		//name: 'CPU Idle',
  		type: 'bar'
		};*/


 	/*	var plHBar1 = {
 		x: cpu_util,
 		y: date_time,
  		type: 'bar',
  		name: 'CPU Util',
  		orientation: 'h'
		};

    	var plHBar2 = {
 		x: cpu_idle,
 		y: date_time,
  		type: 'bar',
  		name: 'CPU Idle',
  		orientation: 'h'
		};

		var plPie = [{   //[] braces are absolutely required for pie chart :S
  		values: mem_usage,
  		labels: ['Xorg', 'top', 'init','ruby','firefox','Xorg1', 'top1', 'init1','ruby1','firefox1'],
  		type: 'pie'
		}];
*/
		// var lineData = [plLine1,plLine2];
    	var lineData = [plLine1];
		//var barData = [plBar1,plBar2];
		var barData = [plBar1];
		//var hBarData = [plHBar1,plHBar2];
		//var areaData = [plArea1,plArea2];
		var areaData = [plArea1];
		//var scatData = [plScat1];

	   //Define Plotly layout
		var layout = {
		  title: lastcollection,

		  xaxis: {
		    title: rowname
		  },
		  yaxis: {
		    title: colname
		  }

		};

		var layoutBar = {
		  title: lastcollection,
		  barmode: 'stack',

		  xaxis: {
		    title: rowname
		  },
		  yaxis: {
		    title: colname
		  }
		};

		/*var layoutHBar = {
		  title: 'Cpu Stats',
		  barmode: 'stack',

		  xaxis: {
		    title: 'CPU Idle/Util'
		  },
		  yaxis: {
		    title: 'Time'
		  }
		};



	var layoutPie = {
		  title: 'Memory Usage by App',
		  showlegend:true,
		  legend: {"orientation": "h"}


		};

	var layoutScatter = {
		  title: 'Cpu Stats',


		  xaxis: {
		    title: 'CPU Util'
		  },
		  yaxis: {
		    title: 'CPU Idle'
		  }
		};	*/

		//Plot Plotly graphs
		Plotly.newPlot('plLineDiv', lineData, layout);
		Plotly.newPlot('plBarDiv', barData, layoutBar);
		//Plotly.newPlot('plBarDivH', hBarData, layoutHBar);
		//Plotly.newPlot('plPieDiv', plPie, layoutPie);
		Plotly.newPlot('plAreaDiv', areaData, layout);
		//Plotly.newPlot('plScatterDiv', scatData, layoutScatter);
		//alert ("success");
	    },  //closing of first ajax body

     error: function (response){

    }
}); //closing of first ajax main


   }; //function close
