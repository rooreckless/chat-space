$(function(){
  function forceDoubleNumber(str){
    if (str.length==1){
      str='0'+str;
    }
    return str;
  }
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
      $('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight});
      $('[type="submit"]').attr('disabled', false);
    }).fail(function(){
      alert("メッセージ送信に失敗しました");
    });
  });
  var reloadMessages = function() {
    var last_message_id = $('.message:last').data("message-id");
    // 現在表示しているメッセージは<div class="message">達である。これらの内最後の要素のdata-message-id値を取得する。これが現在表示しているメッセージ中の最新id。
    //以下は確認用のコンソール出力。
    
    //console.log(last_message_id);
    //console.log($('.message:last').html());
    //console.log($('.message:last').find(".message__info__date").text());
    
    //ajax通信開始
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      //特にurlは、「なにも指定しない」とこのajax通信をよびだした元のURLになります。
      //TODO:通常このmessage.jsを呼ぶ元は「group/そのgroupのid値/messages」です。
      //ならば、jsonのurlに"api/messages"と設定しておくと、このajaxリクエスト先は「group/そのgroupのid値/api/messages」にできるか検証しましょう。
      //→無事「Started GET "/groups/6/api/messages」となっていることを確認し、api/messages#indexアクションの起動を確認しました。
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める。
      data: {id: last_message_id}
      //上のdataオプションのおかげで、「group/:group_id/api/messages」の飛び先＝「api/messages#index」でparamsをみれば、TODO:params[id:]としたら、この画面内で現在表示の最新のメッセージid値がでるはず。
      //→params[id:]確認しました。大丈夫です。
    })
    .done(function(messages) {
      //デバッグ用コンソール表示
      console.log('success');
      if (messages.length !== 0){
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          console.log(last_message_id);
          console.log(message);
          //上は正しく表示される内容を確認するためのデバッグ用コンソール出力です。
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.message-list').append(insertHTML);
        $('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
    }
    //自己流デバッグ 「group/そのgroupのid値/messages」のURLを起動してwindow.onload=画像やDOMなど全部読み込みが終わったら、reloadMessages変数に入ってる関数を起動します。
    //参考ページは https://rcmdnk.com/blog/2015/07/11/computer-javascript-jquery/
    //でもなんの意味もなかった...。結局自力でリロードしないといけなくなり、リロードしたらDBから最新の状況を下ろすからいみがなかった...。
    //window.onload=reloadMessages;
  setInterval(reloadMessages, 7000);
}); 