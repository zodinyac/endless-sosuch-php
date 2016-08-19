<?php
$current_url  = isset($_SERVER['HTTPS']) ? 'https://' : 'http://';
$current_url .= $_SERVER['SERVER_NAME'];
$current_url .= $_SERVER['DOCUMENT_URI'];
$current_url = dirname($current_url) . "/";
$file_url = $current_url . "get_video.php";
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Endless sosuch</title>
</head>
<body>
<video width="100%" height="100%" autoplay controls preload>
<source type="video/webm" src="<?php echo file_get_contents($file_url); ?>" />
Your browser does not support the video tag.
</video>
<h1 align="center"><a href="<?php echo $current_url; ?>">Next video</a></h1>
</body>
</html>
