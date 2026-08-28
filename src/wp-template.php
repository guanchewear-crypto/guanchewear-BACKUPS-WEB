<?php
/**
 * Template Name: GuancheWear Landing
 * Template Post Type: page
 *
 * Copy this file to the active theme and copy dist/ alongside it.
 */

defined('ABSPATH') || exit;

// This template renders the React mount point directly; never run wpautop on it.
remove_filter('the_content', 'wpautop');
remove_filter('the_excerpt', 'wpautop');

$gw_dist_dir = trailingslashit(get_stylesheet_directory()) . 'dist/assets';
$gw_dist_uri = trailingslashit(get_stylesheet_directory_uri()) . 'dist/assets';
$gw_css_files = glob($gw_dist_dir . '/index-*.css') ?: array();
$gw_js_files  = glob($gw_dist_dir . '/index-*.js') ?: array();
$gw_module_handles = array();

foreach ($gw_css_files as $gw_css_file) {
    wp_enqueue_style(
        'guanchewear-landing-' . md5($gw_css_file),
        $gw_dist_uri . '/' . basename($gw_css_file),
        array(),
        (string) filemtime($gw_css_file)
    );
}

foreach ($gw_js_files as $gw_js_file) {
    $gw_handle = 'guanchewear-landing-' . md5($gw_js_file);
    wp_enqueue_script(
        $gw_handle,
        $gw_dist_uri . '/' . basename($gw_js_file),
        array(),
        (string) filemtime($gw_js_file),
        true
    );
    $gw_module_handles[] = $gw_handle;
}

// Vite's bundle is an ES module. This works across WordPress versions.
add_filter('script_loader_tag', static function ($tag, $handle) use ($gw_module_handles) {
    if (in_array($handle, $gw_module_handles, true) && strpos($tag, 'type=') === false) {
        return str_replace('<script ', '<script type="module" ', $tag);
    }
    return $tag;
}, 10, 2);
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#050505">
    <meta name="description" content="Crea una camiseta o sudadera personalizada a partir de tu idea. Diseños únicos, producción europea y envíos a toda Europa.">
    <?php wp_head(); ?>
</head>
<body <?php body_class('guanchewear-landing'); ?>>
<?php wp_body_open(); ?>
<div id="root"></div>
<?php wp_footer(); ?>
</body>
</html>
