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

end
