class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  has_many :groups, through: :group_users
  has_many :group_users
  has_many :messages
  validates :name, presence: true
  # 以前コントローラ上で行っていた検索をモデル内に取り込み、クラスメソッドとしています。
    
  def self.search(input, id)
    return nil if input == ""
    User.where(['name LIKE ?', "%#{input}%"] ).where.not(id: id).limit(10)
  end
end
