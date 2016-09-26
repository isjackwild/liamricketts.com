<?php

/*

---------------------------------------
License Setup
---------------------------------------

Please add your license key, which you've received
via email after purchasing Kirby on http://getkirby.com/buy

It is not permitted to run a public website without a
valid license key. Please read the End User License Agreement
for more information: http://getkirby.com/license

*/

c::set('license', 'K2-PERSONAL-b2093ae70268a38d9cc12b1a6d8e5f79');
c::set('panel.install', true);

/*

---------------------------------------
Kirby Configuration
---------------------------------------

By default you don't have to configure anything to
make Kirby work. For more fine-grained configuration
of the system, please check out http://getkirby.com/docs/advanced/options

*/


c::set('cache', true);
c::set('cache.ignore', array(
  'about',
  'stories',
));


c::set('routes', array(
  array(
    'pattern' => array('(:any)', '(:all)/(:all)', '/'),
    'action'  => function($slug = false) {
      
      $about = page('about');
      $stories = page('stories');

      $data = array();
      $data['init_data'] = array(
        'about' => static::render($about),
        'stories' => static::render($stories),
        'slug' => $slug,
      );

      return array('home', $data);
    }
  ),
));

c::set('autopublish.templates', array('story', 'image', 'gif'));

kirby()->hook('panel.file.upload', function($file) {
  if ($file->type() == 'image' && $file->page()->intendedTemplate() === 'image') {
    $file->rename('fullsize');

    $image = new ImageConverter($file, array(
      'width' => 2000,
      'height' => 2000,
      'upscale' => false,
      'quality' => 80,
      'filename' => 'large.{extension}',
    ));
    $image->process();

    $image = new ImageConverter($file, array(
      'width' => 900,
      'height' => 900,
      'upscale' => false,
      'quality' => 80,
      'filename' => 'medium.{extension}',
    ));
    $image->process();

    $image = new ImageConverter($file, array(
      'width' => 400,
      'height' => 400,
      'upscale' => false,
      'quality' => 80,
      'filename' => 'small.{extension}',
    ));
    $image->process();
  }
});