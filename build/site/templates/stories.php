<?php

	$stories = $page->children();
	$json = array();

	foreach ($stories as $story) {
		$content = $story->children();
		$content_json = array();

		foreach ($content as $item) {
			$files = $item->files();
			$large = $files->find('large.jpg');
			$medium = $files->find('medium.jpg');
			$small = $files->find('small.jpg');
			$aR = ($large->exists() ? ($large->dimensions()->width() / $large->dimensions()->height()) : null);

			$images_json = array(
				'large' => ($large->exists() ? (string)$large->url() : null),
				'medium' => ($medium->exists() ? (string)$medium->url() : null),
				'small' => ($small->exists() ? (string)$small->url() : null),
				'aspectRatio' => (float)$aR,
			);

			$item_json = array(
				'size' 		=> (string)$item->size()->value(),
				'alignment' => (string)$item->alignment()->value(),
				'margin'	 => (string)$item->margin()->value(),
				'hideInHomepage' => (bool)$item->hideinhomepage()->bool(),
				'images' 	=> $images_json,
			);
			
			array_push($content_json, $item_json);
		}

		$story_json = array(
			'title'		=> (string)$story->title()->html(),
			'subtitle'	=> ($story->subtitle()->exists() ? (string)$story->subtitle()->html() : null),
			'background'=> (string)$story->background()->html(),
			'items'	=> $content_json,
		);
		array_push($json, $story_json);
	}

	echo json_encode($json);
?>