// entry point
(function() {
    window.cdb = {};
    window.cdb.config = {};
    window.cdb.core = {};
    window.cdb.geo = {};

    cdb.files = [
        "../vendor/jquery.min.js",
        "../vendor/underscore-min.js",
        "../vendor/backbone-min.js",

        "../vendor/leaflet.js",

        'core/config.js',
        'core/log.js',
        'core/view.js',

        'geo/map.js'
    ];

    /**
     * load all the javascript files. For testing, do not use in production
     */
    cdb.load = function(prefix, ready) {
        var c = 0;

        var next = function() {
            var script = document.createElement('script');
            script.src = prefix + cdb.files[c];
            document.body.appendChild(script);
            ++c;
            if(c == cdb.files.length) {
                if(ready) {
                    script.onload = ready;
                }
            } else {
                script.onload = next;
            }
        };

        next();

    };
})();