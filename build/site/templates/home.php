<?php snippet('header') ?>

<?php

$showstoppersDesktop = array();
$showstoppersMobile = array();

$dt = $site->files()->filter(function($file) {
	return preg_match('/desktop_[1-9].jpg/', $file->filename());
});
foreach ($dt as $file) {
	array_push($showstoppersDesktop, (string)$file->url());
}

$mob = $site->files()->filter(function($file) {
	return preg_match('/mobile_[1-9].jpg/', $file->filename());
});
foreach ($mob as $file) {
	array_push($showstoppersMobile, (string)$file->url());
}



$site_json = array(
	'title' => (string)$site->title(),
	'description'  => (string)$site->description(),
	'keywords'  => (string)$site->description(),
	'copyright'  => (string)$site->description(),
	'showstopperDesktop' => $showstoppersDesktop,
	'showstopperMobile' => $showstoppersMobile,
);



$site_data = json_encode($site_json);


?>

<script type='text/javascript'>
	window.site = <?php echo $site_data ?>;
	window.initSlug = '<?php echo $init_data['slug'] ?>';
	window.stories = <?php echo $init_data['stories'] ?>;
	window.about = <?php echo $init_data['about'] ?>;
</script>

<?php snippet('footer') ?>
