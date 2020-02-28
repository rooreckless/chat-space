class GroupsController < ApplicationController
  def index
    #以下は自分で考え、記入してみた文です。
    #このアプリケーションのルートである、Groups#indexにアクセスしたさい、
    #
    #_main_chat.html.haml でエラーとのこと。
    #
    # .message-form
    #= form_for [@group, @message] do |f|
    #
    #エラー内容がFirst argument in form cannot contain nil or be emptyだったことから、
    #@messageが空なのはしょうがないとして、なんとか@groupの方を空にしない方法を考えてみた。

    # @group = current_user.groups
    #@group = current_user.groups[0]
    #@message = Message.new
    #binding.pry
  end
  def new
    @group = Group.new
    #@group.users << current_user
    #@group.usersへのcurrent_userへのプッシュはいらなくなりました
  end
  def edit
    @group = Group.find(params[:id])
    #@group.users << current_user
    #@group.usersへのcurrent_userへのプッシュはいらなくなりました
  end
  def update
    @group = Group.find(params[:id])
    if @group.update(group_params)
      # redirect_to root_path, notice: 'グループを編集しました'
      redirect_to group_messages_path(params[:id]), notice: 'グループを編集しました'
    else
      render :edit
    end
  end
  def create
    #binding.pry
    @group = Group.new(group_params)
    if @group.save
      redirect_to root_path, notice: 'グループを作成しました'
    else
      render :new
    end
  end
  private
  def group_params
    params.require(:group).permit(:name, user_ids: [])
  end
end
