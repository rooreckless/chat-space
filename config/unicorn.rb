#サーバ上でのアプリケーションコードが設置されているディレクトリを変数に入れておく
#app_path = File.expand_path('../../', __FILE__)
#capistrano導入に伴いapp_pathを変更します。
app_path = File.expand_path('../../../', __FILE__)

#アプリケーションサーバの性能を決定する
worker_processes 1
#以下のサイトではこの値の設定について考察があります。
#https://qiita.com/k5trismegistus/items/d63b453f27981e7864e7

#アプリケーションの設置されているディレクトリを指定
#working_directory app_path
#capistrano導入に伴いworking_directoryを変更します。
working_directory "#{app_path}/current"

#Unicornの起動に必要なファイルの設置場所を指定
#pid "#{app_path}/tmp/pids/unicorn.pid"
##capistrano導入に伴いpidの生成先を変更します。
pid "#{app_path}/shared/tmp/pids/unicorn.pid"

#ポート番号を指定
#listen 3000
#下はnginxを介した処理になるよう設定している部分です。
#listen "#{app_path}/tmp/sockets/unicorn.sock"
#サーバーはこのポート番号を開放する必要があります。
##capistrano導入に伴いlisten先を変更します。
listen "#{app_path}/shared/tmp/sockets/unicorn.sock"

#エラーのログを記録するファイルを指定
#stderr_path "#{app_path}/log/unicorn.stderr.log"
##capistrano導入に伴いstderr_pathの生成先を変更します。
stderr_path "#{app_path}/shared/log/unicorn.stderr.log"


#通常のログを記録するファイルを指定
#stdout_path "#{app_path}/log/unicorn.stdout.log"
##capistrano導入に伴いstderr_pathの生成先を変更します。
stdout_path "#{app_path}/shared/log/unicorn.stdout.log"

#Railsアプリケーションの応答を待つ上限時間を設定
timeout 60

#以下は応用的な設定なので説明は割愛

preload_app true
GC.respond_to?(:copy_on_write_friendly=) && GC.copy_on_write_friendly = true

check_client_connection false

run_once = true

before_fork do |server, worker|
  defined?(ActiveRecord::Base) &&
    ActiveRecord::Base.connection.disconnect!

  if run_once
    run_once = false # prevent from firing again
  end

  old_pid = "#{server.config[:pid]}.oldbin"
  if File.exist?(old_pid) && server.pid != old_pid
    begin
      sig = (worker.nr + 1) >= server.worker_processes ? :QUIT : :TTOU
      Process.kill(sig, File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH => e
      logger.error e
    end
  end
end

after_fork do |_server, _worker|
  defined?(ActiveRecord::Base) && ActiveRecord::Base.establish_connection
end