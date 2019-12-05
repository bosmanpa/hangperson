class PlayersController < ApplicationController

    def index
        players = Player.all
        render json: players
    end

    def show
        player = Player.find(params[:id])
        render json: player
    end

    def create
        player = Player.create(player_params)
        render json: player
    end

    def destroy
        player = Player.find(params[:id])
        player.delete()
        render json: { message: 'deleted player' }
    end

    def delete_games
        player = Player.find(params[:id])
        player.games.destroy_all
        render json: {message: 'you deleted the games'}
    end

    private
    def player_params
        params.require(:player).permit(:name)
    end

end
