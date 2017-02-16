class DemoController < ApplicationController
	def index 
		@test_array = []
		@test = SysmonTest.select('cpu_util, cpu_idle, date_time').order('date_time asc').limit(100)
		@pie_cht = SysmonTest.select('id, mem_usage').limit(5)
		start_date = DateTime.parse('2015-01-01 00:00:00')
		end_date = DateTime.parse('2016-01-01 00:00:00')
		@colmn_cht = SysmonTest.select('date_time, cpu_util').where('date_time >= ? AND date_time < ?',start_date,end_date)
		@barr_cht = SysmonTest.select('date_time, cpu_util').where('date_time >= ? AND date_time < ?',start_date,end_date)
		@skat_data = SysmonTest.select('cpu_util, cpu_idle, date_time').order('date_time asc').limit(20)
		start_date_mlc = DateTime.parse('2016-01-01 00:00:00')
		end_date_mlc = DateTime.parse('2016-01-30 00:00:00')
		@mlc_util = SysmonTest.select('cpu_util').where('date_time >= ? AND date_time < ?',start_date_mlc,end_date_mlc)
		@mlc_idle = SysmonTest.select('cpu_idle').where('date_time >= ? AND date_time < ?',start_date_mlc,end_date_mlc)
		for i in @test
		end

	end

	def line_chart_data
		test = SysmonTest.select('cpu_util, cpu_idle, date_time', 'mem_usage').order('date_time asc').limit(10)
		render json:{data:test}, status:200
	end

	def map_data
		testmap = Testmap.select('applicant, latitude, longitude')
		render json:{data:testmap}, status:200
	end

	def pie_chart_data
		testpie = SysmonTest.select('id, mem_usage').limit(5)
		render json:{data:testpie}, status:200
	end
end
