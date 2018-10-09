#sw deployment tracker controller
module Ericsson 
  class SwDepTrackerController < ApplicationController
    before_action :authenticate_user!

    def index
    end

    def sw_pivot_query
      #byebug
      # dropdown1_match = { '$match'=> { 'SW Version'=> {'$in' => ['L18.Q1 IP6 EC2', 'L18.Q1 IP2 EC3'] } } },
      # dropdown2_match = { '$match'=> { 'Connection Status'=> {'$in' => ['CONNECTED'] } } },
      # radiobutton1_match = { '$match'=> { 'Synch Status'=> {'$in' => ['SYNCHRONIZED', 'UNSYNCHRONIZED'] } } },
      # radiobutton2_match = { '$match'=> { 'In Production'=> {'$in' => ['YES', 'NO'] } } },
      # unwind = { '$unwind'=> '$OSS'},
      # group_by = { '$group' => {'_id' => {'ENM' => '$OSS', 'SW Version' => '$SW Version', 'Revision' => '$Revision'}, 'Count'=> { '$sum'=> 1 }}},
      # sort = {'$sort' => {'_id' => 1} }
      # aggregate_pipeline = []
      # aggregate_pipeline << dropdown1_match  
      # aggregate_pipeline << dropdown2_match 
      # aggregate_pipeline << radiobutton1_match
      # aggregate_pipeline << radiobutton2_match
      # aggregate_pipeline << unwind
      # aggregate_pipeline << group_by
      # aggregate_pipeline << sort 
      #byebug 
      sw_pivot_query = client[Ericsson::SW_TRACKER].aggregate([
      {"$match" => {"SW Version" => { "$in" => [ "L18.Q1 IP6 EC2", "L18.Q1 IP2 EC3" ]}}}, 
      {"$match" => {"Connection Status" => "CONNECTED"}},
      {"$match" => {"Synch Status" => "SYNCHRONIZED"}},
      {"$match" => {"In Production" => "YES"}},
      {"$group" => { "_id" => { "OSS" => "$OSS", "Area" => "$Area", "Region" => "$Region", "Market" => "$Market", "eNB" => "$eNB", "SW Product number" => "$SW Product number", "Revision" => "$Revision", "SW Version" => "$SW Version", "Connection Status" => "$Connection Status", "Synch Status" => "$Synch Status", "In Production" => "$In Production", "Days in Current State" => "$Days in Current State", "Previous State" => "$Previous State" }}}, 
      {"$project" => { "OSS" => "$_id.OSS", "Area" => "$_id.Area", "Region" => "$_id.Region", "Market" => "$_id.Market", "eNB" => "$_id.eNB", "SW Product number" => "$_id.SW Product number", "Revision" => "$_id.Revision", "SW Version" => "$_id.SW Version", "Connection Status" => "$_id.Connection Status", "Synch Status" => "$_id.Synch Status", "In Production" => "$_id.In Production", "Days in Current State" => "$_id.Days in Current State", "Previous State" => "$_id.Previous State"}}, 
      ])
      #sort = {'$sort' => {'_id' => 1} }
      # byebug

      # dropdown1_match = {"$match" => {"SW Version" => { "$in" => [ "L18.Q1 IP6 EC2", "L18.Q1 IP2 EC3" ]}}}, 
      # dropdown2_match = {"$match" => {"Connection Status" => "CONNECTED"}},
      # radiobutton1_match = {"$match" => {"Synch Status" => "SYNCHRONIZED"}},
      # radiobutton2_match = {"$match" => {"In Production" => "YES"}},
      # group_by = {"$group" => { "_id" => { "OSS" => "$OSS", "Area" => "$Area", "Region" => "$Region", "Market" => "$Market", "eNB" => "$eNB", "SW Product number" => "$SW Product number", "Revision" => "$Revision", "SW Version" => "$SW Version", "Connection Status" => "$Connection Status", "Synch Status" => "$Synch Status", "In Production" => "$In Production", "Days in Current State" => "$Days in Current State", "Previous State" => "$Previous State" }}}, 
      # project = {"$project" => { "OSS" => "$_id.OSS", "Area" => "$_id.Area", "Region" => "$_id.Region", "Market" => "$_id.Market", "eNB" => "$_id.eNB", "SW Product number" => "$_id.SW Product number", "Revision" => "$_id.Revision", "SW Version" => "$_id.SW Version", "Connection Status" => "$_id.Connection Status", "Synch Status" => "$_id.Synch Status", "In Production" => "$_id.In Production", "Days in Current State" => "$_id.Days in Current State", "Previous State" => "$_id.Previous State"}}, 
      # #sort = {'$sort' => {'_id' => 1} }
      # byebug
      # aggregate_pipeline = []
      # aggregate_pipeline << dropdown1_match  
      # aggregate_pipeline << dropdown2_match 
      # aggregate_pipeline << radiobutton1_match
      # aggregate_pipeline << radiobutton2_match
      # aggregate_pipeline << group_by
      # aggregate_pipeline << project
      #aggregate_pipeline << sort 
    
      #sw_pivot_query = client[Ericsson::SW_TRACKER].aggregate([aggregate_pipeline])
      result = []
      sw_pivot_query.each do |item|
        result << item
      end
      render json: {data: result}, status: 200
    end
  end
end