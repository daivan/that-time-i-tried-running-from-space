class Game {

    constructor() {
        this.score = 0;
        this.mineral = 0;
        this.currentLevel = 0;
        this.currentDistance = 0;
        this.maxDistance = 60;
        this.currentOxygen = 200;
        this.maxOxygen = 200;
        //this.nextTile = 1;
    }

    addScore(addScore) {
        this.score += addScore;
    }

    getObstacleReward(obstacle) {
        if (obstacle.lootType == 'oxygen') {
            this.currentOxygen += obstacle.lootAmount;
            if (this.currentOxygen > this.maxOxygen) {
                this.currentOxygen = this.maxOxygen;
            }
        }
        if (obstacle.lootType == 'mineral') {
            this.mineral += obstacle.lootAmount;
        }        
    }
    getMineral() {
        return this.mineral;
    }
    getScore() {
        return this.score;
    }

    addDistance(distance) {
        this.currentDistance += distance;
    }

    completeLevel() {
        if (this.currentDistance > this.maxDistance) {
            return true;
        }
        return false;
    }

    getOxygenArray() {
        return [this.currentOxygen, this.maxOxygen];
    }
    getDistanceArray() {
        return [this.currentDistance, this.maxDistance];
    }
    over() {
        if (this.currentOxygen <= 0) {
            return true;
        }
        return false;
    }

    removeOxygen(oxygenToRemove) {
        this.currentOxygen -= oxygenToRemove;
    }
    resetGame() {
        this.score = 0;
        this.maxOxygen = 200;
        this.currentOxygen = 200;
    }

    setLevel() {
        this.currentLevel+=1;
        this.currentDistance = 0;
        this.maxDistance = 60;
    }
    makeMove(event) {
        let mouseX = event.pageX;
        let mouseY = event.pageY;

        if (gameState.state === 'inGame' && this.clickWithinArea(mouseX, mouseY)) {
            gameState.movesLeft -= 1;
            gameState.checkGameOver();
            game.changeTile(mouseX, mouseY);
            game.changeNextTile();
        }
    }
    changeNextTile() {
        this.nextTile = Math.floor(Math.random() * 9) + 1;
        /*
          if(this.nextTile===9){
              this.nextTile = 1;
          }else{
              this.nextTile+=1;
          }
  
         */
    }

    clickWithinArea(mouseX, mouseY) {
        if (mouseX > 72 && mouseY > 72 && mouseX < 456 && mouseY < 456) {
            return true;
        }
        return false;
    }

    selectedTile(mouseX, mouseY) {
        // - 8 is because of the canvas margin
        let x = (mouseX - 8) / 64;
        let y = (mouseY - 8) / 64;
        return [Math.floor(y), Math.floor(x)];
    }

    changeTile(mouseX, mouseY) {
        let selectedTiles = this.selectedTile(mouseX, mouseY);

        gameState.map[selectedTiles[0]][selectedTiles[1]] = this.nextTile;

        gameState.checkLevelComplete();
    }

    update() {

        Background.renderGamePanels();

        Background.render();


        requests.map(request => request.render());

        goals.map(goal => goal.render());

        textInterface.renderInfoPanel();

    }
}