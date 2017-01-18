class DemoController < ApplicationController
	def index 
		@test_array = []
		@test = SysmonTest.select('cpu_util, cpu_idle, date_time').order('date_time asc').limit(100)
		for i in @test
		end
	end

end
