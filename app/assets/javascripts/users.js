$(function(){
  $('#user-search-field').on('keyup',function(){
    //「チャットメンバーを追加」の欄を入力した際イベントが発火し以下のコードが実行されます。
    let input = $('#user-search-field').val();
    //入力した値を変数に格納しています。
    console.log(input);
    //ここでは、入力した文字をコンソール出力しています。
  });
});