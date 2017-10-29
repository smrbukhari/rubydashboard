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

/static_plot_generation?filter1=Region&filter1_option%5B%5D=North+Central&filter2=ProductName&filter2_option%5B%5D=DUS4101&filter2_option%5B%5D=DUS4102&filter3=Market

