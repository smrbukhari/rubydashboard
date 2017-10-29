class DemoController < ApplicationController
	def index 
		@test_array = []
		@test = SysmonTest.select('cpu_util, cpu_idle, date_time').order('date_time asc').limit(100)
		@pie_cht = SysmonTest.select('id, mem_usage').limit(5)
		start_date = DateTime.parse('2015-01-01 00:00:00')
		end_date = DateTime.parse('2016-01-01 00:00:00')
		@colmn_cht = SysmonTest.select('date_time, cpu_util').where('date_time >= ? AND date_time < ?',start_date,end_date)
		@barr_cht = SysmonTest.select('date_time, cpu_util').where('date_time >= ? AND date_time < ?',start_date,end_date)
		@skat_data = SysmonTest.select('cpu_util, cpu_idle, date_time').order('date_time asc').limit(20)
		start_date_mlc = DateTime.parse('2016-01-01 00:00:00')
		end_date_mlc = DateTime.parse('2016-01-30 00:00:00')
		@mlc_util = SysmonTest.select('cpu_util').where('date_time >= ? AND date_time < ?',start_date_mlc,end_date_mlc)
		@mlc_idle = SysmonTest.select('cpu_idle').where('date_time >= ? AND date_time < ?',start_date_mlc,end_date_mlc)
		for i in @test
		end

	end

	def bi_dashboard


	end

	def bi_dashboard_hw_audit

		column_names = []
		row_names = []
		#static_collection = "Sample_HW_Audit"
		static_collection = "HW_Audit_Manual"
	    #result = client[static_collection].find().limit(300) do |key, value|
	    client[static_collection].find().limit(1).each do |document|
	    #client[static_collection].find(:Region => "Pacific", :ProductName => "PDU0104").each do |document|
	    	document.each do |key, value|
	    		column_names << key
	    	#	row_names << value
	    	end
	    end
	    
	    #byebug
	    render json:{data: column_names}, status:200
	    #render json:{data: [column_names, row_names]}, status:200

	end

	def static_plot_generation

		result = []
		label_data = []
		static_collection = "HW_Audit_Manual"
		filter1_match = { '$match'=> { params[:filter1]=> { '$in' => params[:filter1_option] } } }
		filter2_match = { '$match'=> { params[:filter2]=> { '$in' => params[:filter2_option] } } }
		unwind = { '$unwind'=> "$#{params[:filter3]}"}
		group_by = { '$group'=> { '_id'=> "$#{params[:filter3]}" , "Product(s)"=> { '$sum'=> 1 } } }
		group_by_with_addtoset = { '$group'=> { '_id'=> '$Submarket', 'uniqueCount' => { '$addToSet' => { params[:filter4] => "$#{params[:filter4]}", params[:filter2] => "$#{params[:filter2]}" } }, "Product(s)" => { '$sum'=> 1 } } }
		project = { '$project' => { 'uniqueNodeNameCount' => { '$size' => '$uniqueCount' } }}
		sort_asc = {'$sort' => {'_id' => 1} } 

    aggregate_pipeline = []
    aggregate_pipeline << filter1_match  
    aggregate_pipeline << filter2_match 
    aggregate_pipeline << unwind

    if params[:filter4] != 'AddToSet' 
    	aggregate_pipeline << group_by_with_addtoset
    	aggregate_pipeline << project
    else 
    	aggregate_pipeline << group_by
    end

    aggregate_pipeline << sort_asc	
		result = client[static_collection].aggregate(aggregate_pipeline)

		
		result.each {|item| label_data << item }
		x_axis_data = []
		y_axis_data = []
		label_data.each do |item|
			x_axis_data << item["_id"]
			y_axis_data << item[item.keys[1]]
			#byebug
		end
		
		#byebug
		render json: { data: { x_axis: x_axis_data, y_axis: y_axis_data, chart_label: label_data.first.keys[1] }}, status: 200
	#rescue NoMethodError => e
		#byebug
	#	render json: {error: e, data1: e}, status: :bad_request 
	end

	def filter_sub_options
		result = []
		static_collection = "HW_Audit_Manual"
		result = client[static_collection].find.distinct(params[:filter])
		render json: {data: result}, status: 200
	end



	def line_chart_data
		#test = SysmonTest.select('cpu_util, cpu_idle, date_time', 'mem_usage').order('date_time asc').limit(20)
		qq = params["lastcollection_name"]
		ss = params["colname"]
		rr = params["rowname"]
		
		
		client_host = ['localhost:27017']
		client_options = {
  				database: 'development',
  				user: 'mydbuser',
  				password: 'dbuser'
						}
	    client = Mongo::Client.new(client_host, client_options)
	    #byebug
	    col_data = []
	    row_data = []
		counter = 0
		#doc_arr = []
		#byebug
	    client[qq].find().each do |document| 
	    	doc_arr = []
		   	r = document[ss]
			col_data << document
			counter = counter + 1

		    #byebug

		end # document end
	#	byebug
		render json:{data:counter}, status:200
	end

	def map_data
		all_tweet = Tweet.only(:id, :created_at, :coordinates)
		tweet = all_tweet.first
		testmap = Testmap.select('applicant, latitude, longitude')
		render json:{data:[testmap,tweet]}, status:200
	end

	def pie_chart_data
		testpie = SysmonTest.select('id, mem_usage').limit(5)
		render json:{data:testpie}, status:200
	end
end
