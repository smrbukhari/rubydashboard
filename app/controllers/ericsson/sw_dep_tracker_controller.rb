#sw deployment tracker controller
module Ericsson 
  class SwDepTrackerController < ApplicationController
    before_action :authenticate_user!

    def index
    end
  end
end