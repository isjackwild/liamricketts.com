<?php
	$links = $page->links()->toStructure();
	$links_json = array();
	foreach ($links as $link) {
		$link_json = array(
			'label' => (string)$link->label()->html(),
			'url' => (string)$link->url()->toUrl(),
		);
		array_push($links_json, $link_json);
	}

	$contact_options = $page->contact()->toStructure();
	$contact_json = array();
	foreach ($contact_options as $option) {
		$option_json = array(
			'entry' => (string)$option->entry()->html(),
			'url' => (string)$option->url()->toUrl(),
		);
		array_push($contact_json, $option_json);
	}

	$json = array(
		'about' => (string)$page->about()->kirbytext(),
		'address' => (string)$page->address()->kirbytext(),
		'links' => $links_json,
		'contact' => $contact_json,
	);

	echo json_encode($json);
?>