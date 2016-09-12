<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0">

  <title><?php echo $site->title()->html(); ?></title>
  <meta name="description" content="<?php echo $site->description()->html(); ?>">
  <meta name="keywords" content="<?php echo $site->keywords()->html(); ?>">
  <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville" rel="stylesheet">

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