<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: OPTION, GET, POST, PUT, DELETE, FILE');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accespt, Key');
?>
<?php
echo file_get_contents($_GET['endpoint']);
?>