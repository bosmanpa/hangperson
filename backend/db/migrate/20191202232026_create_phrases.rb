class CreatePhrases < ActiveRecord::Migration[6.0]
  def change
    create_table :phrases do |t|
      t.string :content
      t.integer :player_id, default: nil

      t.timestamps
    end
  end
end
