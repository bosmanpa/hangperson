class Phrase < ApplicationRecord
    belongs_to :player, optional: true
    has_many :games
end
