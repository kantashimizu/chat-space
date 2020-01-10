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
