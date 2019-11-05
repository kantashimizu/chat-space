# README

## groups_usersテーブル

|Column|Type|Options|
|------|----|-------|
|user_id|integer|null: false, foreign_key: true|
|group_id|integer|null: false, foreign_key: true|

### Association
- belongs_to :group
- belongs_to :user


## userテーブル

|Column|Type|Options|
|------|----|-------|
|user_id|integer|null: false|
|name|string|null: false|
|address|string|null: false|
|password|string|null: false|

### Association
- has_many :groups,through::groups_users
- has_many:groups
  has_many:tweets


## tweetテーブル

|Column|Type|Options|
|------|----|-------|
|message|text|
|image|string||

### Association
- belongs_to :group
- belongs_to :user


## groupテーブル

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|group_id|integer|null: false|

### Association
- has_many :users,through: :groups_users
  has_many :tweets
- has_many :groups_users