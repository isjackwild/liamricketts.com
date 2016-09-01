<?php
	$links = $page->links()->toStructure();
	$links_json = array();

	foreach ($links as $link) {
		$link_json = array(
			'label' => (string)$link->label()->html(),
			'link' => (string)$link->url()->toUrl(),
		);
		array_push($links_json, $link_json);
	}

	$json = array(
		'about' => (string)$page->about()->html(),
		'links' => $links_json,
	);

	echo json_encode($json);
?>