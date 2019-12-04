Rails.application.routes.draw do
  resources :games, only: [:index, :create, :destroy]
  resources :phrases, only: [:index, :show, :create]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  resources :players, only: [:index, :show, :create, :destroy]

end
