# DB設計
## usersテーブル
|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
|email|string|null: false|
|password|string|null: false|
### Association
- has_many  :groups,  through:  :users_groups
- has_many  :users_groups
- has_many  :posts

## groupsテーブル
|Column|Type|Options|
|------|----|-------|
|name|string|null: false|
- has_many  :users,  through:  :users_groups
- has_many  :users_groups
- has_many  :posts

## groups_usersテーブル
|Column|Type|Options|
|------|----|-------|
|user_id|integer|null: false, foreign_key: true|
|group_id|integer|null: false, foreign_key: true|
- belongs_to :user
- belongs_to :group


## postsテーブル
|Column|Type|Options|
|------|----|-------|
|text|text|null: false|
|image|string||
|user_id|integer|null: false, foreign_key: true|
|group_id|integer|null: false, foreign_key: true|
- belongs_to :user
- belongs_to :group
