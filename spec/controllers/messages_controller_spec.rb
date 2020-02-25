require 'rails_helper'
#以下はmessage「コントローラ」に対するテストです。
# describe MessagesController do
describe MessagesController do
  let(:group) { create(:group) }
  let(:user) { create(:user) }

  describe '#index' do
    #以下のcontextはログイン状態でのtest
    context 'log in' do
      #コンテキスト内のあらゆるexampleをやる前にまず、beforeを実施します。
      before do
        #下のloginはsuppoet/controller_macros.rb
        login user
        #疑似的なindexアクション(ログイン状態)
        get :index, params: { group_id: group.id }
      end
      #
      it 'assigns @message' do
        #ログイン直後に作成するインスタンス変数@messageは,formがでてくるところのからのmessage型かどうか。
        #be_a_newマッチャを利用することで、 対象が引数で指定したクラスのインスタンスかつ未保存のレコードであるかどうか確かめることができます
        expect(assigns(:message)).to be_a_new(Message)
      end

      it 'assigns @group' do
        #ログイン直後に表示されるインスタンス変数@groupは、このアプリケーションのgroupのインスタンスなのか
        expect(assigns(:group)).to eq group
      end

      it 'renders index' do
        #ログイン状態でのindexアクションの結果、indexビューが出ることについて
        expect(response).to render_template :index
      end
    end

    context 'not log in' do
      before do
        #macroのloginを使わないので、非ログイン状態での、indexを呼ぶURLを使います。
        get :index, params: { group_id: group.id }
      end

      it 'redirects to new_user_session_path' do
        #非ログイン状態で、indexを呼ぶと、疑似ログインの結果得られたレスポンスと、リダイレクト先が一致するか
        #redirect_toマッチャは引数にとったプレフィックスにリダイレクトした際の情報を返すマッチャ
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
  #==============================================
  #==============================================
  describe '#create' do
    #全体的な準備
    #letメソッドを用いてparamsを定義しています。これは、擬似的にcreateアクションをリクエストする際に、引数として渡すためのものです。 attributes_forはcreate、build同様FactoryBotによって定義されるメソッドで、オブジェクトを生成せずにハッシュを生成するという特徴があります。
    let(:params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message) } }
    #==============================================
    #ログイン状態
    context 'log in' do
      before do
        login user
      end
      #---------------------------
      #ログイン状態かつ、セーブ可能のコンテクスト
      context 'can save' do
        #expectの引数を準備「投稿した時」ということで、HTTPpostメソッドでcreateを行う。
        subject {
          post :create,
          params: params
        }
        #メッセージの保存はできたのか
        it 'count up message' do
          expect{ subject }.to change(Message, :count).by(1)
          #changeマッチャ - 引数が変化したかどうかを確かめる
          #今回は、Message, :countの数が1個増えたかを確かめる。
        end
        #意図した画面に遷移しているか
        it 'redirects to group_messages_path' do
          subject
          #上では、subject実行後、下で遷移を確かめる
          expect(response).to redirect_to(group_messages_path(group))
        end
      end
      #---------------------------
      #ログイン状態かつ、セーブ不可能のコンテクスト
      context 'can not save' do
        #準備
        let(:invalid_params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message, content: nil, image: nil) } }
        subject {
          post :create,
          params: invalid_params
        }
        #メッセージの保存は行われなかったか
        it 'does not count up' do
          expect{ subject }.not_to change(Message, :count)
        end
        #意図したビューが描画されているか
        it 'renders index' do
          subject
          expect(response).to render_template :index
        end
      end
    end
#==============================================
    #非ログイン状態
    context 'not log in' do
      #意図した画面にリダイレクトできているか
      it 'redirects to new_user_session_path' do
        post :create, params: params
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end