class UsersController < ApplicationController
  def index
    #binding.pry
    #上はテスト用のbinding.pryです。
    #users.jsからのajax通信($ajax)のdataを、
    #このアクションのparamsで受け取ってるか確認します。
    puts "ここはusers#indexです。users.jsより$.ajaxで呼び出されました。"
    puts "ajaxで送信されたdataをparmsでうけています。"
    puts "params = "
    puts params
    puts params[:keyword]
    #くどいけどさらにテスト rubyのコンソール上でも表示できるか確かめます
    respond_to do |format|
      format.html
      format.json
    end
  end
  def edit

  end
  def update
    if current_user.update(user_params)
      redirect_to root_path
    else
      render :edit
    end
  end
  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
