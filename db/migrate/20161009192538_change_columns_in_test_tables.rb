class ChangeColumnsInTestTables < ActiveRecord::Migration
  def change
	remove_column :test_tables, :date_time
	add_column :test_tables, :date_time, :datetime 
	remove_column :test_tables, :cpu_util
	add_column :test_tables, :cpu_util, :decimal 
	remove_column :test_tables, :cpu_idle
	add_column :test_tables, :cpu_idle, :decimal 
	remove_column :test_tables, :mem_usage
	add_column :test_tables, :mem_usage, :decimal 

  
  end
end
