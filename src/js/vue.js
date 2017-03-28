new Vue({
    el: '#app',
    data: {
        badges: [],
        json: {url: '', result: ''},
        extensions: {},
        extensionName: '',
        validName: false,
        methods: ["total", "last-version", "week", "day"],
        status: 'loading',
    },
    methods: {
        /**
         * Update the badges displayed on the page
         */
        updateBadges: function () {
            this.badges = [];
            for (let method of this.methods) {
                let imgUrl = serverUrl + '/' + this.extensionName + '/' + method + '.svg';
                this.badges.push({
                    method,
                    imgUrl,
                });
            }
            this.json = {
                url: serverUrl + '/' + this.extensionName + '/stats.json',
                result: ''
            };
        },

        /**
         * Get the input and check if it is a valid extension name
         */
        updateName: function () {
            // Retrieved with jQuery as Vue.js cannot get it right in some cases including autocomplete
            this.extensionName = $('#extension-name-input').val();
            this.validName = this.extensions.hasOwnProperty(this.extensionName);
            if (this.validName) {
                this.updateBadges();
            }
        },

        /**
         * Get the JSON-formatted stats when the 'GET JSON' button is clicked
         */
        getJsonStats: function () {
            var self = this;
            $.ajax({
                url: this.json.url,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    self.json.result = JSON.stringify(data, null, 2);
                }
            });
        }
    },

    /**
     * Called when page is loaded
     */
    created: function () {
        var self = this;
        initClipboard();

        // Get extension list from the server
        $.ajax({
            url: serverUrl + '/list.json',
            method: 'GET',
            dataType: 'json',
            tryCount: 0,
            retryLimit: 3,
            success: function (data) {
                Object.keys(data).forEach(function (key) {
                    data[key] = null
                });
                $('input.autocomplete').autocomplete({
                    data,
                    onAutocomplete: function () {
                        self.updateName();
                    }
                });
                self.extensions = data;
                self.status = 'loaded';
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
    updated: function () {
        $('.modal').modal();
        $('.tooltipped').tooltip({position: 'top', tooltip: 'Click me!'});
        console.log('update');
    }
});

function initClipboard() {
    var clipboard = new Clipboard('.clipboard');
    clipboard.on('success', function (e) {
        Materialize.toast('Copied to clipboard', 4000);
        e.clearSelection();
    });
    clipboard.on('error', function (e) {
        Materialize.toast('Cannot copy to clipboard :(', 4000);
    });
}

