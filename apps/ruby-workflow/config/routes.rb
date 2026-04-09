Rails.application.routes.draw do
  get "/health", to: "health#index"
  post "/workflows/start", to: "workflows#start"
end
