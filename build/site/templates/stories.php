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
			$fullWidth = ($large->exists() ? $large->dimensions()->width() : 0);
			$fullHeight = ($large->exists() ? $large->dimensions()->height() : 0);
			$aR = ($large->exists() ? ($fullHeight / $fullWidth) : null);

			$images_json = array(
				'large' => ($large ? (string)$large->url() : null),
				'medium' => ($medium ? (string)$medium->url() : null),
				'small' => ($small ? (string)$small->url() : null),
				'aspectRatio' => (float)$aR,
				'fullWidth' => (float)$fullWidth,
				'fullHeight' => (float)$fullHeight,
			);

			$item_json = array(
				'size' 		=> (string)$item->size()->value(),
				'alignment' => (string)$item->alignment()->value(),
				'caption' => (string)$item->caption()->html(),
				'margin'	 => (string)$item->margin()->value(),
				'hideInHomepage' => (bool)$item->hideinhomepage()->bool(),
				'images' 	=> $images_json,
			);

			array_push($content_json, $item_json);
		}

		$story_json = array(
			'title'		=> (string)$story->title()->html(),
			'subtitle'	=> ($story->subtitle()->exists() ? (string)$story->subtitle()->html() : null),
			'slug'		=> (string)$story->slug(),
			'background'=> (string)$story->background()->html(),
			'items'		=> $content_json,
		);

		$json[(string)$story->slug()] = $story_json;
	}

	echo json_encode($json);
?>