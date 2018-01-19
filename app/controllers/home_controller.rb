class HomeController < ApplicationController
  def index
  end
  def vendor_per_state
    client_host = ['localhost:27017']
    client_options = {
      database: 'development',
      user: 'mydbuser',
      password: 'dbuser'
    }
    client = Mongo::Client.new(client_host, client_options)
    collection_docs = []
    client["SF_Food_trucks"].find().each do |document|
      collection_docs << document
    end
   # render json:{data:[collection_docs]}, status:200
  end
end
