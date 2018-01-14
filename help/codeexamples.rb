https://plot.ly/dash/gallery/uber-rides/

client_host = ['localhost:27017']
client_options = { database: 'development', user: 'mydbuser', password: 'dbuser' }            
client = Mongo::Client.new(client_host, client_options)
result = client["HW_Audit_Manual"] 

git remote set-url origin git+ssh://github.com/smrbukhari/rubydashboard.git

//basic query
a = result.aggregate([ { '$match'=> { 'Region'=> 'Pacific' } },{ '$match'=> { 'ProductName'=> 'PDU0104' } },{ '$unwind'=> '$Submarket'},{ '$group'=> { '_id'=> '$Submarket', 'PDU0104'=> { '$sum'=> 1 } } }])

//basic query
a = result.aggregate([ { '$match'=> { 'Region'=> 'Great Lakes' } }, { '$match'=> { 'ProductName'=> 'DUS4102' } },{ '$unwind'=> '$Submarket'},{ '$group'=> { '_id'=> '$Submarket', 'DUS4102'=> { '$sum'=> 1 } } },{'$sort' => {'_id' => 1} }])

//$in Region
a = result.aggregate([ { '$match'=> { 'Region'=> { '$in' => ['Great Lakes', 'Pacific'] } } }, { '$match'=> { 'ProductName'=> 'DUS4102' } },{ '$unwind'=> '$Submarket'},{ '$group'=> { '_id'=> '$Submarket', 'DUS4102'=> { '$sum'=> 1 } } },{'$sort' => {'_id' => 1} }])

//addtoSet
a = result.aggregate([ { '$match'=> { 'Region'=> { '$in' => ['Great Lakes', 'Pacific'] } } },
        { '$match'=> { 'ProductName'=> 'DUS4102' } },{ '$unwind'=> '$Submarket'},
        { '$group'=> { '_id'=> '$Submarket', 'uniqueCount' => { '$addToSet' => '$NodeName' }, 'DUS4102'=> { '$sum'=> 1 } } },{'$sort' => {'_id' => 1} }])


//addtoSet with Project

a = result.aggregate([
        { '$match'=> { 'Region'=> { '$in' => ['Great Lakes', 'Pacific'] } } },
        { '$match'=> { 'ProductName'=> { '$in' => ['DUS4101','DUS4102'] } } },
        { '$unwind'=> '$Submarket'},
        { '$group'=> { '_id'=> '$Submarket', 'uniqueCount' => { '$addToSet' => '$NodeName' }, 'DUS4102'=> { '$sum'=> 1 } } },
        { '$project' => { 'uniqueNodeNameCount' => { '$size' => '$uniqueCount' } }},
        { '$sort' => {'_id' => 1} }
])

a = result.aggregate([
        { '$match'=> { 'Region'=> { '$in' => ['Great Lakes', 'Pacific'] } } },
        { '$match'=> { 'ProductName'=> { '$in' => ['DUS4101','DUS4102'] } } },
        { '$unwind'=> '$Submarket'},
        { '$group'=> { '_id'=> '$Submarket', 'uniqueCount' => { '$addToSet' => { 'NodeName' => '$NodeName', 'ProductName' => '$ProductName' } }, 'DUS4102'=> { '$sum'=> 1 } } },
        { '$project' => { 'uniqueNodeNameCount' => { '$size' => '$uniqueCount' } }},
        { '$sort' => {'_id' => 1} }
])

a = result.aggregate([
        { '$match'=> { 'Region'=> { '$in' => ['Pacific'] } } },
        { '$match'=> { 'ProductName'=> { '$in' => ['DUS4101','DUS4102'] } } },
        { '$unwind'=> '$Submarket'},
        { '$group'=> { '_id'=> '$Submarket', 'uniqueCount' => { '$addToSet' => { 'NodeName' => '$NodeName', 'ProductName' => '$ProductName' } }, 'DUS4102'=> { '$sum'=> 1 } } },
        { '$project' => { 'uniqueNodeNameCount' => { '$size' => '$uniqueCount' } }},
        { '$sort' => {'_id' => 1} }
])

def mymethod
  a = result.aggregate([
    { '$match'=> { 'Submarket'=> { '$in' => ['Jacksonville', 'Jupiter'] } } },
          { '$match'=> { 'ProductName'=> { '$in' => ['PDU0201'] } } },
    { '$lookup' =>
         {
           'from' => 'Ericsson_Geolocation',
           'localField' => 'NodeName',
           'foreignField' => 'eNodeB_Name',
           'as' => 'output'
         }},
    { '$sort' => {'_id' => 1} }
  ])
end

/static_plot_generation?filter1=Region&filter1_option%5B%5D=North+Central&filter2=ProductName&filter2_option%5B%5D=DUS4101&filter2_option%5B%5D=DUS4102&filter3=Market

{"_id"=>BSON::ObjectId('5972c8bf16a7a29d33297b9a'), "FileCreationDate"=>"7/17/2017 17:14", "Region"=>"South East", "Market"=>"FL", "Submarket"=>"Jupiter", "Tech"=>"LTE", "NodeType"=>"ENODEB", "NodeName"=>"146422_INLET", "ProductName"=>"PDU0201", "ProductNr"=>"BMG980336/4", "ProductRev"=>"R2Z", "SerialNumber"=>"C942074156", "Mfg"=>{" date"=>20151207}, "ENB Swr Level"=>"L17AIP4EC2", "output"=>[{"_id"=>BSON::ObjectId('5a4c4829ead2fa7a44a3cf06'), "RecordDateTime"=>"12/20/2017 0:50", "MarketID"=>146, "Cell"=>422, "MarketArea"=>"South East", "RegionName"=>"Florida", "MarketName"=>"Jupiter LTE", "featureState"=>1, "SL_Latitude"=>27.461861, "SL_Longitude"=>-80.330611, "AtollVersion"=>"Inactive", "eNodeB_Name"=>"146422_INLET"}, {"_id"=>BSON::ObjectId('5a4c4829ead2fa7a44a3d3ed'), "RecordDateTime"=>"12/20/2017 0:50", "MarketID"=>146, "Cell"=>422, "MarketArea"=>"South East", "RegionName"=>"Florida", "MarketName"=>"Jupiter LTE", "featureState"=>1, "SL_Latitude"=>27.461861, "SL_Longitude"=>-80.330611, "AtollVersion"=>"Active", "eNodeB_Name"=>"146422_INLET"}]}
{"_id"=>BSON::ObjectId('5972c8bf16a7a29d33297ba9'), "FileCreationDate"=>"7/17/2017 17:14", "Region"=>"South East", "Market"=>"FL", "Submarket"=>"Jupiter", "Tech"=>"LTE", "NodeType"=>"ENODEB", "NodeName"=>"146423_DUNE_WALK", "ProductName"=>"PDU0201", "ProductNr"=>"BMG980336/4", "ProductRev"=>"R2X", "SerialNumber"=>"BW97567780", "Mfg"=>{" date"=>20160309}, "ENB Swr Level"=>"L17.Q3MTR17.27", "output"=>[{"_id"=>BSON::ObjectId('5a4c4829ead2fa7a44a3f1b4'), "RecordDateTime"=>"12/20/2017 0:51", "MarketID"=>146, "Cell"=>423, "MarketArea"=>"South East", "RegionName"=>"Florida", "MarketName"=>"Jupiter LTE", "featureState"=>1, "SL_Latitude"=>27.331889, "SL_Longitude"=>-80.231083, "AtollVersion"=>"Inactive", "eNodeB_Name"=>"146423_DUNE_WALK"}, {"_id"=>BSON::ObjectId('5a4c4829ead2fa7a44a418cb'), "RecordDateTime"=>"12/20/2017 0:51", "MarketID"=>146, "Cell"=>423, "MarketArea"=>"South East", "RegionName"=>"Florida", "MarketName"=>"Jupiter LTE", "featureState"=>1, "SL_Latitude"=>27.331889, "SL_Longitude"=>-80.231083, "AtollVersion"=>"Active", "eNodeB_Name"=>"146423_DUNE_WALK"}]}"


def intersection_filter2_query
  unwind = { '$unwind'=> "$#{params[:filter3]}"}
  group_by = { '$group' => {'_id' => '$NodeName', 'ProductName' => {'$addToSet' => { 'pName' => '$ProductName'}} }}
  project = { '$project' => { 'ProductName' => '$ProductName', 'len' => { '$size' => '$ProductName' } } }
  project_pn = { '$project' => { 'PN' => { '$gt' => ['$len', 1] } }}
  match_pn = { '$match' => { 'PN' => true } }
  sort_asc = {'$sort' => {'_id' => 1} } 
  aggregate_pipeline = []
  aggregate_pipeline << @filter1_match  
  aggregate_pipeline << @filter2_match 
  aggregate_pipeline << unwind
  aggregate_pipeline << group_by
  aggregate_pipeline << project
  aggregate_pipeline << project_pn
  aggregate_pipeline << match_pn
  aggregate_pipeline << sort_asc  
  client[Ericsson::COLLECTION_NAME].aggregate(aggregate_pipeline)
end

params[:filter2] => "$#{params[:filter2]}"