<?php
function endsWith($haystack, $needle)
{
    return $needle === "" ||
            (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
}
?>
