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

Phrase.create(content: 'mom')
Phrase.create(content: 'dad')
Phrase.create(content: 'food')
Phrase.create(content: 'junk', player_id: 2)
Phrase.create(content: 'hat')
Phrase.create(content: 'toot', player_id: 1)

Game.create(player_id: 2, phrase_id: 2, win: true)
Game.create(player_id: 1, phrase_id: 3, win: true)
Game.create(player_id: 2, phrase_id: 5, win: false)
Game.create(player_id: 1, phrase_id: 1, win: false)