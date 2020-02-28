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
    
  end
end