Rails.application.routes.draw do

  get 'home/index'

  devise_for :users
 # devise_for :installs
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'home#index'
  resources :products #this is route named products, need to generate a controller for this also see rails generate controller
  get 'analytics' => 'analytics#index'
  get 'demo' => 'demo#index'
  get 'plotly_line_api' => 'demo#line_chart_data'
  get 'plotly_map_api' => 'demo#map_data'
  get 'headers' => 'analytics#data_values'
  get 'displaydata' => 'analytics#data_display'
  get 'displayjson' => 'analytics#json_display'
  get 'addcolumn' => 'analytics#add_column'
  get 'addemptycolumn' => 'analytics#add_emptycolumn'
  get 'getcolumn' => 'analytics#get_columns'
  post 'upload' => 'analytics#data_upload'


  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
