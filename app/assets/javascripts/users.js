$(function(){
  $('#user-search-field').on('keyup',function(){
    //「チャットメンバーを追加」の欄を入力した際イベントが発火し以下のコードが実行されます。
    let input = $('#user-search-field').val();
    $.ajax({
      type: 'GET',
      url: '/users', 
      dataType: 'json',
      data: { keyword: input } 
    }).done(function(data){
      console.log("--done--");
      console.log(data);
      //ajaxリクエスト通信を$.ajaxで行って、正常に完了したなら、そのレスポンスのjsonをdataとしてうけています。
      //レスポンスのjsonがどんなものになるのかはview/users/index.json.jbuilderで設定済みです。
      //コントローラのアクションの現在の設定ではdata=アクションの@usersです。
      //念のためコンソール出力しました。
    }).fail(function(){
      alert("エラーが発生しました。");
    });
  });
});