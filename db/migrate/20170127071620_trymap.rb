class Trymap < ActiveRecord::Migration
  def change
  	   create_table :testmaps do |t|
      	t.timestamps null: false
      end
  end
end
