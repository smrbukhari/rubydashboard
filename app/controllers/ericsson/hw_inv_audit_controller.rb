module Ericsson 
  class HwInvAuditController < ApplicationController
    before_action :authenticate_user!

    def index
    end

    def column_names
      column_names = []
      row_names = []
        client[Ericsson::COLLECTION_NAME].find().limit(1).each do |document|
          document.each do |key, value|
            column_names << key
          end
        end
        render json:{data: column_names}, status:200
    end

    def plot_one
      result = []
      label_data = []
      @filter1_match = { '$match'=> { params[:filter1]=> { '$in' => params[:filter1_option] } } }
      @filter2_match = { '$match'=> { params[:filter2]=> { '$in' => params[:filter2_option] } } }
      result = if intersection?
                 intersection_filter2_query
               else
                 default_filter2_query
               end 
      result.each {|item| label_data << item }
      x_axis_data = []
      y_axis_data = []
      label_data.each do |item|
        x_axis_data << item["_id"]
        y_axis_data << item[item.keys[1]]    
      end   
      render json: { data: { x_axis: x_axis_data, y_axis: y_axis_data, chart_label: label_data.first.keys[1] }}, status: 200
      #rescue NoMethodError => e
      #byebug
      # render json: {error: e, data1: e}, status: :bad_request 
    end

    def intersection?
      params[:mutually_inclusive_or_exclusive] == "intersection"
    end

    def default_filter2_query
      unwind = { '$unwind'=> "$#{params[:filter3]}"}
      group_by = { '$group'=> { '_id'=> "$#{params[:filter3]}" , "Product(s)"=> { '$sum'=> 1 } } }
      group_by_with_addtoset = { '$group'=> { '_id'=> "$#{params[:filter3]}", 'uniqueCount' => { '$addToSet' => { params[:filter4] => "$#{params[:filter4]}", params[:filter2] => "$#{params[:filter2]}" } }, "Product(s)" => { '$sum'=> 1 } } }
      project = { '$project' => { 'uniqueNodeNameCount' => { '$size' => '$uniqueCount' } }}
      sort_asc = {'$sort' => {'_id' => 1} } 
      aggregate_pipeline = []
      aggregate_pipeline << @filter1_match  
      aggregate_pipeline << @filter2_match 
      aggregate_pipeline << unwind

      if params[:filter4] != 'AddToSet' 
        aggregate_pipeline << group_by_with_addtoset
        aggregate_pipeline << project
      else 
        aggregate_pipeline << group_by
      end
      aggregate_pipeline << sort_asc  
      client[Ericsson::COLLECTION_NAME].aggregate(aggregate_pipeline)
    end

    def intersection_filter2_query
    end

    def filter_sub_options
      result = []
      result = client[Ericsson::COLLECTION_NAME].find.distinct(params[:filter])
      render json: {data: result}, status: 200
    end

    def view_data
      key_array = []
      collection_docs = []
      #result = []
      #@filter1_match = { '$match'=> { params[:filter1]=> { '$in' => params[:filter1_option] } } }
      #@filter2_match = { '$match'=> { params[:filter2]=> { '$in' => params[:filter2_option] } } }
      #result = if intersection?
      #           intersection_filter2_query
      #         else
      #           default_filter2_query
      #         end 
      counter = 0
      begin
        client[Ericsson::COLLECTION_NAME].find.limit(100).each do |document| #limit 100 records
        #result.each do |document|
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


    def map_data
      client_host = ['localhost:27017']
      client_options = {
        database: 'development',
        user: 'mydbuser',
        password: 'dbuser'
      }
      client = Mongo::Client.new(client_host, client_options)
      collection_docs = []
      client["SF_Food_trucks"].find().each do |document|
        collection_docs << document
      end
      render json:{data:[collection_docs]}, status:200
    end
  end
end
