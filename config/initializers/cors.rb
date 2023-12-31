Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
    resource '/map', headers: :any, methods: [:get, :post, :patch, :put]
    resource '*', headers: :any, methods: [:get, :post, :patch, :put]
  end
end