class CreateTestTables < ActiveRecord::Migration
  def change
    create_table :test_tables do |t|
      t.string :date_time
      t.string :cpu_util
      t.string :cpu_idle
      t.string :cpu_top
      t.string :mem_usage

      t.timestamps null: false
    end
  end
end
