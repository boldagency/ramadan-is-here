//@input Asset.ObjectPrefab[] objectPrefab
//@input float spawnFrequency{"widget":"slider","min":0.1, "max":4, "step":0.02}
//@input float spawnRandomizer{"widget":"slider","min":0, "max":0.5, "step":0.02}
//@input float spawnRange {"widget":"slider","min":0, "max":1, "step":0.1}
//@input float movingSpeedMin
//@input float movingSpeedMax

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Head Position Direction"}
//@input Component.Head HeadDirectionImage

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Screens"}
//@input SceneObject StartScreen
//@input SceneObject GameScreen
//@input SceneObject EndScreen
//@input SceneObject StarsRegion

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Game Duration"}
//@input int timer

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Monocular"}
// @input Component.MaterialMeshVisual monoLens
// @input Asset.Material newMaterial


global.fadeClouds=false; //set to true whenever you want to separate the clouds

//0--BeforeGameStart 1--DuringGame 2--GameEnded
//Initially the game state is 0
var gameState = 0;
setState(0);
var startgame = false;

//Set Screen to Start Screen
startGame();

var spawnedObjects = [];
var spawnTimer = 0;
var spawnFrequency =  script.spawnFrequency; //reverse spawnFrequency so higher number would produce more frequent result.
var spawnRange = script.spawnRange;


//get screen position of this aka ObjectSpawner object
var screenTransform = script.getSceneObject().getComponent("Component.ScreenTransform");    
var myScreenPos = screenTransform.anchors.getCenter();


script.createEvent("UpdateEvent").bind(function(){
    
    if(script.getSceneObject() ){
        
        //update direction of 'Clouds Screen' Region depending on the Head Position/Direction
        //Here we are updating the anchors in the oppsite direction of the user's head movement
        script.getSceneObject().getParent().getComponent('Component.ScreenTransform').anchors.left=  -1 * script.HeadDirectionImage.getSceneObject().getComponent('Component.Head').getTransform().getLocalPosition().x/20;

        //Create Clouds Prefab
        if(spawnTimer < spawnFrequency ){
            spawnTimer += getDeltaTime();
        }
        else{
            if(startgame){
                spawnObject();
                spawnTimer = 0;
                spawnFrequency = script.spawnFrequency + Math.random()*script.spawnRandomizer*2 - script.spawnRandomizer;
            }
        }    
    }
});


function spawnObject(){
    //creating a copy of the prefab   
    var randomIndex = Math.floor(Math.random()*script.objectPrefab.length);
    var newObj = script.objectPrefab[randomIndex].instantiate(script.getSceneObject().getParent());
    newObj.name = "cloud" + spawnedObjects.length.toString();
    spawnedObjects.push(newObj);
    
   //randomize position with range
    var randomXpos = 3;
    var randomYpos = myScreenPos.y + Math.random()*script.spawnRange*4  - script.spawnRange ;
    var newObjPosition = new vec2(randomXpos, randomYpos);
    
    //set screen position of newObj aka ObjectPrefab object
    var objScreenTransform = newObj.getComponent("Component.ScreenTransform");
    objScreenTransform.anchors.setCenter(newObjPosition);

}


//Generate Random Number for Clouds Speeds
function getMovementSpeed(){
   return Math.random() * (script.movingSpeedMax - script.movingSpeedMin) + script.movingSpeedMin ;
}


//Set State of the App
// 1--Start Screen  2--Game Screen 3-- End Screen
function setState(gameStateInt){
  
  gameState= gameStateInt; // set gameState 
    
   switch(gameStateInt){
       case 0://before game start
        script.StartScreen.enabled = true;
        script.GameScreen.enabled = false;
        script.EndScreen.enabled = false;
       break;
        
       case 1://during game
        script.StartScreen.enabled = false;
        script.GameScreen.enabled = true;
        script.EndScreen.enabled = false;
       break;
        
       case 2://after game ended
           script.StartScreen.enabled = false;
           script.GameScreen.enabled = true;
           script.EndScreen.enabled = true;
       break;
   }
}

//Enable Start Screen Region
//1-- after a specific number of seconds(script.timer), the start screen should fadeOut and Game Screen should start
function startGame() {
    
    var duration= script.timer/2;  // Duration of the first screen
    countDown(duration, 0)
}


//Enable Game Region
//1-- after a specific number of seconds(script.timer), the game screen should fadeOut and End Screen should fadeIn
function onGameStart(){
     setState(1);
     startgame=true;
    
    countDown(script.timer, 1)
}

//Timer Function that takes 2 arguments:
//1--timer define the overall duration of the interval
//2--state  is the current screen state (0-Start Screen 1-FGame Screen 2-End Screen)
function countDown(timer, state){
     var countDownDateGame= timer;
     var delayedEvent = script.createEvent('DelayedCallbackEvent')
        delayedEvent.bind(function(eventData) {
            countDownDateGame  = countDownDateGame - 1;
            if (countDownDateGame <= 0) {
                if(state==0){
                    onGameStart();
                }
                if(state==1){
                    onGameEnd();
                }
                startgame=false;
            } else {
                delayedEvent.reset(1)
            }
        })
        delayedEvent.reset(0)

}

//Function that will show the End Screen
function onGameEnd(){
    global.fadeClouds=true;
    startgame=false;
    setState(2);
    
    //FadeOut the clouds
    global.tweenManager.startTween( script.getSceneObject(), "clouds-alpha"); 
    global.tweenManager.startTween( script.getSceneObject(), "clouds2-alpha"); 
    global.tweenManager.startTween( script.getSceneObject(), "clouds3-alpha");
            
    //this should be triggered after the lens experience ends.
    script.monoLens.addMaterial(script.newMaterial);
}

script.api.getMovementSpeed = getMovementSpeed;
