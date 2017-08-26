# backend programming puts more load on the server side
# front end javascripts loads more data
# on the client
# use rails c to verify syntax
# use byebug to catch values and debug

require 'csv'
require 'json'
require 'date'

	class AnalyticsController < ApplicationController
	before_action :authenticate_user!
	def index
		@first_value = Tweet.first #use @ when variable used in page or by child objects
		@headers = @first_value.attributes.keys if @first_value
		@test_array = []
		@test = SysmonTest.select('cpu_util, cpu_idle, date_time').order('date_time asc').limit(300)
	end


	def data_values
	    ss = []
	    pp = []
	    qq = params["collectionname"]
	    zz = []
		#first_value = Tweet.first
		#rr = first_value.as_json(:except => :_id).merge('_id' => first_value.id).to_json
		#rr = JSON.parse(rr)

		client_host = ['localhost:27017']
		client_options = {
  				database: 'development',
  				user: 'mydbuser',
  				password: 'dbuser'
						}
	    client = Mongo::Client.new(client_host, client_options)
	    #byebug
	    collection_docs = []
	    client[qq].find().each do |document|
	    	collection_docs << document
	    end
	    collection_doc = collection_docs.first
	    #byebug
	    #rr = collection_doc.as_json(:except => :_id).merge('_id' => collection_doc.id).to_json
	    rr = collection_doc.to_json
	    rr = JSON.parse(rr)

	    ss << recursive_keys_final(rr)

	    #Routine to move uploaded at as a first column
	    #zz << ss[0].last
	    #for i in 1..(ss[0].length-2)
	    #	zz << ss[0][i]
	    #end

	    #zz << ss[0].first


	    #byebug
		#ssa = first_value.class.name
		#headers = first_value.attributes.keys

		render json:ss, status:200

	end

	def data_upload
		#byebug
		client_host = ['localhost:27017']
		client_options = {
  				database: 'development',
  				user: 'mydbuser',
  				password: 'dbuser'
						}
	    client = Mongo::Client.new(client_host, client_options)
	    collectionname = params["name"]
	    filedata = params["file"]
	    temp = {"uploaded_at" => Time.now.strftime("%e/%b/%Y %H:%M:%S %z")}
	    begin  # error catching mechanism from begin to end
	    	client[collectionname].create
			rescue
			render json: {"error": "collection_exists"}, status:400
			return
		end


	    #byebug

	    if filedata.content_type == "text/csv"
	    	csv_parser(filedata.tempfile,client,collectionname)
		    elsif  filedata.content_type == "application/json"
		    	json_parser(filedata.tempfile,client,collectionname)
		    elsif  filedata.content_type == "text/plain"
	    	text_parser(filedata.tempfile,client,collectionname)
	    end

	    Mongobicollection.create(collectionname:collectionname,type_collection:filedata.content_type,user_id:current_user.id,db_name:"development")
	    client[collectionname].find().each do |document|
	    	client[collectionname].update_one({:_id => document["_id"]}, '$set' => {:biuser_id => current_user.id})
	    	client[collectionname].update_one({:_id => document["_id"]}, '$set' => {:uploaded_at => Time.now.strftime("%e/%b/%Y %H:%M:%S %z")}) # use DateTime.parse(strftime) to parse the date
	    end
	    render json: {"success": collectionname}, status:200
	end

	def recursive_keys_final(hash_value)
	    ss = []
	    hash_value.each do |key, value|
	      #ss << value.class.name
		    if value.is_a? Hash
		      	#byebug
		      	if key != "biuser_id" and key != "_id"
		        	ss << { name: key, children: recursive_keys_final(value) }
		    	end
		    else
		      	if key != "biuser_id" and key != "_id"
		        	ss << { name: key }
		    	end
	    	end
    	end
    	return ss
  	end

  	def json_parser(file_path,client,collectionname) # to parse json

  		file_path.each do |item|
  			if 	item != "\n"
				begin
  					item = JSON.parse(item)
				rescue
				end
  				client[collectionname].insert_one(item)
  			end
		end
  	end

	def csv_parser(file_path,client,collectionname) # to parse csv
		columns = []
	    instances = []
	    CSV.foreach(file_path) do |row|
	    	#byebug
		    if columns.empty?
		      	#byebug
		        # We dont want attributes with whitespaces (add "_" instead of space)
		        #byebug
		        columns = row.collect { |c| c.downcase.gsub(' ', '_') }
		        next
		    end

			       #indexing(row, columns)
			instances << client[collectionname].insert_one(indexing(row, columns))
			#byebug
		end
		instances
	end


	def text_parser(file_path,client,collectionname) # to parse text
		columns = []
		instances = []
		rows = []
		i = 0
		CSV.foreach(file_path) do |row|
			columns = []
			if i == 0
				column_first = row.collect { |c| c.downcase.gsub(' ', '_') }
			        	rows = column_first[0].split
			end
			        #byebug
			if i != 0
	        	column_first = row.collect { |c| c.downcase.gsub(' ', '_') }
	        	if column_first != nil
	        		columns_re = column_first[0].split
	    		end
	     		instances << client[collectionname].insert_one(indexing(columns_re, rows))
			end
			    i = i + 1
		end
		instances
	end


	def data_display

		temp_array = []
		key_array = []
		client_host = ['localhost:27017']
		client_options = {
  				database: 'development',
  				user: 'mydbuser',
  				password: 'dbuser'
						}
	    client = Mongo::Client.new(client_host, client_options)
	    #render json: client.database.collection_names, status:200
	    viewcollection = params["lastcollection"]
	    viewdata = params["file"]

		collection_docs = []
		counter = 0
		begin
		    client[viewcollection].find().each do |document|
			    # routine to delete specific id from JSON Array
			    docs = document.tap { |hs| hs.delete("_id") }
			    collection_docs << docs
			    if counter == 0
			    	docs.each do |key, value|
			    		if key != "biuser_id"
			    			key_array << { title: key, data: key }
			    		end
			    	end # docs.each end
				end # end if
				counter = counter + 1
			end # document end
		rescue
		end
   		render json: {columns:key_array,data:collection_docs,buttons:["excelHtml5","csvHtml5","pdfHtml5"],dom: "Bfrtip",processing: "true"}, status:200
	end


	def json_display

		temp_array = []
		#key_array = []
		client_host = ['localhost:27017']
		client_options = {
  				database: 'development',
  				user: 'mydbuser',
  				password: 'dbuser'
						}
	    client = Mongo::Client.new(client_host, client_options)
	    #render json: client.database.collection_names, status:200
	    viewcollection = params["lastcollection"]
	    viewdata = params["file"]

		collection_docs = []
		counter = 0
		#doc_arr = []
	    client[viewcollection].find().each do |document|
	    	doc_arr = []
		    # routine to delete specific id from JSON Array
		    docs = document.tap { |hs| hs.delete("_id") }
		    docs = document.tap { |hs| hs.delete("biuser_id") } #to delete userid
		   	doc_arr << docs
		    collection_docs << doc_arr

		    #byebug

		end # document end
   		render json: collection_docs, status:200

	end


	def add_column

		temp_array = []
		key_array = []
		client_host = ['localhost:27017']
		client_options = {
  				database: 'development',
  				user: 'mydbuser',
  				password: 'dbuser'
						}
	    client = Mongo::Client.new(client_host, client_options)

	    viewcollection = params["collectionname"]
	    viewdata = params["file"]
	    columnname = params["nameofcolumn"]
	    operatorused = params["mathoperator"]
	    firstcolumn = params["columnone"]
	    secondcolumn = params["columntwo"]

        first_value = 0
        second_value = 0
        third_value = 0

	    client[viewcollection].find().each do |document|
		    document.each do |key, value|

			    if key == firstcolumn
			    	first_value = Float(value)
			    end

			    if key == secondcolumn
			    	second_value = Float(value) # toconvert string into float
			    end
			end

			if operatorused == "add"
				third_value = first_value + second_value # addition

				elsif operatorused == "subtract"
					third_value = first_value - second_value # subtraction

				elsif operatorused == "multiply"
					third_value = first_value * second_value # multiplication

				elsif operatorused == "divide"
					third_value = first_value / second_value # division
			end
			#byebug
		   	client[viewcollection].update_one({:_id => document["_id"]}, '$set' => {columnname => third_value})
		end
		render json: {success: "column added successfully" }, status:200
	end


	def add_emptycolumn

		temp_array = []
		key_array = []
		client_host = ['localhost:27017']
		client_options = {
  				database: 'development',
  				user: 'mydbuser',
  				password: 'dbuser'
						}
	    client = Mongo::Client.new(client_host, client_options)

	    viewcollection = params["collectionname"]
	    viewdata = params["file"]
	    columnname = params["nameofcolumn"]

        empty_value = ""

	    client[viewcollection].find().each do |document|

		   	client[viewcollection].update_one({:_id => document["_id"]}, '$set' => {columnname => empty_value})

		end
		render json: {success: "empty column added successfully" }, status:200
	end




	def get_columns
	    qq = params["collectionname"]
		#first_value = Tweet.first
		#rr = first_value.as_json(:except => :_id).merge('_id' => first_value.id).to_json
		#rr = JSON.parse(rr)

		client_host = ['localhost:27017']
		client_options = {
  				database: 'development',
  				user: 'mydbuser',
  				password: 'dbuser'
						}
	    client = Mongo::Client.new(client_host, client_options)
	    #byebug
	    collection_docs = []
	    client[qq].find().each do |document|
	    	collection_docs << document
		end
	    collection_doc = collection_docs.first
	    #byebug
	    #rr = collection_doc.as_json(:except => :_id).merge('_id' => collection_doc.id).to_json
	    rr = collection_doc.to_json
	    rr = JSON.parse(rr)
		ss = []
		rr.each do |key, value|
			if is_number?(value)
			        ss << key
			end # end for if
		end
		render json:ss, status:200
	end

	def user_collection

		collection_names = []
		client_host = ['localhost:27017']
		client_options = {
  				database: 'development',
  				user: 'mydbuser',
  				password: 'dbuser'
						}
	    client = Mongo::Client.new(client_host, client_options)

		client.collections.each do |collection|
			#coll.find({}, :sort => ['value','descending'])
			first_doc = collection.find().first #to get first document using find
			has_biuser_id = first_doc.has_key?(:biuser_id)

			if has_biuser_id == true
				if first_doc["biuser_id"] == current_user.id
					#byebug
					collection_names << collection.name
				end
			end
		end

		return render json:{error:"List Empty, no collection(s) exists for user:" + " " + current_user.email}, status:400 unless collection_names.present? #not a bad request just missing empty

		collection_names = collection_names.sort! # to sort the aray by name
		render json:collection_names, status:200 #2 Render formats: 1) HTML (implicit) --> views should contain <actionname>.html.erb  & 2) JSON (explicit) see above
	end

	def line_chart_data
		#test = SysmonTest.select('cpu_util, cpu_idle, date_time', 'mem_usage').order('date_time asc').limit(20)
		qq = params["lastcollection_name"]
		ss = params["colname"]
		rr = params["rowname"]
		col_val = []
		row_val = []
		sorted_date = []
		sorted_date_to_s = []
		unsorted_date = []

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
			result_hash = {}
		counter = 0

		#doc_arr = []
		#byebug
	    client[qq].find().each do |document|
			#counter = counter + 1
			# document.each do |key|
					parsed_date = Date.strptime(document[rr], "%d-%b-%y")
					result_hash[parsed_date] ? result_hash[parsed_date] << document[ss] : result_hash[parsed_date] = [document[ss]]

					# row_data << key
					# if key == ss
					# 	col_val << value
					# end
					# if key == rr
					# 	row_val << value
					# end
			# end
		    #byebug
		end # document end
		# byebug


		# row_val.each do |date_val|
		# 	begin
		# 		parsed_date = Date.strptime(date_val, "%d-%b-%y")
		# 		#byebug
		# 		#row_val.clear #empty array
		# 		unsorted_date << parsed_date
		# 	rescue
		# 	end
		# end
		# #byebug
		# if not unsorted_date.empty?
		# 	sorted_date = sorted_date + unsorted_date.sort
		# 	sorted_date.each do |sort_date|
		# 			sorted_date_to_s << sort_date
		# 	end
		# 	row_val.clear #empty array
		# 	row_val = row_val + sorted_date_to_s
		# end

		render json:{data: result_hash.sort}, status:200
	end



	def is_number? string
		true if Float(string) rescue false
	end

	def is_date? string
		#write strptime method to convert date format(s)
	end

  private

  def indexing(row, columns)
    attrs = {}
    columns.each_with_index do |column, index|
      attrs[column] = row[index]
    end
    attrs
  end
end #controller end strarts with require
