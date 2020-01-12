# このアプリについて

## chat-spaceとは
TECH::EXPERTのカリキュラム内で開発を行う、グループチャットアプリです。

## 概要
アプリ名： chat-space <br>

使用言語：Ruby on Rails、JavaScript <br>

主な機能：ユーザー登録、投稿機能、非同期投稿、インクリメンタルサーチ機能、自動更新機能 <br>

作業人数：１人 <br>

作業時間：9日間 <br>

## 具体的な機能紹介
### 非同期投稿
![38a143133c6d95f83b47cba1f00ba706](https://user-images.githubusercontent.com/57340298/72162523-7fb0de80-3405-11ea-8b25-77e6d29868d7.gif)<br>

:star:上記の様に投稿内容がリロードする事なく表示されます。<br>
⑴ jsファイルの作成する<br>
⑵ フォーム送信後、イベント発火<br>
```
$(function(){ //これは決まり

//new_messageクラスで送信ボタンが押された時の処理を書くよ
  $('.new_message').on('submit', function(e){   

//デフォルトのイベント停止（フォーム送信の停止)
  e.preventDefault(); 

  })
})
```
⑶ イベント発火後、Ajaxを使用して、createアクションの始動<br>
```
//ここから
$('.new_message').on('submit', function(e){
  e.preventDefault();
//ここまでは上記

//thisでイベントが起こったところを特定し、そこのフォームデータを取得後、変数ｆｏｒｍDataに代入
  let formData = new FormData(this); 

//フォームの送信先urlを自動取得し変数urlに代入
  let url = $(this).attr('action')

  $.ajax({ //決まり
    url: url, //上で定義
    type: "POST", //HTTPメソッド(今回はcreateアクションに送るので)
    data: formData, //上で定義
    dataType: 'json', //json形式で送る
    processData: false, //この辺は決まり
    contentType: false //この辺は決まり
  })
  ```
⑷ createアクションでメッセージを保存し、respond_toを使用してHTMLとJSONで処理を分ける<br>
```
#createアクションの編集
def create

#メッセージを取得し、@messageに代入(過去のカリキュラム)
    @message = @group.messages.new(message_params)

#@messageが保存されたら
    if @message.save
#htmlとjsonの分岐
      respond_to do |format|
        format.html { redirect_to "group_messages_path(params[:group_id])" }
        format.json
      end  
#保存されなかったら
    else
#処理を記述
    end
end
```
⑸ jbuilderを使用。作成したメッセージをJSON形式で返す<br>
```
json.id      @message.id
json.content @message.content 
json.date    @message.created_at.strftime("%Y/%m/%d %H:%M")
json.user_name @message.user.name
json.image   @message.image.url
```
⑹返ってきたJSONを受取り、HTMLの作成する<br>
```
//ajax処理の直後に記入

//成功した時の処理を記述(フォームに入力された内容"data"を引数にする)
.done(function(data){

//そのデータを元にhtmlを作成する、処理の呼び出し(処理の詳細は後ほど)
    buildHTML(data);

  })
```
⑺ 6で作成したHTMLを画面に追加する<br>
```
//各自定義しているクラスと異なる場合があるので注意

//htmlを作るよっていう関数
function buildHTML(message){

//画像データがある時とない時で処理を分け、変数imageに代入
    image = ( message.image ) ? `<img class= "lower-message__image" src=${message.image} >` : "";

//ここからはhtmlを記述し変数htmlに代入。jbuilderで定義した変数はここで使われる
    let html = `<div class=message>
                    <div class="upper-message">
                      <div class="upper-message__user-name">
                      ${message.user_name}　
                      </div>
                      <div class="upper-message__date">
                      ${message.date}
                      </div>
                    </div>
                    <div class="lower-message">
                      <p class="lower-message__content">
                      ${message.content}
                      </p>
                      ${image}
                    </div>
                  </div> `

//作ったhtmlをmessagesクラスにぶち込む
    $('.messages').append(html); 
  }
```
⑻ メッセージを送信したとき、最下部にスクロールする
```
.done(function(data){
    buildHTML(data);   

//animateメソッドを使い自動スクロールを設定 
    $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');   

//入力欄の値をリセットにする    
    $('form')[0].reset();
  })
  ```
⑼ 連続で送信ボタンを押せるようにする<br>
```
//$('.new_message').on('submit', function(e){　の処理の最後に
return false;
//と記述
```
⑽ 非同期に失敗した場合の処理も準備する<br>
```
//doneの処理の後に記述(失敗した時という意味)
.fail(function(){
      alert('error');
    });
```

### インクリメンタルサーチ機能
![c8ae20cedd355c3d32d7c2ddb02ec76e](https://user-images.githubusercontent.com/57340298/72162756-e1714880-3405-11ea-98d4-31b8ef8d37f9.gif)<br>
上記の様に検索結果を非同期で表示出来る様になっております<br>
⑴ルーティングなどAPI側の準備をする
```
def index
#検索した条件に当てはまるユーザーを@usersに代入
  @users = User.search(params[:keyword], current_user.id)

#htmlとjsonで処理を分ける
  respond_to do |format|
    format.html
    format.json
  end
end

json.array! @users do |user|
  json.id user.id
  json.name user.name
end
```
⑵テキストフィールドを作成する
⑶テキストフィールドに入力されるたびにイベントが発火するようにする
```
$(function() {

//検索欄に文字入力されるたびに処理を行う
  $("#user-search-field").on("keyup", function() {

//検索欄に入力された文字をvalで取得し変数inputに代入
      let input = $("#user-search-field").val();
});
```
⑷イベント時に非同期通信できるようにする
```
$.ajax({
      type: "GET", //httpメソッド(今回はget)
      url: "/users", //送る先のurl

//keyを自分で決め(今回は"keyword"と定義)valueには先ほど検索欄から取得し代入したinputの値を使う
      data: { keyword: input }, 
      dataType: "json"
    })

//ちゃんと動いているかを確認するために一時的にconsole.log
      .done(function(users) {
        console.log("成功です");
      })

//ちゃんと動いているかを確認するために一時的にconsole.log
      .fail(function() {
        console.log("失敗です");
      });
  });
});
```
⑸非同期通信の結果を得て、HTMLを作成する
⑹作成したHTMLをビュー上に追加する
```
//jbuilderファイルで作った配列を引数にしdone関数を起動
.done(function(users) {

//if,else if,elseどの場合においても、処理後は、すでに検索欄に出力されている情報を削除する。
        $("#user-search-result").empty();

//検索に一致するユーザーが０じゃない場合(いる場合)
        if (users.length !== 0) {

//usersという配列をforEachで分解し、ユーザーごとにaddUser関数に飛ばす(処理は後ほど)
          users.forEach(function(user) {
            addUser(user);
          });

//入力欄に文字が入力されてない場合処理を終了
        } else if (input.length == 0) {
          return false;

//検索に一致するユーザーがいない場合はaddNoUserに飛ばす
        } else {
          addNoUser();
        }
      })
      
function addUser(user) {
    let html = `
      <div class="chat-group-user clearfix">
        <p class="chat-group-user__name">${user.name}</p>
        <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
      </div>
    `;

//作ったhtmlをぶち込む
    $("#user-search-result").append(html);
  }


//一致するユーザーがいなかった場合の処理
  function addNoUser() {
    let html = `
      <div class="chat-group-user clearfix">
        <p class="chat-group-user__name">ユーザーが見つかりません</p>
      </div>
    `;
//作ったhtmlをぶち込む
    $("#user-search-result").append(html);
  }
```
⑺エラー時の処理を行う
```
.fail(function() {
        alert("通信エラーです。ユーザーが表示できません。");
      });
```
⑻追加ボタンが押された時にイベントが発火するようにする
⑼追加ボタンをクリックされたユーザーの名前を、チャットメンバーの部分に追加し、検索結果からは消す
```
$(document).on("click", ".chat-group-user__btn--add", function() {

//クリックされたところのデータを取得し各変数に代入
    const userName = $(this).attr("data-user-name");
    const userId = $(this).attr("data-user-id");

//クリックされたところのhtmlを親要素をごと消す（検索結果から消す）
    $(this)
      .parent()
      .remove();

//削除ボタンの書いてあるhtmlを呼び出す処理に飛ばす
    addDeleteUser(userName, userId);


//ユーザーをグループに登録するための処理
    addMember(userId);
  });

  });
  
function addDeleteUser(name, id) {
    let html = `
    <div class="chat-group-user clearfix" id="${id}">
      <p class="chat-group-user__name">${name}</p>
      <div class="user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn" data-user-id="${id}" data-user-name="${name}">削除</div>
    </div>`;

//作ったhtmlをぶち込む
    $(".js-add-user").append(html);
  }


function addMember(userId) {

//userのidをinputタグの初期値としそれをnameを使ってgroupsコントローラ内のparamsで受け取る準備
    let html = `<input value="${userId}" name="group[user_ids][]" type="hidden" id="group_user_ids_${userId}" />`;

//作ったinputタグをaddDeleteUser内で作ったhtml内にぶち込む
    $(`#${userId}`).append(html);
  }
  
```
⑽削除を押すと、チャットメンバーから削除される
```
$(document).on("click", ".chat-group-user__btn--remove", function() {

//クリックされたところのhtmlを親要素をごと消す（検索結果から消す）
    $(this)
      .parent()
      .remove();
  });
```

### 自動更新機能
![75605dcb2a3056730005f12b929988db](https://user-images.githubusercontent.com/57340298/72163060-707e6080-3406-11ea-809d-ac2c33ee4997.gif)<br>
上記の様に時間の経過とともに自動でリロードされます。<br>
⑴表示されているメッセージのHTMLにid情報を追加
```
//メッセージ全体にidを付与。   ※#{message.id}はjbuilderファイルで定義している
.message{"data-message-id": "#{message.id}"}
```
⑵メッセージを更新するためのアクションを実装
```
class Api::MessagesController < ApplicationController

  def index

#今いるグループの情報をparamsによって取得し変数@groupに代入
    @group = Group.find(params[:group_id]) 

#グループ内のメッセージでlast_idよりも大きいidのメッセージがないかを探してきてそれらを@messageに代入
    @messages = @group.messages.includes(:user).where('id > ?', params[:last_id])
  end
end
```
⑶追加したアクションを動かすためのルーティングを実装
```
Rails.application.routes.draw do
  devise_for :users
  root 'groups#index'
  resources :users, only: [:index, :edit, :update]
  resources :groups, only: [:new, :create, :edit, :update] do
    resources :messages, only: [:index, :create]
#ここからが追加
    namespace :api do
      resources :messages, only: :index, defaults: { format: 'json' }
    end
  end
end
```
⑷追加したアクションをリクエストするよう実装
```
let reloadMessages = function () {

//ブラウザに表示されている最後のメッセージからidを取得して、変数に代入
      let last_message_id = $('.message:last').data("message-id");

//ajaxの処理   
      $.ajax({

//今回はapiのmessagesコントローラーに飛ばす
        url: "api/messages",
//HTTP＿メソッド
        type: 'get',
//データはjson型で
        dataType: 'json',

//キーを自分で決め（今回はｌａｓｔ_id)そこに先ほど定義したlast_message_idを代入。これはコントローラーのparamsで取得される。
        data: {last_id: last_message_id} 
      })

//doneの処理（仮)
    .done(function(messages) {
    console.log('success');
  })

//failの処理（仮)
    .fail(function() {
      console.log('error');
  });
```
⑸取得した最新のメッセージをブラウザのメッセージ一覧に追加
```
.done(function (messages) { 

//追加するhtmlの入れ物をつくる
      let insertHTML = '';

//取得したメッセージたちをEach文で分解
      messages.forEach(function (message) {

//htmlを作り出して、それを変数に代入(作り出す処理は非同期の時に作った)
        insertHTML = buildHTML(message); 

//変数に代入されたhtmlをmessagesクラスにぶち込む
        $('.messages').append(insertHTML);
      })
    })
```
⑹数秒ごとにリクエストするよう実装
```
setInterval(reloadMessages, 5000);
```
⑺メッセージ分だけスクロールするよう実装
```
$('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
```
⑻メッセージ一覧のページでのみJSが動くよう実装
```
if (window.location.href.match(/\/groups\/\d+\/messages/)){
```





## groups_usersテーブル

|Column|Type|Options|
|------|----|-------|
|user_id|references|null: false, foreign_key: true|
|group_id|references|null: false, foreign_key: true|

### Association
- belongs_to :group
- belongs_to :user


## userテーブル

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|address|string|null: false|
|password|string|null: false|

### Association
 has_many :groups_users
 has_many:groups,through: :groups_users
 has_many:tweets


## tweetテーブル

|Column|Type|Options|
|------|----|-------|
|message|text||
|image|string||
|user_id|references|null: false, foreign_key: true|
|group_id|references|null: false, foreign_key: true|

### Association
- belongs_to :group
- belongs_to :user


## groupテーブル

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|

### Association
- has_many :users, through: :groups_users
  has_many :tweets
- has_many :groups_users
