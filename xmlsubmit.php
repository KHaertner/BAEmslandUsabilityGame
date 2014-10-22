<?php
$name = htmlentities($_POST['name']);
$score = htmlentities($_POST['score']);

$scores = new DOMDocument();
$scores->load("highscore.xml");
$scoresRoot = $scores->getElementsByTagName('highscore')->item(0);

$scoresNode = $scores->createElement('player');							// erstellt das komplexe Element 'player'
$scoresRoot->appendChild($scoresNode);
$scoresNode->appendChild($scores->createElement("name", $name));		// fügt dem Element 'player' das simple Element 'name' hinzu mit der Variable Name
$scoresNode->appendChild($scores->createElement("score", $score));		// fügt dem Element 'player' das simple Element 'score' hinzu mit der Variable Score

$scores->save("highscore.xml");


?>