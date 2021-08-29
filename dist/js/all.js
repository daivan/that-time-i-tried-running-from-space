class Background{constructor(s){this.context=s,this.spawnTime=30,this.starList=[]}render(){if(this.starList.map(s=>s.render()),this.spawnTime-=1,0==this.spawnTime){let s=new Star(this.context);this.starList.push(s),this.spawnTime=30}}}
class FloatingText{constructor(t,i,s,o){this.ctx=t,this.position=i,this.text=s,this.textColor=o,this.time=30}render(){this.ctx.font="10px Arial",this.ctx.fillStyle=this.textColor,this.ctx.fillText(this.text,...this.position),this.position[1]--,this.time--}}
class Game{constructor(){this.score=0,this.mineral=0,this.currentLevel=0,this.currentDistance=0,this.maxDistance=60,this.currentOxygen=200,this.maxOxygen=200,this.currentHealth=100,this.maxHealth=100}addScore(e){this.score+=e}getObstacleReward(e){"oxygen"==e.lootType&&(this.currentOxygen+=e.lootAmount,this.currentOxygen>this.maxOxygen&&(this.currentOxygen=this.maxOxygen)),"mineral"==e.lootType&&(this.mineral+=e.lootAmount)}getMineral(){return this.mineral}getHealthArray(){return[this.currentHealth,this.maxHealth]}addDistance(e){this.currentDistance+=e}completeLevel(){return this.currentDistance>this.maxDistance}getOxygenArray(){return[this.currentOxygen,this.maxOxygen]}getDistanceArray(){return[this.currentDistance,this.maxDistance]}over(){return this.currentOxygen<=0||this.currentHealth<=0}removeOxygen(e){this.currentOxygen-=e}resetGame(){this.score=0,this.maxOxygen=200,this.currentOxygen=200,this.mineral=0,this.currentLevel=0,this.currentDistance=0,this.maxDistance=60,this.currentHealth=100,this.maxHealth=100}setLevel(){this.currentLevel+=1,this.currentDistance=0,this.maxDistance=60}makeMove(e){let t=e.pageX,r=e.pageY;"inGame"===gameState.state&&this.clickWithinArea(t,r)&&(gameState.movesLeft-=1,gameState.checkGameOver(),game.changeTile(t,r),game.changeNextTile())}changeNextTile(){this.nextTile=Math.floor(9*Math.random())+1}clickWithinArea(e,t){return e>72&&t>72&&e<456&&t<456}selectedTile(e,t){let r=(e-8)/64,a=(t-8)/64;return[Math.floor(a),Math.floor(r)]}changeTile(e,t){let r=this.selectedTile(e,t);gameState.map[r[0]][r[1]]=this.nextTile,gameState.checkLevelComplete()}update(){Background.renderGamePanels(),Background.render(),requests.map(e=>e.render()),goals.map(e=>e.render()),textInterface.renderInfoPanel()}checkShipAndSolarFlare(e,t){t.spawnLeft&&e.position_x<64&&(this.currentHealth-=5)}}
class GameState{constructor(){this.state="start_menu",this.dead=!0,this.stage=0,this.movesLeft=0,this.map=[],this.objects=[]}addObject(e){this.objects.push(e)}checkGameOver(){this.movesLeft<1&&(this.state="dead")}checkLevelComplete(){let e=!0;requests.forEach(t=>{!1===t.isConnected(gameState.map)&&(e=!1)}),e&&this.loadNextLevel()}loadNextLevel(){level.setNextLevel(),2===level.currentLevel?gameState.state="end":gameState.initiateLevel(level.getCurrentLevel())}initiateLevel(e){this.movesLeft=e.movesLeft,this.dead=!1,this.map=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],Background.setMap(this.map),this.spawnRequests(),this.spawnGoals()}spawnRequests(){requests=[],void 0!==level.getCurrentLevel().requests&&level.getCurrentLevel().requests.map(e=>{let t=new Request(cx);t.y=64*e.start[0],t.x=64*e.start[1],t.name=e.name,t.start=[e.start[0],e.start[1]],t.goal=[e.goal[0],e.goal[1]],requests.push(t)})}spawnGoals(){goals=[],void 0!==level.getCurrentLevel().goals&&level.getCurrentLevel().goals.map(e=>{let t=new Goal(cx);t.y=64*e.start[0],t.x=64*e.start[1],t.start=[e.start[0],e.start[1]],t.name=e.name,goals.push(t)})}printAllObjectLocations(){this.objects.map(function(e){console.log(e.getLocation())})}getObjectIn(e){let t=!1;return t=this.objects.map(t=>{if(t.getLocation()[0]==e[0]&&t.getLocation()[1]==e[1])return"bajs"})}isSpaceEmpty(e){let t=!0;return!((t=this.objects.filter(t=>t.getLocation()[0]==e[0]&&t.getLocation()[1]==e[1])).length>0)}}
class Music{constructor(t){this.ctx=t,this.notes={a:440,bs:440*Math.pow(2,1/12),b:440*Math.pow(2,2/12),c:440*Math.pow(2,.25),cs:440*Math.pow(2,4/12),d:440*Math.pow(2,5/12),ds:440*Math.pow(2,.5),e:440*Math.pow(2,7/12),f:440*Math.pow(2,8/12),fs:440*Math.pow(2,.75),g:440*Math.pow(2,10/12),gs:440*Math.pow(2,11/12)},this.isPlaying=!1,this.tempo=100,this.fourth=60/this.tempo,this.half=2*this.fourth,this.whole=2*this.half,this.eigth=this.fourth/2,this.sixteenth=this.eigth/2,this.melody={note:"",length:this.eigth,gain:.1,octave:1,wave:"sine"},this.lookahead=25,this.scheduleAheadTime=.1,this.currentNote=0,this.nextNoteTime=0,this.notesToPlay=[["d","","","d"],["","","",""],["d","","","d"],["e","","",""],["","","","d"],["a","","",""],["f","","","d"],["","","",""],["d","","","d"],["","","",""],["d","","","d"],["e","","",""],["","","","d"],["a","","",""],["f","","","d"],["","","",""],["d","","","c"],["","","",""],["d","","","c"],["e","","",""],["","","","c"],["a","","",""],["f","","","c"],["","","",""],["d","","","c"],["","","",""],["d","","","c"],["e","","",""],["","","","c"],["a","","",""],["f","","","c"],["","","",""],["d","","","bs"],["","","",""],["d","","","bs"],["","a","",""],["","","","bs"],["","a","",""],["f","","","bs"],["e","","",""],["d","","","bs"],["","","",""],["d","","","bs"],["","a","",""],["","","","bs"],["","a","",""],["f","","","bs"],["e","","",""],["d","","","a"],["","","",""],["d","","","a"],["g","","",""],["","","","a"],["g","","",""],["e","","","a"],["d","","",""],["d","","","c"],["","","",""],["d","","","c"],["g","","",""],["","","","c"],["g","","",""],["e","","","c"],["d","","",""]]}play(){this.isPlaying=!0,"suspended"===this.ctx.state&&this.ctx.resume(),this.scheduler()}playMove(){console.log("")}nextNote(){this.currentNote===this.notesToPlay.length-1?this.currentNote=0:this.currentNote++,this.nextNoteTime+=this.eigth}stopPlaying(){this.isPlaying=!1,this.currentNote=0,this.ctx.suspend(),this.nextNoteTime=this.eight}scheduler(){for(;this.nextNoteTime<this.ctx.currentTime+this.scheduleAheadTime&&this.isPlaying;){for(let t=0;t<4;t++)0==t&&(this.melody.note=this.notesToPlay[this.currentNote][t],this.melody.wave="sine",this.melody.octave=1,this.melody.length=this.notesToPlay[this.currentNote][t].length,this.playNote(this.melody,this.nextNoteTime)),1==t&&(this.melody.note=this.notesToPlay[this.currentNote][t],this.melody.wave="sine",this.melody.octave=2,this.melody.length=this.notesToPlay[this.currentNote][t].length,this.playNote(this.melody,this.nextNoteTime)),2==t&&(this.melody.note=this.notesToPlay[this.currentNote][t],this.melody.length=this.notesToPlay[this.currentNote][t].length,this.playNote(this.melody,this.nextNoteTime)),3==t&&(this.melody.note=this.notesToPlay[this.currentNote][t],this.melody.octave=-2,this.melody.wave="triangle",this.melody.length=this.notesToPlay[this.currentNote][t].length,this.playNote(this.melody,this.nextNoteTime));this.nextNote()}window.setTimeout(this.scheduler.bind(this),this.lookahead)}playNote(t,e){if(""!=t.note){let s=this.ctx.createOscillator(),i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.value=200,s.type=t.wave,s.frequency.setValueAtTime(1*this.notes[t.note]/Math.pow(2,1-t.octave),this.ctx.currentTime);let h=this.ctx.createGain();h.gain.setValueAtTime(.5,this.ctx.currentTime),h.gain.setTargetAtTime(0,this.ctx.currentTime,.2),i.connect(h),h.connect(this.ctx.destination),s.connect(i),s.start(e),s.stop(e+t.length)}}}
class Obstacle{constructor(t){let e=new Image;e.src="assets/images/spritesheet.png",this.current_animation_frame=1,this.context=t,this.image=e,this.max_animation_frame=2,this.current_frame_rate=20,this.max_frame_rate=10,this.x=128,this.y=128,this.start=[0,0],this.xFrame=64,this.yFrame=192,this.name="",this.currentHealth=20,this.maxHealth=20,this.dead=!1,this.showDamageAnimation=!1,this.lootType="nothing",this.lootAmount=0,this.randomNumber=100*Math.random(),this.randomNumber>85?(this.lootType="oxygen",this.lootAmount=10,this.lootColor="#AAAAFF"):this.randomNumber>55&&this.randomNumber<85&&(this.lootType="mineral",this.lootAmount=10,this.lootColor="#FFFF00")}render(){this.currentHealth<this.maxHealth/2?this.context.drawImage(this.image,64,192,64,64,this.x,this.y,64,64):this.context.drawImage(this.image,0,192,64,64,this.x,this.y,64,64),this.movable||(this.current_movable_speed-=1,this.current_movable_speed<0&&(this.movable=!0,this.current_movable_speed=this.max_movable_speed)),1==this.showDamageAnimation&&(this.context.fillStyle="#FFFF00",this.context.shadowColor="#FF0000",this.context.beginPath(),this.context.shadowBlur=5,this.context.fillStyle="#FFFF00",this.context.shadowColor="#FF0000",this.context.arc(this.x+32,this.y+32,20,50,100,!1),this.context.fill(),this.context.closePath(),this.context.shadowBlur=0,this.showDamageAnimation=!1)}getAnimationFrame(t){return 0==t?[0,64]:1==t?[64,64]:[0,64]}moveBack(){this.x-=64}getLocation(){return[this.x,this.y]}takeDamage(t){this.showDamageAnimation=!0,this.currentHealth-=t,this.currentHealth<=0&&this.destroy()}destroy(){this.dead=!0}}
class Ship{constructor(t){let i=new Image;i.src="assets/images/spritesheet.png",this.context=t,this.image=i,this.position_x=64,this.position_y=64,this.current_animation_frame=1,this.max_animation_frame=2,this.current_frame_rate=20,this.max_frame_rate=10,this.movable=!0,this.current_movable_speed=5,this.max_movable_speed=5,this.dead=!1,this.damage=2}resetGame(){this.position_x=64,this.position_y=64,this.dead=!1}isDead(){return this.dead}moveUp(){this.movable&&(this.position_y=this.position_y-64,this.movable=!1)}moveDown(){this.movable&&(this.position_y=this.position_y+64,this.movable=!1)}moveLeft(){this.movable&&(this.position_x=this.position_x-64,this.movable=!1)}moveRight(){this.movable&&(this.position_x=this.position_x+64,this.movable=!1)}render(){let t=this.getAnimationFrame(this.current_animation_frame);this.context.drawImage(this.image,t[0],t[1],64,64,this.position_x,this.position_y,64,64),this.current_frame_rate-=1,0==this.current_frame_rate&&(this.current_animation_frame+=1,this.current_animation_frame==this.max_animation_frame&&(this.current_animation_frame=0),this.current_frame_rate=this.max_frame_rate),this.movable||(this.current_movable_speed-=1,this.current_movable_speed<0&&(this.movable=!0,this.current_movable_speed=this.max_movable_speed))}getAnimationFrame(t){return 0==t?[0,0]:1==t?[64,0]:[0,0]}getPosition(){return[this.position_x,this.position_y]}moveBack(t){t.map(t=>{let i=t.getLocation();64==i[0]&&i[1]==this.position_y&&this.position_x<=0?this.dead=!0:i[1]==this.position_y&&this.position_x+64==i[0]&&(this.position_x=this.position_x-64)})}attack(t){this.movable&&(t.takeDamage(this.damage),this.movable=!1)}}
class SolarFlare{constructor(t){this.context=t,this.spawnTime=30,this.spawnLeft=!0,this.spawnLeftTicker=0}render(){if(this.spawnLeft){let t=this.getSpawnLeftTicker();this.context.fillStyle="rgba(225,100,100,0.8)",this.context.fillRect(0,0,t-64,512),this.context.fillStyle="rgba(225,100,100,0.8)",this.context.fillRect(0,0,t,512),this.context.fillStyle="rgba(225,225,0,0.3)",this.context.fillRect(0,0,t-128,512),this.context.fillStyle="rgba(225,225,0,0.6)",this.context.fillRect(0,0,t-192,512)}}addTicker(){this.spawnLeft&&(this.spawnLeftTicker+=1)}getSpawnLeftTicker(){return this.spawnLeftTicker>5&&this.spawnLeftTicker<=10?320:this.spawnLeftTicker>10&&this.spawnLeftTicker<=15?64*(5-(this.spawnLeftTicker-10)):this.spawnLeftTicker>15?(this.spawnLeft=!1,void(this.spawnLeftTicker=0)):64*this.spawnLeftTicker}}
class Star{constructor(t){this.uniqueNumber=Math.random(),this.context=t,this.x=800,this.y=500*Math.random(),this.radius=9*this.uniqueNumber+1,this.startAngle=0,this.endAngle=2*Math.PI,this.moveSpeed=this.uniqueNumber}render(){this.context.fill(),this.context.beginPath(),this.context.fillStyle="#ccc",this.context.shadowBlur=5,this.context.shadowColor="#ddd",this.context.arc(this.x,this.y,this.radius,this.startAngle,this.endAngle,!1),this.context.fill(),this.context.closePath(),this.context.shadowBlur=0,this.moveBack()}moveBack(){this.x-=this.moveSpeed}}
class Story{constructor(t){this.context=t}render(t){let e=this.getTitleByLevel(t),l=this.getStoryByLevel(t);this.context.font="30px Arial",this.context.fillStyle="#FFF",this.context.fillText(e,20,270),this.context.fillText(l,20,450)}getTitleByLevel(t){return 0==t?"Level 1":1==t?"Level 2":"You completed the game"}getStoryByLevel(t){return 0==t?"Just make it back alive!":1==t?"You are getting good at this":"You are the best of the best!"}}
class TextInterface{constructor(t){this.context=t}renderStart(){cx.font="30px Arial",cx.fillStyle="#FFF",cx.fillText("That time I tried running away from space",20,270),cx.font="20px Arial",cx.fillText("",20,320),cx.fillText("",20,340),cx.fillText("",20,365),cx.fillText("Avoid the asteroids!",20,390),cx.fillText("Press <Space> to play",20,450),cx.font="12px Arial",cx.fillText("Created by: Daivan Trinh & Hakan Einarsson for js13kGames.com 2021",20,500)}renderMap(){cx.font="30px Arial",cx.fillStyle="#FFF",cx.fillText("Select destination",20,270),cx.fillText("Press <Enter> to select the destination",20,450)}renderEnd(){cx.font="50px Arial",cx.fillStyle="#FFF",cx.fillText("The End",20,270),cx.font="20px Arial",cx.fillText("Thank you for playing our game!",20,340),cx.fillText("We love what you are doing at js13kGames.",20,365),cx.fillText("Keep up the great work!",20,390),cx.font="12px Arial",cx.fillText("Created by: Daivan Trinh & Hakan Einarsson for js13kGames.com 2021",20,500)}renderDead(t){cx.fillStyle="rgba(225,225,225,0.8)",cx.fillRect(0,0,768,512);let e=t;cx.font="30px Arial",cx.fillStyle="#FF0000",cx.fillText("You died!",40,105),cx.font="18px Arial",cx.fillStyle="#000",cx.fillText("You came to the level:",40,145),cx.fillText(e,40,180),cx.fillText("Press <space> to play again",40,230)}renderInfoPanel(t,e,l,x){let i="Health: "+t[0]+"/"+t[1],c="Oxygen: "+e[0]+"/"+e[1],n="Destination: "+l[0]+"/"+l[1],a="Minerals: "+x;this.context.font="12px Arial",this.context.fillStyle="#FFF",this.context.fillText(n,8,18),this.context.fillStyle="#AAFFAA",t[0]<=20&&(this.context.fillStyle="#FF0000"),this.context.fillText(i,8,40),this.context.fillStyle="#AAAAFF",e[0]<=15&&(this.context.fillStyle="#FF0000"),this.context.fillText(c,8,62),this.context.fillStyle="#FFFF00",this.context.fillText(a,8,84)}}
let vendors=["webkit","moz"];for(let e=0;e<vendors.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[vendors[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[vendors[e]+"CancelAnimationFrame"]||window[vendors[e]+"CancelRequestAnimationFrame"];const AudioContext=window.AudioContext||window.webkitAudioContext,audioCtx=new AudioContext;let music=new Music(audioCtx),canvas=document.getElementById("canvas"),cw=canvas.width,ch=canvas.height,fps=30,interval=1e3/fps,lastTime=(new Date).getTime(),currentTime=0,delta=0;cx=canvas.getContext("2d");let game=new Game,solarflare=new SolarFlare(cx),story=new Story(cx),gameState=new GameState,textInterface=new TextInterface(cx),background=new Background(cx),obstacleList=[],visualsList=[],ship=new Ship(cx),currentLevelTicker=50,levelTicker=50,state={pressedKeys:{enter:!1,space:!1,left:!1,right:!1,up:!1,down:!1}},keyMap={Enter:"enter",ArrowRight:"right",ArrowLeft:"left",ArrowUp:"up",ArrowDown:"down",Space:"space"};function keydown(e){let t=keyMap[e.code];state.pressedKeys[t]=!0}function keyup(e){let t=keyMap[e.code];state.pressedKeys[t]=!1}function onClick(e){game.makeMove(e)}function gameLoop(){if(window.requestAnimationFrame(gameLoop),visualsList.length>0&&visualsList.forEach(e=>{e.time>0?e.render():arrayRemove(visualsList,e)}),state.pressedKeys.space&&"start_menu"===gameState.state&&(music.play(),gameState.state="story"),state.pressedKeys.enter&&"story"===gameState.state&&(gameState.state="map"),state.pressedKeys.space&&"map"===gameState.state&&(game.setLevel(),ship.resetGame(),obstacleList=[],gameState.state="playing"),state.pressedKeys.space&&"dead"===gameState.state&&(game.resetGame(),ship.resetGame(),obstacleList=[],gameState.state="start_menu"),state.pressedKeys.up)if(shipLocation=ship.getPosition(),0==shipLocation[1])isUpEmpty=!1;else if(shipLocation[1]-=64,isUpEmpty=!0,currentObstacle=[],obstacleList.map(e=>{obstacleLocation=e.getLocation(),obstacleLocation[0]==shipLocation[0]&&obstacleLocation[1]==shipLocation[1]&&(isUpEmpty=!1,currentObstacle=e)}),isUpEmpty)ship.moveUp();else if(ship.attack(currentObstacle),!0===currentObstacle.dead){if(game.getObstacleReward(currentObstacle),"nothing"!=currentObstacle.lootType){let e=`+${currentObstacle.lootAmount} ${currentObstacle.lootType}`;visualsList.push(new FloatingText(cx,ship.getPosition(),e,currentObstacle.lootColor))}obstacleList=arrayRemove(obstacleList,currentObstacle)}if(state.pressedKeys.down)if(shipLocation=ship.getPosition(),448==shipLocation[1])isUpEmpty=!1;else if(shipLocation[1]+=64,isUpEmpty=!0,obstacleList.map(e=>{obstacleLocation=e.getLocation(),obstacleLocation[0]==shipLocation[0]&&obstacleLocation[1]==shipLocation[1]&&(isUpEmpty=!1,currentObstacle=e)}),isUpEmpty)ship.moveDown();else if(ship.attack(currentObstacle),!0===currentObstacle.dead){if(game.getObstacleReward(currentObstacle),"nothing"!=currentObstacle.lootType){let e=`+${currentObstacle.lootAmount} ${currentObstacle.lootType}`;visualsList.push(new FloatingText(cx,ship.getPosition(),e,currentObstacle.lootColor))}obstacleList=arrayRemove(obstacleList,currentObstacle)}if(state.pressedKeys.left)if(shipLocation=ship.getPosition(),0==shipLocation[0])isUpEmpty=!1;else if(shipLocation[0]-=64,isUpEmpty=!0,obstacleList.map(e=>{obstacleLocation=e.getLocation(),obstacleLocation[0]==shipLocation[0]&&obstacleLocation[1]==shipLocation[1]&&(isUpEmpty=!1,currentObstacle=e)}),isUpEmpty)ship.moveLeft();else if(ship.attack(currentObstacle),!0===currentObstacle.dead){if(game.getObstacleReward(currentObstacle),"nothing"!=currentObstacle.lootType){let e=`+${currentObstacle.lootAmount} ${currentObstacle.lootType}`;visualsList.push(new FloatingText(cx,ship.getPosition(),e,currentObstacle.lootColor))}obstacleList=arrayRemove(obstacleList,currentObstacle)}if(state.pressedKeys.right)if(shipLocation=ship.getPosition(),704==shipLocation[0])isUpEmpty=!1;else if(shipLocation[0]+=64,isUpEmpty=!0,obstacleList.map(e=>{obstacleLocation=e.getLocation(),obstacleLocation[0]==shipLocation[0]&&obstacleLocation[1]==shipLocation[1]&&(isUpEmpty=!1,currentObstacle=e)}),isUpEmpty)ship.moveRight();else if(ship.attack(currentObstacle),!0===currentObstacle.dead){if(game.getObstacleReward(currentObstacle),"nothing"!=currentObstacle.lootType){let e=`+${currentObstacle.lootAmount} ${currentObstacle.lootType}`;visualsList.push(new FloatingText(cx,ship.getPosition(),e,currentObstacle.lootColor))}obstacleList=arrayRemove(obstacleList,currentObstacle)}if(currentTime=(new Date).getTime(),(delta=currentTime-lastTime)>interval)if(cx.clearRect(0,0,cw,ch),background.render(),"start_menu"===gameState.state)textInterface.renderStart();else if("story"===gameState.state)story.render(game.currentLevel);else if("map"===gameState.state)textInterface.renderMap();else if("end"===gameState.state)textInterface.renderEnd();else if("dead"===gameState.state)score=0,oxygenArray=game.getOxygenArray(),textInterface.renderDead(game.currentLevel);else if("playing"===gameState.state){if(solarflare.render(),healthArray=game.getHealthArray(),oxygenArray=game.getOxygenArray(),distanceArray=game.getDistanceArray(),minerals=game.getMineral(),textInterface.renderInfoPanel(healthArray,oxygenArray,distanceArray,minerals),ship.render(),obstacleList.map(e=>e.render()),(currentLevelTicker-=1)<0){game.checkShipAndSolarFlare(ship,solarflare),solarflare.addTicker(),ship.moveBack(obstacleList),obstacleList.map(e=>e.moveBack()),currentLevelTicker=levelTicker,game.addScore(10),game.removeOxygen(1),1==game.over()&&(gameState.state="dead"),ship.isDead()&&(gameState.state="dead"),game.addDistance(1),game.completeLevel()&&(gameState.state="story");let e=new Obstacle(cx);e.x=704,e.y=64*Math.floor(8*Math.random()),obstacleList.push(e)}lastTime=currentTime-delta%interval}}function loadImage(e){return new Promise(t=>{let a=new Image;a.onload=(()=>t(a)),a.src=e})}function arrayRemove(e,t){return e.filter(function(e){return e!=t})}window.addEventListener("keydown",keydown,!1),window.addEventListener("keyup",keyup,!1),window.addEventListener("click",onClick,!1),Promise.all([loadImage("assets/images/spritesheet.png")]).then(()=>{gameLoop()});