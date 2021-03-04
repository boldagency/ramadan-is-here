// -----JS CODE-----
// @input SceneObject upper
// @input SceneObject lower

// @input Component.AnimationMixer AnimationMixer
// @input string openLayer
// @input string closedLayer
// @input int animationPlayCount = 1 {"label": "Play Count", "min":-1, "max":99999, "step":1} // How many times to play the animation, -1 for infinite


var lensActivated = false;
var time = 0;


//call the function on every frame
var event = script.createEvent("UpdateEvent");
event.bind(function (eventData)
{   
    
    //read the value if the face markers placed to detect eye closing event.
    var upper = script.upper.getTransform().getWorldPosition();
    var lower = script.lower.getTransform().getWorldPosition();
    
    //calculate the distance on the y axis.
    var distance = upper.y - lower.y;
    var roundedDistance = Math.round(distance * 10) / 10;
    
    
    //if distance goes smaller than 0.8 activate the event
    if(distance <= 0.8) {
        if(lensActivated == false) {
            
            time+= getDeltaTime();
            //if it stays close for a little less than a second, proceed with expanding the monoscope.
            if(time > 0.8) {
                lensActivated = true;
                
                //play the animation and open the monocular
                if (script.AnimationMixer && script.openLayer) {
                    if (script.AnimationMixer.getLayer(script.openLayer)) {
                        script.AnimationMixer.startWithCallback(script.openLayer, 0.0, script.animationPlayCount, animationCallback);                    
                        script.AnimationMixer.getLayer(script.openLayer).weight = 1.0;
                    }
                }
                time = 0;
            }
        }
    }
});


// Called when open animation ends
function animationCallback() {
    if (script.AnimationMixer.getLayer(script.openLayer)) {
        script.AnimationMixer.getLayer(script.openLayer).weight = 0.0;
    }
}