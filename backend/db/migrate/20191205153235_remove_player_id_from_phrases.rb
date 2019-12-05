class RemovePlayerIdFromPhrases < ActiveRecord::Migration[6.0]
  def change

    remove_column :phrases, :player_id, :integer
  end
end
