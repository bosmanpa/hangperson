# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'database_cleaner'
DatabaseCleaner.clean_with(:truncation)

Player.create(name: "Bogdan")
Player.create(name: "Momo")

Phrase.create(content: 'a bird in the hand')
Phrase.create(content: 'god only knows')
Phrase.create(content: 'frankly my dear')
Phrase.create(content: 'holy smokes')
Phrase.create(content: 'hand in the cookie jar')
Phrase.create(content: 'you cant handle the truf', player_id: 1)