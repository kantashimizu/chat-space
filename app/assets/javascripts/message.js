$(function(){

  function buildMessage(message){
    image = (message.image)?`<img class= "lower-message__image" src=${message.image}>` : "";
    var html = `<div class="message">
                  <div class="message_group">
                  <div class="message_upper-info">
                  ${message.name}
                  </div>
                <div class="message_upper-info_data">
                  ${message.created_at}
                    </div>
                </div>
                <div class="message_text">
                  <p class="lower-message__content">
                    ${message.content}
                  </p>
                    ${image}
                  </div>
                </div>`
    $('.messages').append(html);
  }

  $('.new_message').on('submit',function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url =$(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    }) 
    .done(function(message){
      var html = buildMessage(message);
      $('.messages').append(html)
      $('.form__message').val('')
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
      $('form')[0].reset();
    

    })
    .fail(function(){
      alert("メッセージ送信に失敗しました");
    })
    return false;
  })
});