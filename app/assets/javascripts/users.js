$(function(){
  //検索結果がない時ようのHTML要素を作って表示します。
  function appendNoUser(){
    //検索してもユーザがひとりもいない場合の要素を作成
    var html = `
            <div class="chat-group-user clearfix">
              <p class="chat-group-user__name">ユーザーが見つかりません</p>
            </div>
            `;
    $("#user-search-result").append(html);
  }
  //検索結果一覧なHTML要素を作って表示する。
  function appendUser(user){
    var html = `
            <div class="chat-group-user clearfix">
              <p class="chat-group-user__name">${user.name}</p>
              <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
            </div>
            `;
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
    }).done(function(users){
      //まずすでに表示している検索結果部分のHTML要素を消す
      $('#user-search-result').empty();

      //検索結果を作成して表示してもらいます。
      //まず検索結果が0件かどうかで分けます。
      if (users.length !== 0) {
        //検索結果がある場合、下のforEach文を使い、１件ずつ、appendUserに渡します。
        users.forEach(function(user) {
          appendUser(user);
          //appendUserは最後に作成した要素を「("#user-search-result").append(作成した要素)」します。
          //forEachループで呼んだとしても("#user-search-result")の子要素として追加appendするのであり、子要素を上書きするわけではないので、繰り返し呼び出していいです。
        });
      } else if (input.length == 0) {
        //そもそもなんの文字も入力せず(input.length == 0)で検索している場合の処理です。
        return false;
      } else {
        //まず検索しても0件の処理です。
        appendNoUser();
      }
    }).fail(function(){
      alert("ユーザー検索に失敗しました");
    });
  });
});