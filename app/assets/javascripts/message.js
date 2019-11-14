$(function(){

  function buildMessage(message){
    let image = (message.image)?`<img class= "lower-message__image" src=${message.image}>` : "";
    let html = `<div class="message" data-message-id="${message.id}">
                  <div class="message_group">
                  <div class="message_upper-info">
                  ${message.user_name}
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
      buildMessage(message);
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
      $('form')[0].reset();
    })
    .fail(function(){
      alert("メッセージ送信に失敗しました");
    })
    return false;
  })

  let reloadMessages = function () {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      let last_message_id = $('.message:last').data("message-id");
      $.ajax({
        url:"api/messages",
        type: 'GET',
        dataType: 'json',
        data: {last_id: last_message_id}
      })
      .done(function(messages) {
        let insertHTML = '';
        messages.forEach(function(message){
          insertHTML = buildMessage(message);
          $('.messages').append(insertHTML);
          $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
        })
      })
      .fail(function(){
        alert("失敗です");
      });
    }
  }
  setInterval(reloadMessages, 5000);
});
