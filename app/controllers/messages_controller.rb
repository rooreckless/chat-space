class MessagesController < ApplicationController
  before_action :set_group

  def index
    @message = Message.new
    #下のフォームへの新規メッセージ用のモデルMessage型インスタンス変数
    @messages = @group.messages.includes(:user)
    #メッセージ全表示用のインスタンス変数@messages(@groupから、messagesを引き出す。)
  end

  def create
    @message = @group.messages.new(message_params)
    if @message.save
      redirect_to group_messages_path(@group), notice: 'メッセージが送信されました'
    else
      @messages = @group.messages.includes(:user)
      flash.now[:alert] = 'メッセージを入力してください。'
      render :index
    end
  end

  private

  def message_params
    params.require(:message).permit(:content, :image).merge(user_id: current_user.id)
  end

  def set_group
    @group = Group.find(params[:group_id])
  end
end