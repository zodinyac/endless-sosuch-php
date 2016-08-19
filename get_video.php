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
    die("loading error");
}

$content = json_decode($content);
if ($content === NULL) {
    die("json decoding error");
}

$threads = [];
foreach ($content->threads as $thread) {
    $comment = $thread->posts[0]->comment;
    if (preg_match($config["include_keywords"], $comment) === 1 && preg_match($config["exclude_keywords"], $comment) == 0) {
        $threads[] = $thread->posts[0]->num;
    }
}

$random_thread = $threads[array_rand($threads)];
curl_setopt($ch, CURLOPT_URL, sprintf($config["url_thread"], $random_thread));

$content = curl_exec($ch);
if ($content === FALSE) {
    die("loading error");
}

$content = json_decode($content);
if ($content === NULL) {
    die("json decoding error");
}

$videos = [];
foreach ($content->threads[0]->posts as $post) {
    foreach ($post->files as $file) {
        if (endsWith($file->name, ".webm")) {
            $videos[] = $file->name;
        }
    }
}

$random_video = $videos[array_rand($videos)];

echo sprintf($config["url_video"], $random_thread, $random_video);

curl_close($ch);
?>
