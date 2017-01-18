class CreateSysmonTests < ActiveRecord::Migration
  def change
    create_table :sysmon_tests do |t|
      t.datetime :date_time
      t.decimal  :cpu_util
      t.decimal  :cpu_idle
      t.string 	 :cpu_top
      t.decimal  :mem_usage

      t.timestamps null: false
    end
  end
end
