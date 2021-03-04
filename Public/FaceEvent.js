// -----JS CODE-----
// @input SceneObject upper
// @input SceneObject lower

// @input Component.AnimationMixer AnimationMixer
// @input string openLayer
// @input string closedLayer
// @input int animationPlayCount = 1 {"label": "Play Count", "min":-1, "max":99999, "step":1} // How many times to play the animation, -1 for infinite

// @input Component.MaterialMeshVisual monoLens
// @input Asset.Material newMaterial




var lensActivated = false;
var time = 0;

//call the function on every frame
var event = script.createEvent("UpdateEvent");
event.bind(function (eventData)
{
    var upper = script.upper.getTransform().getWorldPosition();
    var lower = script.lower.getTransform().getWorldPosition();
    
    var distance = upper.y - lower.y;
    var roundedDistance = Math.round(distance * 10) / 10;
    
    //global.logToScreen("distance: " + distance);
    //print("distance: " + distance);
    
    if(distance <= 0.8) {
        if(lensActivated == false) {
            
            time+= getDeltaTime();
        
            if(time > 1.2) {
                lensActivated = true;
                //global.logToScreen("activated"); 
                //play the animation and open the monocular
                if (script.AnimationMixer && script.openLayer) {
                    if (script.AnimationMixer.getLayer(script.openLayer)) {
                        script.AnimationMixer.startWithCallback(script.openLayer, 0.0, script.animationPlayCount, animationCallback);                    
                        script.AnimationMixer.getLayer(script.openLayer).weight = 1.0;
                        
                        //this should be triggered after the lens experience ends.
                        //script.monoLens.addMaterial(script.newMaterial);
                    }
                }
                time = 0;
            }
            
        }
    }
    
    /*
    if(distance <= 1) {
        if(lensActivated == true) {
            lensActivated = false;
            //play the animation and close the monocular
            if (script.AnimationMixer && script.closedLayer) {
                if (script.AnimationMixer.getLayer(script.closedLayer)) {
                    script.AnimationMixer.startWithCallback(script.closedLayer, 0.0, script.animationPlayCount, animationCloseCallback);
                    script.AnimationMixer.getLayer(script.closedLayer).weight = 1.0;
                }
            }
        }
    }
    */
});


// Called when open animation ends
function animationCallback() {
    if (script.AnimationMixer.getLayer(script.openLayer)) {
        script.AnimationMixer.getLayer(script.openLayer).weight = 0.0;
    }
}

// Called when closed animation ends
function animationCloseCallback() {
    if (script.AnimationMixer.getLayer(script.closedLayer)) {
        script.AnimationMixer.getLayer(script.closedLayer).weight = 0.0;
    }
}