#このファイルはbundle exec cap installでできたファイルです。
#production環境、staging環境どちらにも当てはまる設定を記述することとなります。
#・アプリケーション名
#・gitのレポジトリ
#・利用するSCM
#・タスク
#・それぞれのタスクで実行するコマンド
#・を記述することになります。
#---------------

# config valid only for current version of Capistrano
# capistranoのバージョンを記載。固定のバージョンを利用し続け、バージョン変更によるトラブルを防止する
lock '3.12.0'

# Capistranoのログの表示に利用する
set :application, 'chat-space'

# どのリポジトリからアプリをpullするかを指定する
set :repo_url,  'git@github.com:rooreckless/chat-space.git'

# バージョンが変わっても共通で参照するディレクトリを指定
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'public/uploads')

set :rbenv_type, :user
set :rbenv_ruby, '2.5.1' #カリキュラム通りに進めた場合、2.5.1か2.3.1です

# どの公開鍵を利用してデプロイするか
#keys:に入ってるパスは、ローカルPCのEC2インスタンスのSSH鍵(pem)へのパスです。
set :ssh_options, auth_methods: ['publickey'],
                  keys: ['~/.ssh/Chatspace.pem'] 

# プロセス番号を記載したファイルの場所
set :unicorn_pid, -> { "#{shared_path}/tmp/pids/unicorn.pid" }

# Unicornの設定ファイルの場所
set :unicorn_config_path, -> { "#{current_path}/config/unicorn.rb" }
set :keep_releases, 5

# デプロイ処理が終わった後、Unicornを再起動するための記述
#after 'deploy:publishing', 'deploy:restart'
#namespace :deploy do
#  task :restart do
#    invoke 'unicorn:restart'
#  end
#end
#上記部分は、secrets.ymlを.gitignoreに入れてしまったあとに、本番環境に反映してもらうために、以下の部分に置き換えられました。

# secrets.yml用のシンボリックリンクを追加し、shared/config/secrets.ymlを参照するよう変更。
set :linked_files, %w{ config/secrets.yml }

# 元々記述されていた after 「'deploy:publishing', 'deploy:restart'」以下を削除して、次のように書き換え

after 'deploy:publishing', 'deploy:restart'
namespace :deploy do
  #デプロイ処理が終わった後、Unicornを再起動
  task :restart do
    invoke 'unicorn:restart'
  end
  #以下は、gitignoreに記載されているsecrets.ymlを、Githubを経由せずにデプロイするための記述
  desc 'upload secrets.yml'
  task :upload do
    on roles(:app) do |host|
      if test "[ ! -d #{shared_path}/config ]"
        execute "mkdir -p #{shared_path}/config"
      end
      upload!('config/secrets.yml', "#{shared_path}/config/secrets.yml")
    end
  end
  before :starting, 'deploy:upload'
  after :finishing, 'deploy:cleanup'
end