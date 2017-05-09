# backend programming puts more load on the server side; front end javascripts loads more data
# on the client

require 'csv'
require 'json'

class AnalyticsController < ApplicationController
	before_action :authenticate_user!
	def index 
		@first_value = Tweet.first #use @ when variable used in page or by child objects
		@headers = @first_value.attributes.keys
		@test_array = []
		@test = SysmonTest.select('cpu_util, cpu_idle, date_time').order('date_time asc').limit(300)
		



	end

	def data_values
	    ss = []
	    pp = [] 
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

	    ss << recursive_keys_final(rr)
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
	    #render json: client.database.collection_names, status:200
	    collectionname = params["name"]
	    filedata = params["file"]
	    #byebug
	    begin  # error catching mechanism from gegin to end
	    client[collectionname].create
		rescue
		render json: {"error": "collection_exists"}, status:400
		return	
		end

		
	    if filedata.content_type == "text/csv"

	    	csv_parser(filedata.tempfile,client,collectionname)

	    elsif  filedata.content_type == "application/json"

	    	json_parser(filedata.tempfile,client,collectionname)

	    elsif  filedata.content_type == "text/plain"	

	    	text_parser(filedata.tempfile,client,collectionname)


	    end

		#json_out =	CSV.open(filedata, :headers => true).map { |x| x.to_h }.to_json
		#json_out = csv_parser(filedata.tempfile,client,collectionname)
		#json_parser(filedata.tempfile,client,collectionname)

	    #doc = { :_id => 9, :name => "Toyota", :price => 37600 }
	    #result = client[collectionname].insert_one doc
	    #temp_json = JSON.parse(filedata.tempfile)
	    #result = client[collectionname].insert_one(filedata.tempfile)
	    #render json: client.database.collection_names, status:200
	    #render json: {"success": json_out}, status:200 # use this render for .csv or .txt
	    a = Mongobicollection.create(collectionname:collectionname,type_collection:filedata.content_type,user_id:current_user.id,db_name:"development")
	    #session[:current_user_id] = @user.id
	    render json: {"success": collectionname}, status:200
	    

	end

	def recursive_keys_final(hash_value)
    ss = []
    hash_value.each do |key, value|
      #ss << value.class.name
      if value.is_a? Hash
        ss << { name: key, children: recursive_keys_final(value) }
      else
        ss << { name: key }
      end
      
    end
    #ss << key
    return ss
  end

  			def json_parser(file_path,client,collectionname) # to parse json

  				file_path.each do |item|

  					#byebug # ruby troubleshooting tool
					  
  					if 	item != "\n"
							begin
  						item = JSON.parse(item)
							rescue
							end
  						#byebug
  						client[collectionname].insert_one(item)
  						#return item
  					
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
			        # We dont want attributes with whitespaces
			        #byebug
			        columns = row.collect { |c| c.downcase.gsub(' ', '_') }

			        next
			      end
			 
			       #indexing(row, columns)
			     instances << client[collectionname].insert_one(indexing(row, columns))

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
		    client[viewcollection].find().each do |document| 

		    	
		    #byebug
		    # routine to delete specific id from JSON Array
		    docs = document.tap { |hs| hs.delete("_id") } 
		    
		    collection_docs << docs   
		    if counter == 0
		    docs.each do |key, value|

		    	key_array << { title: key, data: key }
		    end # docs.each end
			end # end if
			counter = counter + 1
		    end # document end
   			render json: {columns:key_array,data:collection_docs,buttons:["excelHtml5","csvHtml5","pdfHtml5"],dom: "Bfrtip",processing: "true"}, status:200

   			#render json: collection_docs, status:200

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
		    client[viewcollection].find().each do |document| 
		    doc_arr = []
		    	
		    #byebug
		    # routine to delete specific id from JSON Array
		    docs = document.tap { |hs| hs.delete("_id") } 
		    
		    #collection_docs << docs   

		   	doc_arr << docs
		    
		    collection_docs << doc_arr 

		    #doc_arr.clear

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
		    
		    viewcollection = params["lastcollection"]
		    viewdata = params["file"]

		    client[viewcollection].find().each do |document| 

		   	client[viewcollection].update_one({:_id => document["_id"]}, '$set' => {:sum => "200000"})

		    end
		    render json: {success: "column added successfully"}, status:200

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
			      #ss << value.class.name
			     
			        ss << key 
			      
			    end

			    #ss << recursive_keys_final(rr)
			    #byebug
				#ssa = first_value.class.name
				#headers = first_value.attributes.keys 

				render json:ss, status:200
			end



			  private
			 
			  def indexing(row, columns)
			    attrs = {}
			    columns.each_with_index do |column, index|
			      attrs[column] = row[index]
			    end
			    attrs
			  end





end
