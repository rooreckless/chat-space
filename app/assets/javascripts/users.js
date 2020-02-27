$(function(){
  $('#user-search-field').on('keyup',function(){
    //「チャットメンバーを追加」の欄を入力した際イベントが発火し以下のコードが実行されます。
    let input = $('#user-search-field').val();
    //入力した値を変数に格納しています。
    //イベント発火したら実行するのはこのajax通信です。
    console.log(input);
    //ここのコンソール出力と、入力した値、さらに下のajax通信の送信先のusers/indexアクションでのparamsに同じ値があるはずです。
    $.ajax({
      type: 'GET',    //HTTPメソッド
      url: '/users', //users_controllerの、indexアクションにリクエストの送信先を設定する
      dataType: 'json',
      data: { keyword: input }   //テキストフィールドに入力された文字を設定する
    })
  });
});