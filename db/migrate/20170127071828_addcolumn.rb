class Addcolumn < ActiveRecord::Migration
  def change
  		add_column :testmaps, :latitude, :float
  		add_column :testmaps, :longitude, :float
  		add_column :testmaps, :applicant, :string
  end
end
