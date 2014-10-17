<?php
$name = htmlentities($_POST['name']);
$score = htmlentities($_POST['score']);

$scores = new DOMDocument();
$scores->load("highscore.xml");
$scoresRoot = $scores->getElementsByTagName('highscore')->item(0);

$scoresNode = $scores->createElement('player');
$scoresRoot->appendChild($scoresNode);
$scoresNode->appendChild($scores->createElement("name", $name));
$scoresNode->appendChild($scores->createElement("score", $score));

$scores->save("highscore.xml");


?>