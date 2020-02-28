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
  
  function appendHTMLUserToGroup(name,id){
    //この関数は追加ボタンを押されたユーザをチャットメンバー欄に表示します。
    //が
    //※上記のままだと、再度検索を行うと追加済みユーザーが検索されてしまいます。これを避けるようにする実装は、ChatSpaceの全ての実装が終わった後、余裕があれば行ってください。
    //だそうです。
    var html = `
            <div class='chat-group-user'>
              <input name='group[user_ids][]' type='hidden' value='${id}'>
              <p class='chat-group-user__name'>${name}</p>
              <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
            </div>
            `;
    $('.js-add-user').append(html);
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
        //--追記、独自に変更しました。------------------
        //検索結果1件につき、現在表示中のグループのメンバー分だけループします。
        //もし、検索結果の1件に、現在表示中のグループのメンバーがいるなら、appendUserに渡しません。
        users.forEach(function(user) {
          var appendUserflg=true;
          //上はappendUserにuserを渡すかどうかのフラグ。

          var group_now_members=$('.js-add-user').find('input');
          //findメソッドを使用して、親要素.js-add-userの子要素中にinputタグを取得。
          //console.log(group_now_members);
          var group_now_membersAry = Array.prototype.slice.call(group_now_members);
          //上の取得した内容を配列に変換しforEachループに突入
          group_now_membersAry.forEach( function(element,index) {
          //console.log(element); 
          //console.log(element.value);
          //element.valueは、すでにこのグループに設定されている、メンバーのuser_id
          if (element.value==user.id){
            console.log("if文");
            console.log(element.value);
            appendUserflg=false;
          }
          });
          if(appendUserflg){
            appendUser(user);
          }
          appendUserflg=true;
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
  //インクリメンタルサーチ結果から、「追加ボタン」をおされたメンバーをグループに追加するイベント
  $('.chat-group-form__field--right').on("click", ".chat-group-user__btn--add", function () {
    //('.chat-group-form__field--right')要素は、「追加するボタン(.chat-group-user__btn--add")」が動的に追加されるときには静的にある親要素です。これを調査範囲とし、この中にある要素をclickした時のイベントとしています。
    var group_add_user_name=$(this).attr('data-user-name');
    var group_add_user_id=$(this).attr('data-user-id');
    //上の2つの変数は、「追加するボタン(.chat-group-user__btn--add")」が持っている属性data-user-nameとdata-user-idの属性値を出力します。
    
    $(this).parent().remove();
    //「追加するボタン」がおされた時、その親要素を子要素も含めて消します。

    
    


    
    appendHTMLUserToGroup(group_add_user_name,group_add_user_id);
    //追加するボタンが押されたユーザをチャットメンバー欄でHTMLを表示する。
  });
  //チャットグループに追加ボタン押下後、削除を押して追加する一覧から除去するイベント
  $('.js-add-user').on("click", ".chat-group-user__btn--remove", function () {
    //('.js-add-user')要素内にある、「削除ボタン(.chat-group-user__btn--")」が動的に追加されるときには静的にある親要素です。これを調査範囲とし、この中にある要素をclickした時のイベントとしています。
    
    //以下のコメントアウトは削除する領域を取得できている確認するテスト用部分です。不要なので、後に削除します。
    /*
    console.log("--remove--");
    var group_remove_user_name=$(this).parent().children('p').text();
    //この変数は、「削除するボタン(.chat-group-user__btn--remove")」の親要素の中のpタグにはさまれた文章を取得します。その後コンソール出力します。
    console.log(group_remove_user_name);

    var group_remove_user_id=$(this).parent().children('input').attr('value');
    //この変数は、「削除するボタン(.chat-group-user__btn--remove")」の親要素の中のinputタグのvalue値を取得します。その後コンソール出力します。
    console.log(group_remove_user_id);
    */
    $(this).parent().remove();
    //「削除するボタン」がおされた時、その親要素を子要素も含めて消します。
  });
});