$(function(){
  //$('#new-message').on('submit',function(){
  $('#new_message').on('submit',function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    console.log(this);
    console.log(formData);
    console.log(url);
    $.ajax({
      url: url,  //同期通信でいう『パス』
      type: 'POST',  //同期通信でいう『HTTPメソッド』
      data: FormData,  
      dataType: 'json',
      processData: false,
      contentType: false
    });
  });
}); 