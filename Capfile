#このファイルは、bundle exec cap installの結果できたファイルです。
#capistrano全体の設定を記述します。
#下記のディレクトリがrequireで読み込まれ、デプロイについての必要な動作が記述される。
require "capistrano/setup"
require "capistrano/deploy"
require 'capistrano/rbenv'
require 'capistrano/bundler'
require 'capistrano/rails/assets'
require 'capistrano/rails/migrations'
require 'capistrano3/unicorn'

Dir.glob("lib/capistrano/tasks/*.rake").each { |r| import r }