class Player < ApplicationRecord
    has_many :phrases
    has_many :games, dependent: :destroy
end
