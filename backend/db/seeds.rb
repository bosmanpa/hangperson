# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'

require 'database_cleaner'
DatabaseCleaner.clean_with(:truncation)

Player.create(name: "Bogdan")
Player.create(name: "Momo")

20.times do 
    Phrase.create(
        content: Faker::Movies::HarryPotter.unique.character,
        category: 'Harry Potter Character'
    )
end

10.times do 
    Phrase.create(
        content: Faker::Movies::PrincessBride.unique.character,
        category: 'Princess Bride Character'
    )
end

10.times do 
    Phrase.create(
        content: Faker::Movies::LordOfTheRings.unique.character,
        category: 'Lord of The Rings Character'
    )
end

20.times do
    Phrase.create(
        content: Faker::Movies::StarWars.unique.character,
        category: 'Star Wars Character'
    )
end

25.times do
    Phrase.create(
        content: Faker::TvShows::Seinfeld.unique.character,
        category: 'Seinfeld Character'
    )
end


20.times do
    Phrase.create(
        content: Faker::TvShows::GameOfThrones.unique.character,
        category: 'Game Of Thrones Character'
    )
end

10.times do
    Phrase.create(
        content: Faker::TvShows::RickAndMorty.unique.character,
        category: 'Rick And Morty Character'
    )
end

10.times do
    Phrase.create(
        content: Faker::Games::Pokemon.unique.name,
        category: 'Pokemon'
    )
end

10.times do
    Phrase.create(
        content: Faker::Superhero.unique.name,
        category: 'Superhero'
    )
end

sunny_array = ['Charlie Kelly', 'Ronald Mac McDonald', 'Dennis Reynolds', 'Dee Reynolds', 'Frank Reynolds', 'Artemis Dubois', 'Da Maniac', 'Uncle Jack Kelly','Rickety Cricket', 'Liam McPoyle', 'Ryan McPoyle', 'Margaret McPoyle', 'Doyle McPoyle', 'Gail the Snail', 'Bill Ponderosa', 'Maureen Ponderosa', 'The Waitress', 'Ben the Soldier', 'Fatty Magoo', 'Bonnie Kelly', 'Luther McDonald', 'Pop Pop', 'Special Agent Jack Bauer', 'Country Mac']
sunny_array.each do |character|
    Phrase.create(
        content: character,
        category: 'Always Sunny Character'
    )
end