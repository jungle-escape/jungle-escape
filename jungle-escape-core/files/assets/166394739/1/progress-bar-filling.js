var ProgressBarFilling = pc.createScript('progressBarFilling');



// The entity that shows the fill image 
ProgressBarFilling.attributes.add('progressImage', { type: 'entity' });
// The maximum width of the fill image
ProgressBarFilling.attributes.add('progressImageMaxWidth', { type: 'number' });



// initialize code called once per entity
ProgressBarFilling.prototype.initialize = function () {
    // use our own rect object to set the size of 
    // the progress bar
    this.imageRect = this.progressImage.element.rect.clone();

    // initialize progress to 0
    this.setProgress(0);
    // if true the progress bar will increase 
    // otherwise it will decrease in update
    this.increase = true;
    BAR = this;
};

// update code called every frame
// ProgressBarFilling.prototype.update = function (dt) {

//     var diff = this.increase ? dt : -dt;
//     this.setProgress(this.progress + diff);

//     if (this.progress >= 1)
//         this.increase = false;
//     else if (this.progress <= 0)
//         this.increase = true;

// };

// Set progress - value is between 0 and 1
ProgressBarFilling.prototype.setProgress = function (value) {
    // clamp value between 0 and 1
    value = pc.math.clamp(value, 0, 1);

    this.progress = value;

    // find the desired width of our progress fill image
    var width = pc.math.lerp(0, this.progressImageMaxWidth, value);
    // set the width of the fill image element
    this.progressImage.element.width = width;

    // Set the width of the element's rect (rect.z) to be the same
    // value as our 0-1 progress.
    // This is so that the fill image will only show the portion
    // of the texture that is visible
    this.imageRect.copy(this.progressImage.element.rect);
    this.imageRect.z = value;
    // force rect update
    this.progressImage.element.rect = this.imageRect;
};
