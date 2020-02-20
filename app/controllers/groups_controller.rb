class GroupsController < ApplicationController
  def index
    
  end
  def new
    @group = Group.new
    @group.users << current_user
  end
  def edit
    @group = Group.find(params[:id])
    @group.users << current_user
  end
  def update
    @group = Group.find(params[:id])
    if @group.update(group_params)
      redirect_to root_path, notice: 'グループを編集しました'
    else
      render :edit
    end
  end
  def create
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
