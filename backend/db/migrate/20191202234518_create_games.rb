class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.integer :player_id
      t.integer :phrase_id
      t.boolean :win

      t.timestamps
    end
  end
end
