var videos = [];

$( document ).ready(function() {
    $("#loadnewvideo").on("click", function() {
        loadVideo();
    });
    
    $("#fullscreen").on("click", function() {
        toggleFullscreen();
    });
    
    $("#pause").on("click", function() {
        playPause();
    });
    
    $("#progressbar").on("click", function (e) {
        var video = $("#video")[0];
        var percentage = e.pageX / $(document).width();
        video.currentTime += video.duration * percentage - video.currentTime;
    });
    
    $("#video").on("progress", function() {
        var video = $("#video")[0];
        var buffered = ((video.buffered && video.buffered.length) ? 100 * (video.buffered.end(0) / video.duration) : (video.readyState == 4 ? 100 : 0));
        $("#bufferprogress").width(buffered.toString() + "%");
    });
    
    $("#video").on("timeupdate", function() {
        var video = $("#video")[0];
        var watched = 100 * (video.currentTime / video.duration);
        $("#timeprogress").width(watched.toString() + "%");
    });
    
    $("#video").on("click", function () {
        playPause();
    });
    
    $("#video").on("ended", function () {
        loadVideo();
    });
    
    $(this).keydown(function(e) {
        switch (e.which) {
            case 32: // Space
                playPause();
                break;
            default:
                return;
        }
        e.preventDefault();
    });
    
    loadVideo();
});

function isFullscreen() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
}
function toggleFullscreen() {
    if (isFullscreen()) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } else {
        var e = $("html")[0];
        if (e.requestFullscreen) {
            e.requestFullscreen();
        } else if (e.webkitRequestFullscreen) {
            e.webkitRequestFullscreen();
        } else if (e.mozRequestFullScreen) {
            e.mozRequestFullScreen();
        } else if (e.msRequestFullscreen) {
            e.msRequestFullscreen();
        }
    }
}

function getVideoList()
{
    $.get( "get_video.php", function(data) {
        var answer = JSON.parse(data);
        if ($.isArray(answer) && answer.length > 0) {
            videos = answer;
            loadVideo();
        } else {
           getVideoList();
        }
    });
}

function loadVideo()
{
    if (videos.length > 0) {
        var url = videos.shift();
        console.log("Now (" + new Date().format("HH:MM:ss dd/mm/yyyy") + ") playing: " + url);
        
        $("#video > source").attr("src", url);
        $("#video")[0].load();
        
        $("#pause").removeClass("fa-play");
        $("#pause").addClass("fa-pause");
    } else {
        getVideoList();
    }
}

function playPause()
{
    var video = $("#video")[0];
    
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }

    $("#pause").toggleClass("fa-play").toggleClass("fa-pause");
}
