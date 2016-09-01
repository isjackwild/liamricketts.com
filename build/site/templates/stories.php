<?php

	$all_stories = $page->children();
	$json = array();

	foreach ($stories as $story) {
		$title 			= (string)$story->title()->html(); // All
		$subtitle 		= ($story->subtitle()->exists() ? (string)$subtitle->subtitle()->html() : null); // only Text
		$background		= (string)$story->background()->html();

		$images_json = array();

		

		$story_json = array(
			'title' => $title,
			'subtitle' => $title,
			'images' => $images_json,
		);
		
		array_push($json, $story_json);
	}

	echo json_encode($json);

?>