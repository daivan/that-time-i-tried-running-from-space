class Game{constructor(){this.score=0}addScore(e){this.score+=e}getScore(){return this.score}makeMove(e){let t=e.pageX,a=e.pageY;"inGame"===gameState.state&&this.clickWithinArea(t,a)&&(gameState.movesLeft-=1,gameState.checkGameOver(),game.changeTile(t,a),game.changeNextTile())}changeNextTile(){this.nextTile=Math.floor(9*Math.random())+1}clickWithinArea(e,t){return e>72&&t>72&&e<456&&t<456}selectedTile(e,t){let a=(e-8)/64,r=(t-8)/64;return[Math.floor(r),Math.floor(a)]}changeTile(e,t){let a=this.selectedTile(e,t);gameState.map[a[0]][a[1]]=this.nextTile,gameState.checkLevelComplete()}update(){Background.renderGamePanels(),Background.render(),requests.map(e=>e.render()),goals.map(e=>e.render()),textInterface.renderInfoPanel()}}
class GameState{constructor(){this.state="start_menu",this.dead=!0,this.stage=0,this.movesLeft=0,this.map=[],this.objects=[]}addObject(e){this.objects.push(e)}checkGameOver(){this.movesLeft<1&&(this.state="dead")}checkLevelComplete(){let e=!0;requests.forEach(t=>{!1===t.isConnected(gameState.map)&&(e=!1)}),e&&this.loadNextLevel()}loadNextLevel(){level.setNextLevel(),2===level.currentLevel?gameState.state="end":gameState.initiateLevel(level.getCurrentLevel())}initiateLevel(e){this.movesLeft=e.movesLeft,this.dead=!1,this.map=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],Background.setMap(this.map),this.spawnRequests(),this.spawnGoals()}spawnRequests(){requests=[],void 0!==level.getCurrentLevel().requests&&level.getCurrentLevel().requests.map(e=>{let t=new Request(cx);t.y=64*e.start[0],t.x=64*e.start[1],t.name=e.name,t.start=[e.start[0],e.start[1]],t.goal=[e.goal[0],e.goal[1]],requests.push(t)})}spawnGoals(){goals=[],void 0!==level.getCurrentLevel().goals&&level.getCurrentLevel().goals.map(e=>{let t=new Goal(cx);t.y=64*e.start[0],t.x=64*e.start[1],t.start=[e.start[0],e.start[1]],t.name=e.name,goals.push(t)})}printAllObjectLocations(){this.objects.map(function(e){console.log(e.getLocation())})}getObjectIn(e){let t=!1;return t=this.objects.map(t=>{if(t.getLocation()[0]==e[0]&&t.getLocation()[1]==e[1])return"bajs"})}isSpaceEmpty(e){let t=!0;return!((t=this.objects.filter(t=>t.getLocation()[0]==e[0]&&t.getLocation()[1]==e[1])).length>0)}}
class Goal{constructor(t){let s=new Image;s.src="assets/images/collection.png",this.context=t,this.image=s,this.x=64,this.y=64,this.start=[0,0],this.xFrame=64,this.yFrame=192,this.name=""}render(){this.context.drawImage(this.image,0,448,64,64,this.x,this.y,64,64),cx.font="12px Arial",cx.fillStyle="#FF0000",cx.fillText("Goal",this.x+5,this.y+61)}moveBack(){this.x-=64}}
class Levels{constructor(e){this.currentLevel=e,this.levels=[{name:"level1",movesLeft:50,requests:[{start:[0,4],goal:[7,3],name:"index.html"},{start:[3,0],goal:[5,7],name:"meme.png"}],goals:[{start:[7,3],name:"index.html"},{start:[5,7],name:"meme.png"}]},{name:"level2",movesLeft:200,requests:[{start:[0,4],goal:[7,1],name:"index.php"},{start:[0,2],goal:[7,4],name:"style.css"},{start:[4,0],goal:[3,7],name:"hack.js"},{start:[3,0],goal:[4,7],name:"dont.zip"}],goals:[{start:[7,1],name:"index.php"},{start:[7,4],name:"style.css"},{start:[3,7],name:"hack.js"},{start:[4,7],name:"dont.zip"}]}]}getCurrentLevel(){return this.levels[this.currentLevel]}setNextLevel(){this.currentLevel++}}
class Music{constructor(t){this.ctx=t,this.notes={a:440,bs:440*Math.pow(2,1/12),b:440*Math.pow(2,2/12),c:440*Math.pow(2,.25),cs:440*Math.pow(2,4/12),d:440*Math.pow(2,5/12),ds:440*Math.pow(2,.5),e:440*Math.pow(2,7/12),f:440*Math.pow(2,8/12),fs:440*Math.pow(2,.75),g:440*Math.pow(2,10/12),gs:440*Math.pow(2,11/12)},this.isPlaying=!1,this.tempo=100,this.fourth=60/this.tempo,this.half=2*this.fourth,this.whole=2*this.half,this.eigth=this.fourth/2,this.sixteenth=this.eigth/2,this.melody={note:"",length:this.eigth,gain:.1,octave:1,wave:"sine"},this.lookahead=25,this.scheduleAheadTime=.1,this.currentNote=0,this.nextNoteTime=0,this.notesToPlay=[["d","","","d"],["","","",""],["d","","","d"],["e","","",""],["","","","d"],["a","","",""],["f","","","d"],["","","",""],["d","","","d"],["","","",""],["d","","","d"],["e","","",""],["","","","d"],["a","","",""],["f","","","d"],["","","",""],["d","","","c"],["","","",""],["d","","","c"],["e","","",""],["","","","c"],["a","","",""],["f","","","c"],["","","",""],["d","","","c"],["","","",""],["d","","","c"],["e","","",""],["","","","c"],["a","","",""],["f","","","c"],["","","",""],["d","","","bs"],["","","",""],["d","","","bs"],["","a","",""],["","","","bs"],["","a","",""],["f","","","bs"],["e","","",""],["d","","","bs"],["","","",""],["d","","","bs"],["","a","",""],["","","","bs"],["","a","",""],["f","","","bs"],["e","","",""],["d","","","a"],["","","",""],["d","","","a"],["g","","",""],["","","","a"],["g","","",""],["e","","","a"],["d","","",""],["d","","","c"],["","","",""],["d","","","c"],["g","","",""],["","","","c"],["g","","",""],["e","","","c"],["d","","",""]]}play(){this.isPlaying=!0,"suspended"===this.ctx.state&&this.ctx.resume(),this.scheduler()}playMove(){console.log("")}nextNote(){this.currentNote===this.notesToPlay.length-1?this.currentNote=0:this.currentNote++,this.nextNoteTime+=this.eigth}stopPlaying(){this.isPlaying=!1,this.currentNote=0,this.ctx.suspend(),this.nextNoteTime=this.eight}scheduler(){for(;this.nextNoteTime<this.ctx.currentTime+this.scheduleAheadTime&&this.isPlaying;){for(let t=0;t<4;t++)0==t&&(this.melody.note=this.notesToPlay[this.currentNote][t],this.melody.wave="sine",this.melody.octave=1,this.melody.length=this.notesToPlay[this.currentNote][t].length,this.playNote(this.melody,this.nextNoteTime)),1==t&&(this.melody.note=this.notesToPlay[this.currentNote][t],this.melody.wave="sine",this.melody.octave=2,this.melody.length=this.notesToPlay[this.currentNote][t].length,this.playNote(this.melody,this.nextNoteTime)),2==t&&(this.melody.note=this.notesToPlay[this.currentNote][t],this.melody.length=this.notesToPlay[this.currentNote][t].length,this.playNote(this.melody,this.nextNoteTime)),3==t&&(this.melody.note=this.notesToPlay[this.currentNote][t],this.melody.octave=-2,this.melody.wave="triangle",this.melody.length=this.notesToPlay[this.currentNote][t].length,this.playNote(this.melody,this.nextNoteTime));this.nextNote()}window.setTimeout(this.scheduler.bind(this),this.lookahead)}playNote(t,e){if(""!=t.note){let s=this.ctx.createOscillator(),i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.value=200,s.type=t.wave,s.frequency.setValueAtTime(1*this.notes[t.note]/Math.pow(2,1-t.octave),this.ctx.currentTime);let h=this.ctx.createGain();h.gain.setValueAtTime(.5,this.ctx.currentTime),h.gain.setTargetAtTime(0,this.ctx.currentTime,.2),i.connect(h),h.connect(this.ctx.destination),s.connect(i),s.start(e),s.stop(e+t.length)}}}
class Obstacle{constructor(t){let s=new Image;s.src="assets/images/collection.png",this.context=t,this.image=s,this.x=128,this.y=128,this.start=[0,0],this.xFrame=64,this.yFrame=192,this.name=""}render(){this.context.drawImage(this.image,0,384,64,64,this.x,this.y,64,64),cx.font="12px Arial",cx.fillStyle="#FF0000",cx.fillText("Rock",this.x+5,this.y+61)}moveBack(){this.x-=64}getLocation(){return[this.x,this.y]}}
class Request{constructor(e){let t=new Image;t.src="assets/images/collection.png",this.context=e,this.image=t,this.x=0,this.y=0,this.start=[0,0],this.goal=[0,0],this.xFrame=0,this.yFrame=192,this.name="",this.animate=0,this.animateCounter=0,this.idleAnimation=[[0,192],[0,256],[0,320],[0,384]],this.connected=!1}isConnected(e){let t=this.start,i=this.goal,s=this.navigate(e,t,[t]);return-1===searchForArray(s,i)?(this.connected=!1,!1):(this.connected=!0,!0)}navigate(e,t,i=[]){return this.possibleMovements(e,t,i).forEach(t=>{i.push(t),this.navigate(e,t,i)}),i}getPreviousDirection(e,t){if(void 0===t)return!1;let i=e[0]-t[0],s=e[1]-t[1];return 1===s?"right":-1===s?"left":1===i?"down":-1===i&&"up"}possibleMovements(e,t,i){let s=this.getPreviousDirection(t,i[i.length-2]),n=t[0],r=t[1],a=e[n][r],h=this.isEastPossible(e,n,r,a,s),l=this.isNorthPossible(e,n,r,a,s),o=this.isWestPossible(e,n,r,a,s),u=this.isSouthPossible(e,n,r,a,s),c=[];!1!==l&&c.push(l),!1!==h&&c.push(h),!1!==u&&c.push(u),!1!==o&&c.push(o);let f=[];return c.forEach(e=>{-1===searchForArray(i,e)&&f.push(e)}),f}edgeCasePossible(e,t){if(void 0===t)return!1;return!![3,6,9].includes(e)}isNorthPossible(e,t,i,s,n){if(0===t)return!1;if(this.edgeCasePossible(s,n))if(3===s){if("up"!==n)return!1}else if(6===s){if("right"!==n)return!1}else if(9===s&&"left"!==n)return!1;return!1!==[0,2,3,6,7,8,9].includes(s)&&(!1!==[2,3,4,5,6,9].includes(e[t-1][i])&&(0!==e[t-1][i]&&[t-1,i]))}isEastPossible(e,t,i,s,n){if(7===i)return!1;if(this.edgeCasePossible(s,n))if(3===s){if("right"!==n)return!1}else if(6===s){if("up"!==n)return!1}else if(9===s&&"down"!==n)return!1;if(this.goal[0]===t&&this.goal[1]===i+1)return[t,i+1];return!1!==[0,1,3,4,6,7,9].includes(s)&&(!1!==[1,3,5,6,8,9].includes(e[t][i+1])&&(0!==e[t][i+1]&&[t,i+1]))}isSouthPossible(e,t,i,s,n){if(7===t)return!1;if(this.edgeCasePossible(s,n))if(3===s){if("down"!==n)return!1}else if(6===s){if("left"!==n)return!1}else if(9===s&&"right"!==n)return!1;if(this.goal[0]===t+1&&this.goal[1]===i)return[t+1,i];return!1!==[0,2,3,4,5,6,9].includes(s)&&(!1!==[2,3,6,7,8,9].includes(e[t+1][i])&&(0!==e[t+1][i]&&[t+1,i]))}isWestPossible(e,t,i,s,n){if(0===i)return!1;if(this.edgeCasePossible(s,n))if(3===s){if("left"!==n)return!1}else if(6===s){if("down"!==n)return!1}else if(9===s&&"up"!==n)return!1;return!1!==[0,1,3,5,6,8,9].includes(s)&&(!1!==[1,3,4,6,7,9].includes(e[t][i-1])&&(0!==e[t][i-1]&&[t,i-1]))}animateIdle(){3===this.animate&&(this.animate=0);let e=this.idleAnimation[this.animate][0],t=this.idleAnimation[this.animate][1];this.context.drawImage(this.image,e,t,64,64,this.x,this.y,64,64),24===this.animateCounter?(this.animate+=1,this.animateCounter=0):this.animateCounter+=1}animateConnected(){this.context.drawImage(this.image,0,448,64,64,this.x,this.y,64,64)}render(){let e=[];e=0===this.start[0]?Background.calculate(22):Background.calculate(21),this.context.drawImage(this.image,e[0],e[1],64,64,this.x,this.y,64,64),this.connected?this.animateConnected():this.animateIdle(),cx.font="12px Arial",cx.fillStyle="#000",cx.fillText(this.name,this.x+5,this.y+62)}}
class Ship{constructor(t){let i=new Image;i.src="assets/images/collection.png",this.context=t,this.image=i,this.position_x=0,this.position_y=0,this.current_animation_frame=2,this.max_animation_frame=4,this.current_frame_rate=20,this.max_frame_rate=10,this.movable=!0,this.current_movable_speed=5,this.max_movable_speed=5,this.dead=!1}isDead(){return this.dead}moveUp(){this.movable&&(this.position_y=this.position_y-64,this.movable=!1)}moveDown(){this.movable&&(this.position_y=this.position_y+64,this.movable=!1)}moveLeft(){this.movable&&(this.position_x=this.position_x-64,this.movable=!1)}moveRight(){this.movable&&(this.position_x=this.position_x+64,this.movable=!1)}render(){let t=this.getAnimationFrame(this.current_animation_frame);this.context.drawImage(this.image,t[0],t[1],64,64,this.position_x,this.position_y,64,64),this.current_frame_rate-=1,0==this.current_frame_rate&&(this.current_animation_frame+=1,this.current_animation_frame==this.max_animation_frame&&(this.current_animation_frame=0),this.current_frame_rate=this.max_frame_rate),this.movable||(this.current_movable_speed-=1,this.current_movable_speed<0&&(this.movable=!0,this.current_movable_speed=this.max_movable_speed))}getAnimationFrame(t){return 0==t?[0,0]:1==t?[64,0]:2==t?[128,0]:3==t?[196,0]:void 0}getPosition(){return[this.position_x,this.position_y]}moveBack(){this.position_x<=0&&(this.dead=!0),this.position_x=this.position_x-64}vibrate(){}}
class Spawner{constructor(t){let s=new Image;s.src="assets/images/collection.png",this.context=t,this.image=s,this.x=128,this.y=128,this.start=[0,0],this.xFrame=64,this.yFrame=192,this.name=""}render(){this.context.drawImage(this.image,0,384,64,64,this.x,this.y,64,64),cx.font="12px Arial",cx.fillStyle="#FF0000",cx.fillText("Rock",this.x+5,this.y+61)}moveBack(){this.x-=64}getLocation(){return[this.x,this.y]}spawnObstacle(){}}
class TextInterface{constructor(){let e=new Image;e.src="assets/images/collection.png",this.image=e;let l=new Image;l.src="assets/images/intro_background.png",this.intro_background=l}renderStart(){cx.font="30px Arial",cx.fillStyle="#000",cx.fillText("That time I tried running from space",20,270),cx.font="20px Arial",cx.fillText("Best experience in full screen mode <Enter>",20,320),cx.fillText("The universe has imploded and you need to get as far",20,340),cx.fillText("away as possible!",20,365),cx.fillText("Avoid anything and everything to maintain your speed!",20,390),cx.fillText("Press <Space> to play",20,450),cx.font="12px Arial",cx.fillText("Created by: Daivan Trinh & Hakan Einarsson for js13kGames.com 2021",20,500)}renderEnd(){cx.font="50px Arial",cx.fillStyle="#000",cx.fillText("The End",20,270),cx.font="20px Arial",cx.fillText("Thank you for playing our game!",20,340),cx.fillText("We love what you are doing at js13kGames.",20,365),cx.fillText("Keep up the great work!",20,390),cx.font="12px Arial",cx.fillText("Created by: Daivan Trinh & Hakan Einarsson for js13kGames.com 2021",20,500)}renderDead(){cx.fillStyle="rgba(225,225,225,0.8)",cx.fillRect(0,0,768,512);cx.font="30px Arial",cx.fillStyle="rgba(82,84,82,1)",cx.fillRect(0,0,768,50),cx.fillStyle="rgba(255,255,255,1)",cx.fillRect(20,60,728,200),cx.font="30px Arial",cx.fillStyle="#FFF",cx.fillText("Game over",10,40),cx.fillStyle="#FF0000",cx.fillText("You died!",40,105),cx.font="18px Arial",cx.fillStyle="#000",cx.fillText("The resource you are looking for might have been removed...",40,145),cx.fillText("Or maybe the server is just bad at finding your file.",40,180),cx.fillText("Press <space> to play again",40,230)}renderInfoPanel(e){let l="Score: "+e;cx.font="12px Arial",cx.fillStyle="#000",cx.fillText(l,530,18)}}
class TileSheet{constructor(e){let a=new Image;a.src="assets/images/collection.png",this.context=e,this.image=a,this.map=[];let t=new Image;t.src="assets/images/game_background.png",this.game_background=t}setMap(e){this.map=e}render(){let e=0;this.map.length>0&&this.map.map(a=>{let t=0;a.map(a=>{let s=this.calculate(a);0!==a&&this.context.drawImage(this.image,s[0],s[1],64,64,64*t,64*e,64,64),t++}),e++})}calculate(e){return 1===e?[0,0]:2===e?[64,0]:3===e?[128,0]:4===e?[0,64]:5===e?[64,64]:6===e?[128,64]:7===e?[0,128]:8===e?[64,128]:9===e?[128,128]:10===e?[0,192]:11===e?[64,192]:20===e?[192,128]:21===e?[192,0]:22===e?[192,64]:23===e?[192,192]:[0,0]}renderGamePanels(){cx.drawImage(this.game_background,0,0,768,512,0,0,768,512)}}
let vendors=["webkit","moz"];const AudioContext=window.AudioContext||window.webkitAudioContext,audioCtx=new AudioContext;for(let e=0;e<vendors.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[vendors[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[vendors[e]+"CancelAnimationFrame"]||window[vendors[e]+"CancelRequestAnimationFrame"];let canvas=document.getElementById("canvas"),cw=canvas.width,ch=canvas.height,fps=30,interval=1e3/fps,lastTime=(new Date).getTime(),currentTime=0,delta=0;cx=canvas.getContext("2d");let game=new Game,gameState=new GameState,textInterface=new TextInterface,music=new Music(audioCtx),obstacleList=[],obstacle=new Obstacle(cx);obstacle.x=192;let obstacle2=new Obstacle(cx);obstacleList.push(obstacle),obstacleList.push(obstacle2),gameState.addObject(obstacle),gameState.addObject(obstacle2);let spawner=new Spawner(cx),ship=new Ship(cx),goal=new Goal(cx),currentLevelTicker=100,levelTicker=100,state={pressedKeys:{space:!1,left:!1,right:!1,up:!1,down:!1}},keyMap={Enter:"we tryin",ArrowRight:"right",ArrowLeft:"left",ArrowUp:"up",ArrowDown:"down",Space:"space"};function keydown(e){let t=keyMap[e.code];state.pressedKeys[t]=!0}function keyup(e){let t=keyMap[e.code];state.pressedKeys[t]=!1}function onClick(e){game.makeMove(e)}function gameLoop(){if(window.requestAnimationFrame(gameLoop),state.pressedKeys.space&&"start_menu"===gameState.state&&(music.play(),gameState.state="playing"),state.pressedKeys.space&&"dead"===gameState.state&&(gameState.state="playing"),state.pressedKeys.up&&(shipLocation=ship.getPosition(),0==shipLocation[1]?isUpEmpty=!1:(shipLocation[1]-=64,isUpEmpty=!0,obstacleList.map(e=>{obstacleLocation=e.getLocation(),obstacleLocation[0]==shipLocation[0]&&obstacleLocation[1]==shipLocation[1]&&(isUpEmpty=!1)}),isUpEmpty?ship.moveUp():ship.vibrate())),state.pressedKeys.down&&(shipLocation=ship.getPosition(),448==shipLocation[1]?isUpEmpty=!1:(shipLocation[1]+=64,isUpEmpty=!0,obstacleList.map(e=>{obstacleLocation=e.getLocation(),obstacleLocation[0]==shipLocation[0]&&obstacleLocation[1]==shipLocation[1]&&(isUpEmpty=!1)}),isUpEmpty?ship.moveDown():ship.vibrate())),state.pressedKeys.left&&(shipLocation=ship.getPosition(),0==shipLocation[0]?isUpEmpty=!1:(shipLocation[0]-=64,isUpEmpty=!0,obstacleList.map(e=>{obstacleLocation=e.getLocation(),obstacleLocation[0]==shipLocation[0]&&obstacleLocation[1]==shipLocation[1]&&(isUpEmpty=!1)}),isUpEmpty?ship.moveLeft():ship.vibrate())),state.pressedKeys.right&&(shipLocation=ship.getPosition(),704==shipLocation[0]?isUpEmpty=!1:(shipLocation[0]+=64,isUpEmpty=!0,obstacleList.map(e=>{obstacleLocation=e.getLocation(),obstacleLocation[0]==shipLocation[0]&&obstacleLocation[1]==shipLocation[1]&&(isUpEmpty=!1)}),isUpEmpty?ship.moveRight():ship.vibrate())),currentTime=(new Date).getTime(),(delta=currentTime-lastTime)>interval)if(cx.clearRect(0,0,cw,ch),"start_menu"===gameState.state)textInterface.renderStart();else if("end"===gameState.state)textInterface.renderEnd();else if("dead"===gameState.state)textInterface.renderDead();else if("playing"===gameState.state){if(score=game.getScore(),textInterface.renderInfoPanel(score),ship.render(),goal.render(),obstacleList.map(e=>e.render()),(currentLevelTicker-=1)<0){obstacleList.map(e=>e.moveBack()),ship.moveBack(),goal.moveBack(),currentLevelTicker=levelTicker,game.addScore(10),ship.isDead()&&(gameState.state="dead");let e=new Obstacle(cx);e.x=640,e.y=64*Math.floor(8*Math.random()),obstacleList.push(e)}lastTime=currentTime-delta%interval}}function loadImage(e){return new Promise(t=>{let a=new Image;a.onload=(()=>t(a)),a.src=e})}window.addEventListener("keydown",keydown,!1),window.addEventListener("keyup",keyup,!1),window.addEventListener("click",onClick,!1),Promise.all([loadImage("assets/images/intro_background.png")]).then(()=>{gameLoop()});