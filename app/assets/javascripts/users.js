$(function(){
  //検索結果一覧なHTML要素を作って表示する。
  function appendUser(users){
    var html = "";
    debugger;
    //検索してもユーザがひとりもいない場合の要素を作成
    if (users.length==0){
      html = `
            <div class="chat-group-user clearfix">
              <p class="chat-group-user__name">ユーザーが見つかりません</p>
            </div>
                    `;
    }else{
      //検索してもユーザがひとりもいない場合の要素を作成
      users.forEach(function(user){
      html = html + `
            <div class="chat-group-user clearfix">
              <p class="chat-group-user__name">${user.name}</p>
              <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
            </div>
            `;});
    }
    $("#user-search-result").append(html);
  }
  $('#user-search-field').on('keyup',function(){
    //「チャットメンバーを追加」の欄を入力した際イベントが発火し以下のコードが実行されます。
    let input = $('#user-search-field').val();
    $.ajax({
      type: 'GET',
      url: '/users', 
      dataType: 'json',
      data: { keyword: input } 
    }).done(function(data){
      //まずすでに表示している検索結果部分のHTML要素を消す
      $('#user-search-result').empty();
      //検索結果を作成して表示してもらいます。
      appendUser(data);
    }).fail(function(){
      alert("ユーザー検索に失敗しました");
    });
  });
});