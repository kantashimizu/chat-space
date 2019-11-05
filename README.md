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
|user_name|string|null: false|
|address|string|null: false|
|password|string|null: false|

### Association
- has_many :groups_users
- has_many:group
  has_many:tweet


## tweetテーブル

|Column|Type|Options|
|------|----|-------|
|message|text|null: false|
|image|string||

### Association
- belongs_to :group
- belongs_to :user


## groupテーブル

|Column|Type|Options|
|------|----|-------|
|group_name|string|null: false|

### Association
- has_many :user
  has_many :tweet
- has_many :groups_users