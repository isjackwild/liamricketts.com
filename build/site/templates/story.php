<?php

	$children = $page->children();
	$content = array();

	foreach ($children as $child) {
		$files = $child->files();

		$images = $files->filter(function($file) {
			$ext = $file->extension();
			return $ext == 'jpg' || $ext == 'png' || $ext == 'gif';
		});

		$videos = $files->filter(function($file) {
			$ext = $file->extension();
			return $ext == 'mp4';
		});


		$type 			= (string)$child->intendedTemplate(); // All
		$title 			= (string)$child->title()->html(); // All
		$text 			= ($child->text()->exists() ? (string)$child->text()->html() : null); // only Text
		$description 	= ($child->description()->exists() ? (string)$child->description()->html() : null); // only Shop
		$comment 		= ($child->comment()->exists() ? (string)$child->comment()->html() : null); // only Instagram
		$username 		= ($child->username()->exists() ? (string)$child->username()->html() : null); // only Instagram
		$profilelink 	= ($child->profilelink()->exists() ? (string)$child->profilelink()->toURL() : null); // only Instagram
		$credit 		= ($child->credit()->exists() ? (string)$child->credit()->html() : null); // Photo & Video Loop
		$link 			= ($child->link()->exists() ? (string)$child->link()->toURL() : null); // Shop & Instagram
		$size 			= ($child->size()->exists() ? (string)$child->size()->value() : null); // Text & Image
		$heavyrotation 	= (bool)$child->heavyrotation()->bool(); // All
		$includeininit 	= (bool)$child->includeininit()->bool(); // All
		$image			= ($images->first() ? (string)$images->first()->url() : null);
		$videoloop		= ($videos->first() ? (string)$videos->first()->url() : null);
		$videohd		= ($child->sourcehd()->exists() ? (string)$child->sourcehd()->toURL() : null); // Video Portal
		$videosd		= ($child->sourcesd()->exists() ? (string)$child->sourcesd()->toURL() : null); // Video Portal

		$child_data = array(
			'type' => $type,
			'title' => $title,
			'text' => $text,
			'description' => $description,
			'comment' => $comment,
			'username' => $username,
			'profileLink' => $profilelink,
			'credit' => $credit,
			'link' => $link,
			'size' => $size,
			'heavyRotation' => $heavyrotation,
			'includeInInit' => $includeininit,
			'image' => $image,
			'videoLoop' => $videoloop,
			'videoHD' => $videohd,
			'videoSD' => $videosd,
		);
		
		array_push($content, $child_data);
	}

	$json = array(
		'title' => (string)$page->title()->html(),
		'description' => ($page->description()->exists() ? (string)$page->description()->html() : null),
		'description' => ($page->description()->exists() ? (string)$page->description()->html() : null),
		'showtitle' => (bool)$page->showtitle()->bool(),
		'showdescription' => (bool)$page->showdescription()->bool(),
		'theme' => (string)$page->theme()->value(),
		'content' => $content,
	);

	echo json_encode($json);

?>