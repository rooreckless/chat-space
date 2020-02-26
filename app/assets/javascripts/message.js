$(function(){
  //$('#new-message').on('submit',function(){
  $('#new_message').on('submit',function(e){
    e.preventDefault();
    var input = $('#message_content').prop('value');
    console.log(input);
  });
}); 