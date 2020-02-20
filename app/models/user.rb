class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  has_many :groups, through: :group_users
  has_many :group_users
  validates :name, presence: true
end
