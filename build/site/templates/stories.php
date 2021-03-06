<?php

	$stories = $page->children();
	$json = array();

	foreach ($stories as $story) {
		$content = $story->children()->visible();
		$content_json = array();

		foreach ($content as $item) {
			$files = $item->files();
			$type = $item->intendedTemplate();

			if ($type === 'image') {
				$large = $files->find('large.jpg');
				$medium = $files->find('medium.jpg');
				$small = $files->find('small.jpg');
			} else {
				$large = $files->first();
				$medium = $files->first();
				$small = $files->first();
			}

			$fullWidth = ($large ? $large->dimensions()->width() : 0);
			$fullHeight = ($large ? $large->dimensions()->height() : 0);
			$aR = ($large ? ($fullHeight / $fullWidth) : null);

			$images_json = array(
				'large' => ($large ? (string)$large->url() : null),
				'medium' => ($medium ? (string)$medium->url() : null),
				'small' => ($small ? (string)$small->url() : null),
				'aspectRatio' => (float)$aR,
				'fullWidth' => (float)$fullWidth,
				'fullHeight' => (float)$fullHeight,
			);

			$item_json = array(
				'type' => (string)$type,
				'size' 		=> (string)$item->size()->value(),
				'alignment' => (string)$item->alignment()->value(),
				'caption' => (string)$item->caption()->html(),
				'margin'	 => (string)$item->margin()->value(),
				'hideInHomepage' => ($type === "gif" ? false : (bool)$item->hideinhomepage()->bool()),
				'images' 	=> $images_json,
			);

			array_push($content_json, $item_json);
		}

		$story_json = array(
			'title'		=> (string)$story->title()->html(),
			'subtitle'	=> ($story->subtitle()->exists() ? (string)$story->subtitle()->kt() : null),
			'hidden'	=> !(bool)$story->isVisible(),
			'metadata'	=> (string)$story->metadata()->html(),
			'slug'		=> (string)$story->slug(),
			'background'=> (string)$story->background()->html(),
			'items'		=> $content_json,
			'next'		=> ($story->nextVisible() ? (string)$story->nextVisible()->slug() : (string)$stories->first()->slug()),
		);

		$json[(string)$story->slug()] = $story_json;
	}

	echo json_encode($json);
?>