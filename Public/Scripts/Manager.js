//@input Asset.ObjectPrefab[] objectPrefab
//@input float spawnFrequency{"widget":"slider","min":0.1, "max":4, "step":0.02}
//@input float spawnRandomizer{"widget":"slider","min":0, "max":0.5, "step":0.02}
//@input float spawnRange {"widget":"slider","min":0, "max":1, "step":0.1}
//@input float movingSpeedMin
//@input float movingSpeedMax
//@input Component.Camera camera
//@input Component.Head HeadDirectionImage

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Screens"}
//@input SceneObject StartScreen
//@input SceneObject GameScreen
//@input SceneObject EndScreen

//0--BeforeGameStart 1--DuringGame 2--GameEnded
var startgame = false;
var gameState = 0;
setState(0);
countdownStart();

var countDownDate=3;


var spawnedObjects = [];
var spawnTimer = 0;
var spawnFrequency =  script.spawnFrequency; //reverse spawnFrequency so higher number would produce more frequent result, not necessary for our game but easier to understand.
var spawnRange = script.spawnRange;

//get screen position of this aka ObjectSpawner object
var screenTransform = script.getSceneObject().getComponent("Component.ScreenTransform");    
var myScreenPos = screenTransform.anchors.getCenter();


script.createEvent("UpdateEvent").bind(function(){
    if(script.camera ){
     var t=  new vec2( script.HeadDirectionImage.getSceneObject().getComponent('Component.Head').getTransform().getLocalPosition().x, 1);
      script.getSceneObject().getParent().getComponent('Component.ScreenTransform').anchors.left=
        -1 * script.HeadDirectionImage.getSceneObject().getComponent('Component.Head').getTransform().getLocalPosition().x;
       // print(script.HeadDirectionImage.getSceneObject().getComponent('Component.Head').getTransform().getLocalPosition())
      if(spawnTimer < spawnFrequency){
        spawnTimer += getDeltaTime();
        }else{
            spawnObject();
            spawnTimer = 0;
            spawnFrequency = script.spawnFrequency + Math.random()*script.spawnRandomizer*2 - script.spawnRandomizer;
        }    
    }
});




function spawnObject(){

        //creating a copy of the prefab   
    var randomIndex = Math.floor(Math.random()*script.objectPrefab.length);
    var newObj = script.objectPrefab[randomIndex].instantiate(script.getSceneObject().getParent());
    newObj.name = "Cookie" + spawnedObjects.length.toString();
    spawnedObjects.push(newObj);
    
    
   //randomize position with range
    var randomXpos = 3;
    var randomYpos = myScreenPos.y + Math.random()*script.spawnRange*4  - script.spawnRange ;
    var newObjPosition = new vec2(randomXpos, randomYpos);
    
    //set screen position of newObj aka ObjectPrefab object
    var objScreenTransform = newObj.getComponent("Component.ScreenTransform");
    objScreenTransform.anchors.setCenter(newObjPosition);

}



function getMovementSpeed(){
   return Math.random() * (script.movingSpeedMax - script.movingSpeedMin) + script.movingSpeedMin ;
}


function setState(gameStateInt){
  gameState= gameStateInt;
  if(script.camera)
   switch(gameStateInt){
       case 0://before game start
           script.StartScreen.enabled = true;
          script.GameScreen.enabled = false;
       break;
       case 1://during game
           script.StartScreen.enabled = false;
           script.GameScreen.enabled = true;
       break;
//       case 2://after game ended
//           script.StartScreen.enabled = false;
//           script.ScoreScreen.enabled = false;
//           script.EndScreen.enabled = true;
//          script.Sound_BGM.stop(false);
//       break;
   }
}

//Enable Counter
function countdownStart() {
    // Update the count down every 1 second
    var delayedEvent = script.createEvent('DelayedCallbackEvent')
    delayedEvent.bind(function(eventData) {
    countDownDate  = countDownDate - 1;
      if (countDownDate <= 0) {
        countdownFinished()
      } else {
        delayedEvent.reset(1)
      }
    })
    delayedEvent.reset(0)
}
//Function that will run when countdowun is over
function countdownFinished() {
        setState(1);
}

script.api.getMovementSpeed = getMovementSpeed;
