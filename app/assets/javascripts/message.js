$(function(){
  //一桁だけの数字を受け取ったら「0」な文字列を頭に付けてかえすメソッド
  function forceDoubleNumber(str){
    if (str.length==1){
      str='0'+str;
    }
    return str;
  }
  //日付を正しい形式に変換して文字列として返すメソッド
  function getCreatedAtFixed(str){
    var fulldate=new Date(str);
    var year=(fulldate.getFullYear().toString()+'年');
    var month=forceDoubleNumber((fulldate.getMonth()+1).toString())+'月';
    var day=forceDoubleNumber(fulldate.getDate().toString()+'日');
    var hour=forceDoubleNumber(fulldate.getHours().toString()+'時');
    var minuite=forceDoubleNumber(fulldate.getMinutes().toString()+'分');
    var return_str=year+month+day+' '+hour+minuite;
    return return_str;
  }
  //新着メッセージを動的に画面に出力するhtml要素を文字列として返すメソッド
  function buildHTML(message){
    if (message.image) {  
      var html = `
      <div class="message" data-message-id="${message.id}">
        <div class="message__info">
          <div class="message__info__sender">
            ${message.user_name}
          </div>  
          <div class="message__info__date">
            ${getCreatedAtFixed(message.created_at)}
          </div>
        </div>
        <div class="lower-message">
          <p class="message__main">
            ${message.content}
          </p>
          <img src=${message.image}>
        </div>
      </div>`
    } else {
      var html =
          `<div class="message" data-message-id="${message.id}">
            <div class="message__info">
              <div class="message__info__sender">
                ${message.user_name}
              </div>
              <div class="message__info__date">
                ${getCreatedAtFixed(message.created_at)}
              </div>
            </div>
            <div class="lower-message">
              <p class="lower-message__main">
                ${message.content}
              </p>
            </div>
          </div>`
    }
    return html
  }
  //イベント 新規メッセージ入力フォームのSendボタンを押した時(ajaxリクエスト実施)
  $('#new_message').on('submit',function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.message-list').append(html);
      $('.input-box__text').val("");
      // 上はテキスト入力部分を入力後に値を消す方法
      $('input[type=file]').val('');
      // 上は画像ファイル選択部分をアップロード後に値を消す方法
      $('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight});
      $('[type="submit"]').attr('disabled', false);
    }).fail(function(){
      alert("メッセージ送信に失敗しました");
    });
  });
  //画面内表示のメッセージが最新のものではないなら、動的に表示する(←という役割を持つ無名関数を持つ変数)(ajaxリクエスト実施)
  var reloadMessages = function() {
    var last_message_id = $('.message:last').data("message-id");
    //ajax通信開始
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める。
      data: {id: last_message_id}
    })
    .done(function(messages) {
      //ajaxリクエストの結果のレスポンスである@messagesが1件以上あるなら、以下doneの中身を実行します。
      if (messages.length !== 0){
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加 その後スクロール
        $('.message-list').append(insertHTML);
        $('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  }
  //メッセージの表示を自動更新を実行している箇所
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
    //自動更新メソッドを持つ変数reloadMessagesへのアクセス以下の条件とする。
    //ブラウザで現在アクセスしているURL が正規表現「/groups/なにか数字/messages」とマッチするか。
  }
}); 