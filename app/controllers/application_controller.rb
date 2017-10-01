class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  def after_sign_in_path_for(resource)
  	analytics_path
  end

  def client 
	client_host = ['localhost:27017']
	client_options = {
				database: 'development',
				user: 'mydbuser',
				password: 'dbuser'
			}	
	Mongo::Client.new(client_host, client_options)
  end


end




