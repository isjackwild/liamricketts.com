<?php snippet('header') ?>

<?php

$site_json = array(
	'title' => (string)$site->title(),
	'description'  => (string)$site->description(),
	'keywords'  => (string)$site->description(),
	'copyright'  => (string)$site->description(),
	'instagram'  => (string)$site->instagram(),
	'facebook'  => (string)$site->facebook(),
	'showstopperDesktop' => ($site->file('desktop.jpg') ? (string)$site->file('desktop.jpg')->url() : null),
	'showstopperMobile' => ($site->file('mobile.jpg') ? (string)$site->file('mobile.jpg')->url() : null),
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
