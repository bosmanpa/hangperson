class AddCategoryToPhrases < ActiveRecord::Migration[6.0]
  def change
    add_column :phrases, :category, :string
  end
end
