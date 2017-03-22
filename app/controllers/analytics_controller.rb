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
		first_value = Tweet.first
		rr = first_value.as_json(:except => :_id).merge('_id' => first_value.id).to_json
		rr = JSON.parse(rr)
		
		ss << recursive_keys_final(rr)
		ssa = first_value.class.name
		headers = first_value.attributes.keys 
		render json:ss, status:200
	end

	def data_upload

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
	    client[collectionname].create

		#json_out =	CSV.open(filedata, :headers => true).map { |x| x.to_h }.to_json
		#json_out = csv_parser(filedata.tempfile,client,collectionname)
		json_parser(filedata.tempfile,client,collectionname)

	    #doc = { :_id => 9, :name => "Toyota", :price => 37600 }
	    #result = client[collectionname].insert_one doc
	    #temp_json = JSON.parse(filedata.tempfile)
	    #result = client[collectionname].insert_one(filedata.tempfile)
	    #render json: client.database.collection_names, status:200
	    #render json: {"success": json_out}, status:200 # use this render for .csv or .txt
	    render json: {"success": filedata}, status:200
	    

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
					  
  					if 	item != ''
  						item = JSON.parse(item)
  						client[collectionname].insert_one(item)
  						#return item
  					
  					end


				end

				
  			end

			  def csv_parser(file_path,client,collectionname) # to parse csv
			    columns = []
			    instances = []
			    CSV.foreach(file_path) do |row|
			      if columns.empty?
			        # We dont want attributes with whitespaces
			        columns = row.collect { |c| c.downcase.gsub(' ', '_') }
			        next
			      end
			 
			       #indexing(row, columns)
			     # instances << client[collectionname].insert_one(indexing(row, columns))

			    end
			    instances
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
