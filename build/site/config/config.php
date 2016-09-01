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

c::set('license', 'put your license key here');
c::set('panel.install', true);

/*

---------------------------------------
Kirby Configuration
---------------------------------------

By default you don't have to configure anything to
make Kirby work. For more fine-grained configuration
of the system, please check out http://getkirby.com/docs/advanced/options

*/


c::set('routes', array(
  array(
    'pattern' => array('(:any)', '/'),
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
