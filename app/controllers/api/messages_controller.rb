class Api::MessagesController < ApplicationController
  # このアクションはajaxで呼ばれるはずです。
  def index
    group = Group.find(params[:group_id])
    # 現在表示している画面のグループidをparams=ajaxのjsonからとり、検索。
    # ↑？ルーティングからとる？ajaxではなくて?(ルーティング設定と合わせてこのアクションへつなげるようにビューのリンクを変えるかも？)
    last_message_id = params[:id].to_i
    # ajaxで送られてくる最後のメッセージのid番号を変数に代入
    @messages = group.messages.includes(:user).where("id > ?", last_message_id)
    # 取得したグループでのメッセージ達から、idがlast_message_idよりも新しい(大きい)メッセージ達のみを取得
    #whereの中はDBの検索の条件ですが、messagesテーブル内のid>lastmessage_idという条件にしたい。
    # https://www.sejuku.net/blog/71189 を参考。
    
    respond_to do |format|
       format.html
       format.json
    end
    #jsonレスポンスを行います
    #TODO:これがなくても表示がされた理由がわからない...。なぜ？
    
    puts "|||||||||||||||"
    puts params
    puts "last_message_id = #{last_message_id}"
    # 上はajax通信が無事できているか確認用のparams表示
    #--結論--
    #無事、
    #「url→group/groupのid値/messages」にアクセスしたら、messages.jsのデバッグ用windows.onloadが発火
    #→messages.js内のajaxリクエストメソッドが起動。jsonリクエスト用のキーバリューで「url: "api/messages"」と「data: {id: last_message_id}」を設定
    #   (last_message_id=$('.messages:last').data(message-id)として、あらかじめそのメッセージのDBのid=カスタムデータ属性値としてるのを取得。)
    #→リクエスト先が「group/groupのid値/api/messages」になり、rails rouetsより,api/messages#indexが起動。(=このファイルのこのアクション)
    #→上のputs paramsで、コンソールに{id : 現在「url→group/groupのid値/messages」ページで表示しているメッセージ中の最新メッセージid}
    #が表示されることを確認しました。
    
  end
end