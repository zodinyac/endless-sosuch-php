<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Endless sosuch</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="style/style.css">
    <script src="js/jquery-3.1.0.min.js"></script>
    <script src="js/date.format.js"></script>
    <script src="js/index.js"></script>
</head>
<body>
    <div id="progressbar" class="progressbar">
        <div class="progress">
            <div id="bufferprogress" class="progress"></div>
            <div id="timeprogress" class="progress"></div>
        </div>
    </div>
    <video id="video" width="100%" height="100%" autoplay <!--controls--> preload>
        <source type="video/webm" src="media/filler.webm" />
        Your web browser does not support WebM video.
    </video>
    <div class="displayTopRight"></div>
    <div id="tooltip" class="is-hidden"></div>
    <div class="controlsleft">
        <span id="loadnewvideo" class="quadbutton fa fa-refresh"></span>
    </div>
    <div class="controlscenter">
        <span id="pause" class="quadbutton fa fa-play"></span>
    </div>
    <div class="controlsright">
        <span id="fullscreen" class="quadbutton fa fa-expand"></span>
    </div>
</body>
</html>
