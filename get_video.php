<?php
require_once("config.php");
require_once("utils.php");

$board = $config["default_board"];
$threads = [];

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => sprintf($config["url"], $board),
    CURLOPT_COOKIE => $config["cookie"],
    CURLOPT_COOKIEFILE => "",
    CURLOPT_COOKIEJAR => "",
    CURLOPT_RETURNTRANSFER => TRUE,
    CURLOPT_USERAGENT => $config["user_agent"],
]);

if (!isset($_GET["hash"]) || strpos($_GET["hash"], "2ch.hk") === false) {
    $content = curl_exec($ch);
    if ($content === FALSE) {
        die("threads loading error");
    }

    $content = json_decode($content);
    if ($content === NULL) {
        die("threads json decoding error");
    }

    foreach ($content->threads as $thread) {
        $comment = $thread->posts[0]->comment;
        if (preg_match($config["include_keywords"], $comment) === 1 && preg_match($config["exclude_keywords"], $comment) == 0) {
            $threads[] = $thread->posts[0]->num;
        }
    }
    shuffle($threads);

    if (count($threads) === 0) {
        die("threads not found");
    }
} else {
    if (preg_match($config["hash_pattern"], $_GET["hash"], $matches) === 1) {
        $board = $matches[1];
        $threads[] = $matches[2];
    }
}

$videos = [];
foreach ($threads as $thread) {
    curl_setopt($ch, CURLOPT_URL, sprintf($config["url_thread"], $board, $thread));
    
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
                $videos[] = sprintf($config["url_video"], $board, $thread, $file->name);
            }
        }
    }
}
shuffle($videos);

echo json_encode($videos, JSON_UNESCAPED_SLASHES);

curl_close($ch);
?>
