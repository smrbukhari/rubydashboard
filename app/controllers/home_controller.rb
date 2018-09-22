class HomeController < ApplicationController
  def index
  end

  def vendor_per_state
   @collection_docs = []
   query = client[Ericsson::CHOROPLETH_COLLECTION].aggregate({
     '$lookup' =>
       {
         'from' => 'vendorPerState',
         'localField' => 'abbreviation',
         'foreignField' => 'Abbreviation',
         'as' => "vendor_with_polygons"
       }
    })
    query.each do |document|
     @collection_docs << document
    end
    byebug
  end
end
