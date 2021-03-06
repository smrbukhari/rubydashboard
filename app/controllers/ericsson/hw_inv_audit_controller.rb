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
      @filter1_match = { '$match'=> { params[:filter1] => { '$in' => params[:filter1_option] } } } #Region
      @filter2_match = { '$match'=> { params[:filter2] => { '$in' => params[:filter2_option] } } } #Region Name
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

      # storing whatever is returned from query_map_data to map_data used by geolocation.js
      map_data = params[:map_selection] == "plot_with_map" ? query_map_data : nil
      if label_data.first.class == Hash
        chart_label = label_data.first.keys[1]
      else
        chart_label = "NoLabel"
      end
      render json: { data: { x_axis: x_axis_data, y_axis: y_axis_data, chart_label: chart_label, map_data: map_data }}, status: 200
      #rescue NoMethodError => e
      #byebug
      # render json: {error: e, data1: e}, status: :bad_request 
    end

    def query_map_data

      query = client[Ericsson::COLLECTION_NAME].aggregate([
        { '$match'=> { params[:filter1] => { '$in' => params[:filter1_option] } } },
        { '$match'=> { params[:filter2] => { '$in' => params[:filter2_option] } } },
        { '$lookup' =>
             {
               'from' => GEOLOCATION_COLLECTION_NAME,
               'localField' => 'NodeName',
               'foreignField' => 'eNodeB_Name',
               'as' => 'output'
             }},
        { '$sort' => {'_id' => 1} }
      ])
      result = []
      query.each do |document|
        document['output'].each do |item|
          result << {
            nodename: item["eNodeB_Name"],
            latitude: item["SL_Latitude"], 
            longitude: item["SL_Longitude"],
          } if item["SL_Latitude"].present? || item["SL_Longitude"].present? #inline if no else is required
        end
      end 
      result
    end

    def intersection?
      params[:mutually_inclusive_or_exclusive] == "intersection"
    end

    def default_filter2_query
      unwind = { '$unwind'=> "$#{params[:filter3]}"} #unwind Submarket which is filter3
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

    def intersection_filter2_query #need count per region like default
      unwind = { '$unwind'=> "$#{params[:filter3]}"}
      #filter1 already selected
      #filter2 already selected
      #group_by = { '$group' => {'_id' => '$NodeName', 'ProductName' => {'$addToSet' => { 'pName' => '$ProductName'}} }}
      group_by = { '$group' => {'_id' => { 'NN'=> '$NodeName', 'SM'=> '$' + params[:filter1] }, params[:filter2]  => {'$addToSet' => { 'pName' => '$' + params[:filter2] }} }}
      #project = { '$project' => { 'ProductName' => '$ProductName', 'len' => { '$size' => '$ProductName' } } }
      project = { '$project' => { params[:filter2] => '$' + params[:filter2], 'len' => { '$size' => '$' + params[:filter2]} } }
      project_pn = { '$project' => { 'PN' => { '$gt' => ['$len', 1] } }}
      match_pn = { '$match' => { 'PN' => true } }
      group_by_2 = { '$group'=> { '_id'=> '$_id.SM', 'count'=> { '$push'=> '$PN' } } }
      project_count = { '$project'=> { '_id'=> '$_id', 'count'=> { '$size'=> '$count' } } }
      sort_asc = {'$sort' => {'_id' => 1} } 
      aggregate_pipeline = []
      aggregate_pipeline << @filter1_match  
      aggregate_pipeline << @filter2_match 
      aggregate_pipeline << unwind
      aggregate_pipeline << group_by
      aggregate_pipeline << project
      aggregate_pipeline << project_pn
      aggregate_pipeline << match_pn
      aggregate_pipeline << group_by_2
      aggregate_pipeline << project_count
      aggregate_pipeline << sort_asc  
      client[Ericsson::COLLECTION_NAME].aggregate(aggregate_pipeline)
    end

    def filter_sub_options
      result = []
      result = client[Ericsson::COLLECTION_NAME].find.distinct(params[:filter])
      render json: {data: result}, status: 200
    end

    def view_data
      key_array = []
      collection_docs = []
      #byebug
      if intersection? == true # intersection reporting false
        byebug
        result = client[Ericsson::COLLECTION_NAME].aggregate([
        { '$match'=> { params[:filter1] => { '$in' => params[:filter1_option] } } },
        { '$match'=> { params[:filter2] => { '$in' => params[:filter2_option] } } },
        { '$unwind'=> "$#{params[:filter3]}"},
        { '$group' => {'_id' => { 'NN'=> '$NodeName', 'SM'=> '$' + params[:filter1] }, params[:filter2]  => {'$addToSet' => { 'pName' => '$' + params[:filter2] }} }},
        { '$project' => { params[:filter2] => '$' + params[:filter2], 'len' => { '$size' => '$' + params[:filter2]} } },
        { '$project' => { 'PN' => { '$gt' => ['$len', 1] } }},
        { '$match' => { 'PN' => true } },
        { '$group'=> { '_id'=> '$_id.NN', 'count'=> { '$push'=> '$PN' } } }, #print NodeNames, still need to bring all fields
        { '$project'=> { '_id'=> '$_id', 'count'=> { '$size'=> '$count' } } },
        { '$sort' => {'_id' => 1} }
        ])
      else
        result = client[Ericsson::COLLECTION_NAME].aggregate([
          { '$match'=> { params[:filter1] => { '$in' => params[:filter1_option] } } },
          { '$match'=> { params[:filter2] => { '$in' => params[:filter2_option] } } },
          { '$sort' => {'_id' => 1} }
        ])
      end
      counter = 0
      #byebug
      begin
        #client[Ericsson::COLLECTION_NAME].find.limit(100).each do |document| #limit 100 records
          result.each do |document|
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

  
  end
end
