Rails.application.routes.draw do
  devise_for :users
  root "groups#index"
  resources :users, only: [:edit, :update,:index]
  resources :groups, only: [:new, :create, :edit, :update] do
    resources :messages, only: [:index, :create]
    #以下は、namespaceを設定したmessagesコントローラへのルーティング設定。groupsルーティングのネストになっています。
    namespace :api do
      resources :messages, only: :index, defaults: { format: 'json' }
      #このapi::message#indexはjsonでレスポンスするようにdefaultsオプションを設定
      #以上より「/groups/:id/api/messages」というURLなら、api::message#index
    end
  end
end
#ルーティングを極める参考URL
# https://railsguides.jp/routing.html
# https://techracho.bpsinc.jp/baba/2014_03_03/15619