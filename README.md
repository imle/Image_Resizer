# Image Resizer

A jQuery widget for client image resizing. It's built to function just like the Profile Image Cropping tool found on Facebook. Fell free to use this in any of your own projects. This project supports any browser that your chosen version of jQuery supports.

## Getting Started
### Files to Include
You must be using jQuery UI with a minimum version number of 1.5 and a jQuery version of 1.2.6 or higher.
```
<script src="jquery.min.js"></script>
<script src="jquery-ui.min.js"></script>
<script src="image_sizer.min.js"></script>
<link rel="stylesheet" href="image_sizer.min.css">
```
If you want to use this plugin on mobile, you will have to include [jQuery UI Touch Punch](http://touchpunch.furf.com/)
```
<script src="jquery.ui.touch-punch.min.js"></script>
```

### Calling the UI
```
$("#container").cropper({
    height:    400,                     //The final height of the image
    width:     400,                     //The final width of the image
    zoom:      2,                       //Maximum allowed zoom
    contain:   false,                   //Cover or contain
    image_url: "example_image_1.jpg",   //URL of the photo to load

    button:    $("#save_button"),       //Element to attach submit callback to

    submit:    function() {},           //Callback to run when the user clicks submit
    slide:     function() {},           //Callback to run when the user moves the slider
    drag:      function() {},           //Callback to run when the user drags the image
    ready:     function() {}            //Callback to run when the image has loaded (Best time to show modal)
});
```

### Using the Data
The following data structure will be passed to the submit callback.
```
data = {
    height: 400                     //Specified input height value
    width:  400                     //Specified input width value
    ratio:  1.0651465798045603      //Ratio of the zoom (i.e. 106% of the original size)
    top_x:  0.37484355444305384     //Percent based distance of top left corner from left edge of image
    top_y:  0.10703363914373089     //Percent based distance of top left corner from top of image
    bot_x:  0.6251564455569462      //Percent based distance of bottom right corner from left edge of image
    bot_y:  0.7186544342507645      //Percent based distance of bottom right corner from top of image
}
```

## Example
 - [Cover](https://stevenimle.github.io/Image_Resizer/examples/cover/)
 - [Contain](https://stevenimle.github.io/Image_Resizer/examples/contain/)