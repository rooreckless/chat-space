$(function(){
  function appendNoUser(){
    var html = `
            <div class="chat-group-user clearfix">
              <p class="chat-group-user__name">ユーザーが見つかりません</p>
            </div>
            `;
    $("#user-search-result").append(html);
  }
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
    let input = $('#user-search-field').val();
    $.ajax({
      type: 'GET',
      url: '/users', 
      dataType: 'json',
      data: { keyword: input } 
    }).done(function(users){
      $('#user-search-result').empty();
        if (users.length !== 0) {
        users.forEach(function(user) {
          var appendUserflg=true;
          var group_now_members=$('.js-add-user').find('input');
          var group_now_membersAry = Array.prototype.slice.call(group_now_members);
          group_now_membersAry.forEach( function(element,index) {
          if (element.value==user.id){
            appendUserflg=false;
          }
          });
          if(appendUserflg){
            appendUser(user);
          }
          appendUserflg=true;
          });
      } else if (input.length == 0) {
        return false;
      } else {
        appendNoUser();
      }
    }).fail(function(){
      alert("ユーザー検索に失敗しました");
    });
  });
  $('.chat-group-form__field--right').on("click", ".chat-group-user__btn--add", function () {
    var group_add_user_name=$(this).attr('data-user-name');
    var group_add_user_id=$(this).attr('data-user-id');
    $(this).parent().remove();
    appendHTMLUserToGroup(group_add_user_name,group_add_user_id);
  });
  $('.js-add-user').on("click", ".chat-group-user__btn--remove", function () {
    $(this).parent().remove();
  });
});