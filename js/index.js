var videos = [];
var videos_history = [];

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
    
    $("#video > source").on("error", function(e) {
        
    });
    
    $(this).keydown(function(e) {
        switch (e.which) {
            case 32: // Space
                playPause();
                break;
            case 78: // N
                loadVideo();
                break;
            case 70: // F
                toggleFullscreen();
                break;
            case 77: // M
                toggleMenu();
                break;
            case 66: // B
                bookmarkAdd();
                break;
            case 76: // L
                bookmarkList();
                break;
            case 67: // C
                bookmarkClear();
                break;
            case 38: // Up
                changeVolume(0.05);
                break;
            case 40: // Down
                changeVolume(-0.05);
                break;
            case 37: // Left
                $("#video")[0].currentTime -= 5; // seconds
                break;
            case 39: // Right
                $("#video")[0].currentTime += 5; // seconds
                break;
            default:
                return;
        }
        e.preventDefault();
    });
    
    var wheelEvent = isEventSupported("wheel") ? "wheel" : "mousewheel";
    $(document).on(wheelEvent, function(e) {
        var oEvent = e.originalEvent;
        var delta  = oEvent.deltaY || oEvent.wheelDelta;
        if (delta > 0) { // Scrolled down
            changeVolume(-0.05);
        } else if (delta < 0) { // Scrolled up
            changeVolume(0.05);
        }
    });
    
    $("#menubutton").hover(tooltip);
   
    $(".controlsleft").children().hover(tooltip);
    $(".controlscenter").children().hover(tooltip);
    $(".controlsright").children().hover(tooltip);
    
    loadVideo();
});

function isEventSupported(eventName)
{
    var el = document.createElement("div");
    eventName = "on" + eventName;
    var isSupported = (eventName in el);

    if (!isSupported) {
        el.setAttribute(eventName, "return;");
        isSupported = typeof el[eventName] === "function";
    }

    return isSupported;
}

function isFullscreen()
{
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
}

function toggleFullscreen()
{
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
    
    tooltip();
    tooltip("fullscreen");
}

function getVideoList()
{
    $.get("get_video.php", function(data) {
        var answer = JSON.parse(data);
        if ($.isArray(answer) && answer.length > 0) {
            videos = answer;
            loadVideo();
        } else {
            //alert(data);
            getVideoList();
        }
    });
}

function loadVideo()
{
    if (videos.length > 0) {
        var url = videos.shift();
        videos_history.push(url);
        console.log("Now (" + new Date().format("HH:MM:ss dd/mm/yyyy") + ") playing: " + url);
        
        $("#videolink").attr("href", url);
        
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
    
    tooltip();
    tooltip("pause");
}

function changeVolume(amount)
{
    var video = $("#video")[0];
    if (video.volume > 0 && amount < 0) {
        video.volume = (video.volume + amount).toPrecision(2);
    } else if (video.volume < 1 && amount > 0) {
        video.volume = (video.volume + amount).toPrecision(2);
    }

    var percent = (video.volume * 100);
    if (video.volume < 0.1) {
        percent = percent.toPrecision(1);
    } else if (video.volume == 1) {
        percent = percent.toPrecision(3);
    } else {
        percent = percent.toPrecision(2);
    }

    displayTopRight(percent + "%");
}

function displayTopRight(text,delay)
{
    $(".displayTopRight").stop(true, true);
    $(".displayTopRight").text(text);
    $(".displayTopRight").show();
    $(".displayTopRight").delay(delay ? delay : 0).fadeOut(1000);
}

function menuIsHidden()
{
    return Boolean($("#site-menu").attr("hidden"));
}
function showMenu()
{
    $("#menubutton").hide();
    $("#site-menu").removeAttr("hidden");
}
function hideMenu()
{
    $("#menubutton").show();
    $("#site-menu").attr("hidden", "");
}

function toggleMenu()
{
    if (menuIsHidden()) {
        showMenu();
    } else {
        hideMenu();
    }
}

function tooltip(text, css)
{
    var eventType;
    if (text && text.target) {
        eventType = text.type;
        text = text.target.id;
    }

    switch (text) {
        case "menubutton":
            text = "Menu (M)";
            css = "top: 65px; bottom: auto; left: 10px;";
            break;
        case "loadnewvideo":
            text = "Click to get a new video (N)";
            css = "left";
            break;
        case "pause":
            if ($("#video")[0].paused) {
                text = "Click to play the video (spacebar)";
            } else {
                text = "Click to pause the video (spacebar)";
            }
            css = "center";
            break;
        case "fullscreen":
            if (isFullscreen()) {
                text = "Click to exit fullscreen (F)";
            } else {
                text = "Click to enter fullscreen (F)";
            }
            css = "right";
            break;
    }
    
    $("#tooltip").removeAttr("style");
    if (css == "left" || css == "right") {
        $("#tooltip").attr("style", css + ": 10px;");
    } else if (css == "center") {
        $("#tooltip").attr("style", "right: 50%; transform: translateX(50%);");        
    } else {
        $("#tooltip").attr("style", css);
    }
    $("#tooltip").html(text);
    
    $("#tooltip").toggleClass("is-hidden", eventType && eventType === "mouseleave");
    $("#tooltip").toggleClass("is-visible", eventType && eventType === "mouseenter");
}

function bookmarkAdd(url)
{
    if (!url) {
        url = videos_history[videos_history.length - 1];
    }
    if (bookmarkCheck(url)) {
        return;
    }
    
    var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    var bookmark = {
        date: new Date(),
        url: url,
    };
    
    if ($.isArray(bookmarks)) {
        bookmarks.push(bookmark);
    } else {
        bookmarks = [bookmark];
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function bookmarkCheck(url)
{
    var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    if ($.isArray(bookmarks)) {
        return bookmarks.some(function(bookmark) {
            return bookmark.url === url;
        });
    } else {
        return false;
    }
}

function bookmarkClear()
{
    localStorage.removeItem("bookmarks");
}

function bookmarkList()
{
    var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    if ($.isArray(bookmarks)) {
        console.log("Bookmarks list:");
        $.each(bookmarks, function(index, bookmark) {
            console.log(new Date(bookmark.date).format("HH:MM:ss dd/mm/yyyy") + ": " + bookmark.url);
        });
    } else {
        console.log("There is no bookmarks.")
    }
}
