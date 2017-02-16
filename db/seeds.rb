# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

	maps = Testmap.create([{ applicant: 'Vuenafe',longitude: '-122.3969371393', latitude: '37.7852809995' }])
	maps = Testmap.create([{ applicant: 'The Chai Cart',longitude: '-122.4027041719', latitude: '37.7928878955' }])
	maps = Testmap.create([{ applicant: 'Two Gs Catering',longitude: '-122.3969549674', latitude: '37.7919857424' }])