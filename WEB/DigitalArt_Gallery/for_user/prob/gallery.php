<?php

function log_exhibition($message) {
    file_put_contents('/tmp/gallery.log', date('[Y-m-d H:i:s] ') . $message . "\n", FILE_APPEND);
}

function showcase_artwork($title) {
    echo "Showcasing: {$title}\n";
}

class ArtworkManager {
    public $action = 'showcase_artwork';
    public $title = 'Digital Dreams';
    public $artist = 'Anonymous';
    public $curated = false;
    
    function __construct($title = null, $artist = null) {
        if ($title) $this->title = $title;
        if ($artist) $this->artist = $artist;
    }
    
    function __destruct() {
        if ($this->curated && function_exists($this->action)) {
            call_user_func($this->action, $this->title);
        }
    }
    
    function display() {
        return "'{$this->title}' by {$this->artist}";
    }
}

class ExhibitionCurator {
    public $command = 'log_exhibition';
    public $message = 'New artwork added to gallery';
    public $special_access = false;
    
    function __destruct() {
        if ($this->special_access) {
            if (function_exists($this->command)) {
                call_user_func($this->command, $this->message);
            }
        }
    }
    
    function analyze_artwork($filename) {
        return "Analyzing digital art: " . basename($filename);
    }
}

class GalleryUtils {
    public static function get_featured_artworks() {
        return [
            'digital_sunset.gif' => 'Digital Sunset by Maya Chen',
            'neon_city.gif' => 'Neon City by Alex Kim', 
            'abstract_flow.gif' => 'Abstract Flow by Jordan Lee'
        ];
    }
    
    public static function validate_artwork($filename) {
        $allowed_extensions = ['gif'];
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        return in_array($extension, $allowed_extensions);
    }
}

class Exhibition {
    private $artworks = [];
    
    function add_artwork($artwork) {
        $this->artworks[] = $artwork;
    }
    
    function get_artwork_count() {
        return count($this->artworks);
    }
}
?>
