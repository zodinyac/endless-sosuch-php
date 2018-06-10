<?php
$config = [
    "include_keywords" => "/(*UTF8)(webm|цуиь|(в|ш)ебм)/i",
    //"exclude_keywords" => "/(*UTF8)(анимублядский)/i",
    "exclude_keywords" => "",
    
    "hash_pattern" => "/(\w*)\/res\/(\d+)/",
    
    "cookie" => "cf_clearance=40357ce2aa834121ae9de56437e95742d49e5ae7-1474808278-2592000",
    "url" => "https://2ch.hk/%s/index.json",
    "url_thread" => "https://2ch.hk/%s/res/%d.json",
    "url_video" => "https://2ch.hk/%s/src/%d/%s",
    "user_agent" => "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36",
    "default_board" => "b",
];
?>
