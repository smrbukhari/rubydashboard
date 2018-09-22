class MtceDashboardController < ApplicationController
  def index  
   @collection_docs = []
   query = client[Ericsson::CHOROPLETH_COLLECTION].aggregate([{
     '$lookup' =>
       {
         'from' => 'vendorPerState',
         'localField' => 'abbreviation',
         'foreignField' => 'Abbreviation',
         'as' => "vendor_with_polygons"
       }
    }])
   #byebug
    query.each do |document|
      document['properties']['vendor'] = document["vendor_with_polygons"].first["Vendor"]
     @collection_docs << document
    end
    #byebug
    #render json:{data:[collection_docs]}, status:200
  end
end
