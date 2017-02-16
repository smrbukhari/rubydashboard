
$(document).ready(function()
{
	var cpu_util = [];
	var cpu_idle = [];
	var date_time = [];
	var mem_usage = [];




//$("#button1").click(function(){
//alert ("Button pressed succ.");

$.ajax({
    url: "/plotly_line_api",
    type: "get",
    datatype: "json",
 //   data: JSON.stringify(data),
 //   headers: {"content-type": "application/json"},
    success: function (response) {
    //	alert ("success")
    	for (i = 0; i < response.data.length; i++) 
    	{
    	 	cpu_idle.push(response.data[i].cpu_idle);
    		cpu_util.push(response.data[i].cpu_util);
    		date_time.push(response.data[i].date_time);
    		mem_usage.push(response.data[i].mem_usage);
    	// 	alert(response.data[i].mem_usage);
    	}




       //Define Plotly varaibles
    	var trace1 = {
 		x: date_time, 
  		y: cpu_util, 
  		name: 'CPU Util',
  		type: 'scatter'
		};

    	var trace2 = {
 		x: date_time, 
  		y: cpu_idle, 
  		name: 'CPU Idle',
  		type: 'scatter'
		};

		var trace3 = {
 		x: date_time, 
  		y: cpu_util, 
  		name: 'CPU Util',
  		type: 'scatter',
  		fill: 'tozeroy',
		};

    	var trace4 = {
 		x: date_time, 
  		y: cpu_idle, 
  		name: 'CPU Idle',
  		type: 'scatter',
  		fill: 'tonexty',
		};



 		var plBar1 = {
 		x: date_time, 
  		y: cpu_util,
  		name: 'CPU Util', 
  		type: 'bar'
		};

    	var plBar2 = {
 		x: date_time, 
  		y: cpu_idle, 
  		name: 'CPU Idle',
  		type: 'bar'
		};


 		var plHBar1 = {
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

		var data = [trace1,trace2];
		var barData = [plBar1,plBar2];
		var hBarData = [plHBar1,plHBar2];
		var areaData = [trace3,trace4];

	   //Define Plotly layout	
		var layout = {
		  title: 'Cpu Stats',

		  xaxis: {
		    title: 'Time'
		  },
		  yaxis: {
		    title: 'CPU Util'
		  }
		};

		var layoutBar = {
		  title: 'Cpu Stats',
		  barmode: 'stack',

		  xaxis: {
		    title: 'Time'
		  },
		  yaxis: {
		    title: 'CPU Util'
		  }
		};

		var layoutHBar = {
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

		
		//Plot Plotly graphs
		Plotly.newPlot('plLineDiv', data, layout);
		Plotly.newPlot('plLineDiv1', barData, layoutBar);
		Plotly.newPlot('plLineDiv2', hBarData, layoutHBar);
		Plotly.newPlot('plPieDiv', plPie, layoutPie);
		Plotly.newPlot('plAreaDiv', areaData, layout);
	    },  //closing of first ajax body
     
     error: function (response){

    }
}); //closing of first ajax main




 

}); //closing document.ready


