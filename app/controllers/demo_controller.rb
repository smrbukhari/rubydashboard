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

		static_collection = "Sample_HW_Audit"
		col_val = []
		row_val = []
		row_data = []
		col_val1 = []
		row_val1 = []
		row_data1 = []
		filter_name = "dummy" 
		filter_two = "dummy1"
		ss = "region"  #Column Name
		rr = "productname" #Row Name
		#qq = "Pacific"  #2nd Row Name
		pp = "RRUS11B13"
		counter = 0
		client_host = ['localhost:27017']
		client_options = {
  				database: 'development',
  				user: 'mydbuser',
  				password: 'dbuser'
						}
	    client = Mongo::Client.new(client_host, client_options)

	    client[static_collection].find().each do |document| 
	    	#byebug
	    	if document[rr] == pp
	    		#byebug
	    		document.each do |key,value|

	    			#byebug
						
					
					if key == ss #and value == qq
						r = filter_name
						if not col_val.include? value

							col_val << value
							if counter != 0
							   row_val << counter	
						    end
							counter = 0
						end


						
						
					end	  
					
					#if key == rr
					#row_val << value
					#end    
					#if key == qq
					#row_val1 << value
					#end  	
				end

			counter = counter + 1
			
			end

			
			
	    end

	    #col_val1 = col_val
	    #row_val1 = row_val

	    #render json:{data:"success"}, status:200
	    render json:{data:[col_val, row_val,col_val,row_val1]}, status:200

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
