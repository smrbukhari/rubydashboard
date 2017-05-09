class CreateMongobicollections < ActiveRecord::Migration
  def change
    create_table :mongobicollections do |t|
      t.string :collectionname
      t.string :type_collection
      t.integer :user_id
      t.string :db_name

      t.timestamps null: false
    end
  end
end
