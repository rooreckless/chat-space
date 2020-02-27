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
      <div class="message">
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
}); 