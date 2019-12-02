class PhrasesController < ApplicationController
    
    def index
        phrases = Phrase.all
        render json: phrases
    end

    def show
        phrase = Phrase.find(params[:id])
        render json: phrase
    end
end
