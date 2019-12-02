class Game < ApplicationRecord
    belongs_to :phrase
    belongs_to :player
end
