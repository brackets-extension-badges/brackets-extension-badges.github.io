'use strict';

new Vue({
    el: 'main',
    data: {
        badges: [],
        json: {url: '', result: '', data: {}},
        extensions: {},
        extensionName: '',
        validName: false,
        ranking: '',
        methods: ['total', 'last-version', 'week', 'day'],
        status: 'loading',
    },
    methods: {

        /**
         * Update the badges displayed on the page
         */
        updateBadges: function () {
            this.badges = [];
            for (var method of this.methods) {
                var imgUrl = serverUrl + '/' + this.extensionName + '/' + method + '.svg';
                this.badges.push({
                    method: method,
                    imgUrl: imgUrl,
                });
            }
            this.json.url = serverUrl + '/' + this.extensionName + '/stats.json';

            // Manage modals
            Vue.nextTick(function () {
                $('.modal').modal();
            });
        },

        /**
         * Get the input and check if it is a valid extension name
         */
        updateName: function () {
            // Retrieved with jQuery as Vue.js cannot get it right in some cases including autocomplete
            this.extensionName = $('#extension-name-input').val();
            this.validName = this.extensions.hasOwnProperty(this.extensionName);
            if (!this.validName) {
                return;
            }
            this.updateBadges();
            this.getJsonStats();
            this.updateRanking();

            // Edit URL
            location.hash = this.extensionName;
        },

        /**
         * Get the JSON-formatted stats
         */
        getJsonStats: function () {
            if (this.json.data.name === this.extensionName) {
                return
            }

            var self = this;
            $.ajax({
                url: this.json.url + '?do_not_track',
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    self.json.result = JSON.stringify(data, null, 2);
                    self.json.data = data;
                }
            });
        },

        /**
         * Compute the extension's popularity ranking
         */
        updateRanking: function () {
            var higher = 0,
                lower = 0,
                current = this.extensions[this.extensionName];

            for (var extension in this.extensions) {
                if (!this.extensions.hasOwnProperty(extension)) {
                    continue;
                }
                if (this.extensions[extension] < current) {
                    lower++;
                } else {
                    higher++;
                }
            }

            this.ranking = Math.ceil(100 * higher / (lower + higher));
        },

        /**
         * Get the URL of to share
         */
        getLink: function () {
            return 'https://brackets-extension-badges.github.io#' + this.extensionName;
        },

        /**
         * Format a number with numeral
         * @param number
         */
        format: function (number) {
            return numeral(number).format('0,0');
        }
    },

    /**
     * Called when page is loaded
     */
    created: function () {
        var self = this,
            hash = window.location.hash.replace('#', '');

        // Auto fill input
        if (hash !== '') {
            this.extensionName = hash;
        }

        initClipboard();

        // Get extension list from the server
        $.ajax({
            url: serverUrl + '/list.json?do_not_track',
            method: 'GET',
            dataType: 'json',
            tryCount: 0,
            retryLimit: 3,
            success: function (data) {
                Object.keys(data).forEach(function (key) {
                    self.extensions[key] = data[key];
                    data[key] = null;
                });
                $('input.autocomplete').autocomplete({
                    data,
                    onAutocomplete: function () {
                        self.updateName();
                    }
                });
                // self.extensions = data;
                self.status = 'loaded';
                self.updateName();
            },
            error: function () {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    $.ajax(this);
                } else {
                    self.status = 'error';
                }
            }
        });
    },
});

function initClipboard() {
    var clipboard = new Clipboard('.clipboard');
    clipboard.on('success', function () {
        Materialize.toast('Copied to clipboard', 1500);
    });
    clipboard.on('error', function () {
        Materialize.toast('Cannot copy to clipboard :(', 1500);
    });
}
