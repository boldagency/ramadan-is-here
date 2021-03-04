//@input Component.ScriptComponent objectSpawner

var threshold = 0.1;
var distanceFromMouth = 0;

var screenTransform = script.getSceneObject() ? script.getSceneObject().getComponent("Component.ScreenTransform") : undefined;
var movingSpeed =  script.objectSpawner ? script.objectSpawner.api.getMovementSpeed() : undefined;

script.createEvent("UpdateEvent").bind(function(){
    if(script.objectSpawner){
         var currentpos =  screenTransform.anchors.getCenter();
    
        var parent=script.getSceneObject().getComponent('Component.ScreenTransform');
          currentpos.x -= movingSpeed * getDeltaTime()/30;  
       
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