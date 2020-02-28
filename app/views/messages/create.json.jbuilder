json.content    @message.content
json.image      @message.image.url
#json.created_at @message.created_at.strftime("%Y年%m月%d日 %H時%M分")
#上記コメントアウトではただしく表示されないので、javascript側で正しく表示します。
json.created_at @message.created_at
json.user_name @message.user.name
#idもデータとして渡す
json.id @message.id