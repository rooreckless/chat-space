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
    var month=forceDoubleNumber(fulldate.getMonth().toString())+'月';
    var day=forceDoubleNumber(fulldate.getDate().toString()+'日');
    var hour=forceDoubleNumber(fulldate.getHours().toString()+'時');
    var minuite=forceDoubleNumber(fulldate.getMinutes().toString()+'分');
    var return_str=year+month+day+' '+hour+minuite;
    return return_str;
  }
  
  function buildHTML(message){
    // 「もしメッセージに画像が含まれていたら」という条件式
    // console.log("----buildHTML---");
    // console.log(message.image);
    // console.log(message.image.url);
    
    if (message.image.url) {  
      // console.log("---this comment has image----");
      //メッセージに画像が含まれる場合のHTMLを作る
      var html = `
      <div class="message">
        <div class="message__info">
          <div class="message__info__sender">
            ${message.user_name}
          </div>  
          <div class="message__info__date">
            ${getCreatedAtFixed(message.created_at)}
          </div>
        <div class="lower-message">
          <p class="message__main">
            い${message.content}
          </p>
        </div>
        <img src=${message.image}>
      </div>`

    } else {
      // console.log("---no image----");
      //メッセージに画像が含まれない場合のHTMLを作る
      var html =
          `<div class="message" data-message-id=${message.id}>
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
    // console.log(this);
    // console.log(formData);
    // console.log(url);
    $.ajax({
      url: url,  //同期通信でいう『パス』
      type: 'POST',  //同期通信でいう『HTTPメソッド』
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      /*
      // console.log('--done--');
      // console.log(data);
      // console.log(data.content);
      // console.log(data.user_name);
      // console.log("--------");
      */
      var html = buildHTML(data);
      $('.message-list').append(html);
      // $('.input-box__text').prop('value').reset();
      $('.input-box__text').val("");
      //console.log($('.messages-list')[0].scrollHeight);
      
      var list=$('.message-list').children();
      $('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight});
      $('[type="submit"]').attr('disabled', false);
    }).fail(function(){
      alert("メッセージ送信に失敗しました");
    });
  });
}); 