<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0">

  <title><?php echo $site->title()->html(); ?></title>
  <meta name="description" content="<?php echo $site->description()->html(); ?>">
  <meta name="keywords" content="<?php echo $site->keywords()->html(); ?>">
  <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville" rel="stylesheet">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png">
	<link rel="icon" type="image/png" href="/assets/favicon/favicon-32x32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="/assets/favicon/favicon-16x16.png" sizes="16x16">
	<link rel="manifest" href="/assets/favicon/manifest.json">
	<link rel="mask-icon" href="/assets/favicon/safari-pinned-tab.svg" color="#ffd002">
	<link rel="shortcut icon" href="/assets/favicon/favicon.ico">
	<meta name="msapplication-config" content="/assets/favicon/browserconfig.xml">
	<meta name="theme-color" content="#ffd002">

</head>
<body>

<script type="x-shader/x-fragment" id="fragmentShaderDepth">

	#include <packing>

	uniform sampler2D texture;
	varying vec2 vUV;

	void main() {

		vec4 pixel = texture2D( texture, vUV );

		if ( pixel.a < 0.5 ) discard;

		gl_FragData[ 0 ] = packDepthToRGBA( gl_FragCoord.z );

	}
</script>

<script type="x-shader/x-vertex" id="vertexShaderDepth">

	varying vec2 vUV;

	void main() {

		vUV = 0.75 * uv;

		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

		gl_Position = projectionMatrix * mvPosition;

	}

</script>

<div id="react-root"></div>