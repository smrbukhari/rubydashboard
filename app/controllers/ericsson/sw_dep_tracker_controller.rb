#sw deployment tracker controller
module Ericsson 
  class SwDepTrackerController < ApplicationController
    before_action :authenticate_user!

    def index
    end

    def sw_pivot_query
      #byebug
      dropdown1_match = { '$match'=> { 'SW Version'=> {'$in' => ['L18.Q1 IP6 EC2', 'L18.Q1 IP2 EC3'] } } },
      dropdown2_match = { '$match'=> { 'Connection Status'=> {'$in' => ['CONNECTED'] } } },
      radiobutton1_match = { '$match'=> { 'Synch Status'=> {'$in' => ['SYNCHRONIZED', 'UNSYNCHRONIZED'] } } },
      radiobutton2_match = { '$match'=> { 'In Production'=> {'$in' => ['YES', 'NO'] } } },
      unwind = { '$unwind'=> '$OSS'},
      group_by = { '$group' => {'_id' => {'ENM' => '$OSS', 'SW Version' => '$SW Version', 'Revision' => '$Revision'}, 'Count'=> { '$sum'=> 1 }}},
      sort = {'$sort' => {'_id' => 1} }
      aggregate_pipeline = []
      aggregate_pipeline << dropdown1_match  
      aggregate_pipeline << dropdown2_match 
      aggregate_pipeline << radiobutton1_match
      aggregate_pipeline << radiobutton2_match
      aggregate_pipeline << unwind
      aggregate_pipeline << group_by
      aggregate_pipeline << sort  
      sw_pivot_query = client[Ericsson::SW_TRACKER].aggregate(aggregate_pipeline)
      result = []
      sw_pivot_query.each do |item|
        result << item
      end
      render json: {data: result}, status: 200
    end
  end
end