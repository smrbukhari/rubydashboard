class AnalyticsController < ApplicationController
	before_action :authenticate_user!
	def index 
		@first_value = Tweet.first
		@headers = @first_value.attributes.keys
		@test_array = []
		@test = SysmonTest.select('cpu_util, cpu_idle, date_time').order('date_time asc').limit(300)
		for i in @test

		end
	end
end
