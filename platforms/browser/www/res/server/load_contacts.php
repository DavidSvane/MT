<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');

$servername;
$username;
$password;
$dbname;
$conn;

function login() {
	global $servername, $username, $password, $dbname, $conn;
	$servername = "mysql13.unoeuro.com";
	$username = "davidsvane_com";
	$password = "fp3a652y";
	$dbname = "davidsvane_com_db";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error); }
}
function logout() {
	global $conn;
	$conn->close();
}

$request = $_POST['request'];

if ($request == 'contacts') {

  login();

  $sql = 'SELECT * FROM mt_contacts_jack';
  $result = $conn->query($sql);
  if ($result->num_rows > 0) { while($row = $result->fetch_assoc()) {
    $output[$row['id']]['name'] = utf8_encode($row['name']);
    $output[$row['id']]['mail'] = utf8_encode($row['mail']);
    $output[$row['id']]['phone'] = utf8_encode($row['phone']);
    $output[$row['id']]['function'] = utf8_encode($row['function']);
  }}
  echo(json_encode($output));

  logout();

}

?>
