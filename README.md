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

上記の様に投稿内容がリロードする事なく表示されます。<br>
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
```<br>
⑽ 非同期に失敗した場合の処理も準備する<br>
```
//doneの処理の後に記述(失敗した時という意味)
.fail(function(){
      alert('error');
    });
```

### インクリメンタルサーチ機能
![c8ae20cedd355c3d32d7c2ddb02ec76e](https://user-images.githubusercontent.com/57340298/72162756-e1714880-3405-11ea-98d4-31b8ef8d37f9.gif)<br>

### 自動更新機能
![75605dcb2a3056730005f12b929988db](https://user-images.githubusercontent.com/57340298/72163060-707e6080-3406-11ea-809d-ac2c33ee4997.gif)<br>





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
