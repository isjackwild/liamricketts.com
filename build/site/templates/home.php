<!-- This is in site/snippets/header.php. It's there the Meta tags, opening body tags, etc are included, which you may need to edit. -->
<?php snippet('header') ?>

<?php

// These are the menu links, which the client can add in the CMS. They can add (optional) external links. URL + Text. Any internal links are hard-coded
$links = $site->externalmenulinks()->toStructure();
$links_arr = array();

foreach ($links as $link) {
	$arr = array(
		'label' => (string)$link->label(),
		'url' => (string)$link->externalurl()->url(),
	);
	array_push($links_arr, $arr);
}

// The SiteJson is any site-wide data — for example menulinks, metadata and about overlay page.
$siteJson = array(
	'title' => (string)$site->title(),
	'description'  => (string)$site->description(),
	'keywords'  => (string)$site->description(),
	'copyright'  => (string)$site->description(),
	'instagram'  => (string)$site->instagram(),
	'facebook'  => (string)$site->facebook(),
	'defaultcollection'  => (string)$site->defaultcollection(), // The starting collection (if not arriving from a deep-link) which they can specify in the CMS
	'menulinks' => $links_arr,
);

$siteData = json_encode($siteJson);


// Init page data are rendered in the routes definition (in config.php), as you cannot static::render() a page inside a template.

?>

<script type='text/javascript'>
	window.siteData = <?php echo $siteData ?>; // The initial Site Data.
	window.tourDates = <?php echo $initData['dates'] ?>; // The tour dates (this is rendered in the routes (defined in config/config.php), and passed into this template)
	window.initCollectionSlug = '<?php echo $initData['slug'] ?>'; // The start collection slug (passed into this template from the routes)
	window.initCollection = <?php echo $initData['collection'] ?>; // The start collection (this is rendered in the routes (defined in config/config.php), and passed into this template)
</script>

<!-- This is in site/snippets/footer.php. It's there the CSS and JS and closing tags are included, which you may need to edit. -->
<?php snippet('footer') ?>
