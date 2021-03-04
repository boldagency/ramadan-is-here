//@input Component.ScriptComponent objectSpawner

var threshold = 0.1;

var screenTransform = script.getSceneObject() ? script.getSceneObject().getComponent("Component.ScreenTransform") : undefined;
var movingSpeed =  script.objectSpawner ? script.objectSpawner.api.getMovementSpeed() : undefined;

script.createEvent("UpdateEvent").bind(function(){
    if(script.objectSpawner){
        
         //Generate Random Number for x position of the cloud prefab
         var currentpos =  screenTransform.anchors.getCenter();    
          currentpos.x -= movingSpeed * getDeltaTime()/30;  
       
        //Moving clouds to the nearest edge 
        if(global.fadeClouds){
            if(currentpos.x<0){
               currentpos.x -= movingSpeed * getDeltaTime();
            }
            else {
                currentpos.x += movingSpeed * getDeltaTime();
            }
            screenTransform.anchors.setCenter(currentpos);
            if(currentpos.x < -30){
                script.getSceneObject().destroy();
            }
        }
    }
           
});