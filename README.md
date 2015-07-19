# Image Resizer

A jQuery widget for client image resizing. It's built to function just like the Profile Image Cropping tool found on Facebook. Fell free to use this in any of your own projects. This project supports any browser that your chosen version jQuery library supports.

To use you must have jQuery UI with a minimum version number of 1.5 and a jQuery version of 1.2.6 or higher.

## Getting Started
### Files to Include
```
		<script src="jquery.min.js"></script>
		<script src="jquery-ui.min.js"></script>
		<script src="image_sizer_1.0.min.js"></script>
		<link rel="stylesheet" href="imager_sizer_1.0.min.css">
```
### Calling the UI
```
$("#container").cropper({
    width:     400,                     //The final width of the image
    height:    400,                     //The final height of the image
    zoom:      2,                       //Maximum allowed zoom
    contain:   false,                   //Cover or contain
    image_url: "example_image_1.jpg",   //URL of the photo to load
    
    button:    $("#save_button"),       //Element to attach submit callback to

    submit: function() {},              //Callback to run when the user clicks submit
    slide:  function() {},              //Callback to run when the user moves the slider
    drag:   function() {}               //Callback to run when the user drags the image
});
```

## Example
 - [Cover](https://stevenimle.github.io/Image_Resizer/examples/cover/)
 
