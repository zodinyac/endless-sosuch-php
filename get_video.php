<?php
require_once("config.php");
require_once("utils.php");

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $config["url"],
    CURLOPT_COOKIE => $config["cookie"],
    CURLOPT_COOKIEFILE => "",
    CURLOPT_COOKIEJAR => "",
    CURLOPT_RETURNTRANSFER => TRUE,
    CURLOPT_USERAGENT => $config["user_agent"],
]);

$content = curl_exec($ch);
if ($content === FALSE) {
    die("threads loading error");
}

$content = json_decode($content);
if ($content === NULL) {
    die("threads json decoding error");
}

$threads = [];
foreach ($content->threads as $thread) {
    $comment = $thread->posts[0]->comment;
    if (preg_match($config["include_keywords"], $comment) === 1 && preg_match($config["exclude_keywords"], $comment) == 0) {
        $threads[] = $thread->posts[0]->num;
    }
}
shuffle($threads);

$videos = [];
foreach ($threads as $thread) {
    curl_setopt($ch, CURLOPT_URL, sprintf($config["url_thread"], $thread));
    
    $content = curl_exec($ch);
    if ($content === FALSE) {
        die("posts loading error");
    }

    $content = json_decode($content);
    if ($content === NULL) {
        die("posts json decoding error");
    }

    foreach ($content->threads[0]->posts as $post) {
        foreach ($post->files as $file) {
            if (endsWith($file->name, ".webm")) {
                $videos[] = sprintf($config["url_video"], $thread, $file->name);
            }
        }
    }
}

shuffle($videos);
echo json_encode($videos, JSON_UNESCAPED_SLASHES);

curl_close($ch);
?>
