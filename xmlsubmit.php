<?php
	$filename = 'highscore.xml';

	// code
	$file = realpath($filename) ? realpath($filename) : false;
	if ( $file ) $xml = simplexml_load_file($file);
	else {
		$xml = new SimpleXMLElement('<highscore></highscore>');
		$xml->asXML($filename);
	}

	$targetNode = $xml->xpath('player');

	if ( count($targetNode) == 0 ) $xml->addChild('player', 'neuer Wert');
	$xml->wochentag[0] = 'neuer Wert';

$xml->asXML($filename); 
?>