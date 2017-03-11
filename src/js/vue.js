new Vue({
    el: '#app',
    data: {
        badges: [],
        extensions: {},
        extensionName: '',
        validName: false,
        methods: ["total", "last-version", "week", "day"],
    },
    methods: {
        updateBadges: function () {
            this.badges = [];
            for (let method of this.methods) {
                let imgUrl = serverUrl + '/' + this.extensionName + '/' + method + '.svg';

                this.badges.push({
                    method,
                    imgUrl,
                });
            }
        },

        updateName: function () {
            this.extensionName = $('#extension-name-input').val();
            this.validName = this.extensions.hasOwnProperty(this.extensionName);
            if (this.validName) {
                this.updateBadges();
            }
        }
    },
    created: function () {
        var self = this;
        $('.badges').removeClass('hide');

        var clipboard = new Clipboard('.clipboard');

        clipboard.on('success', function (e) {
            Materialize.toast('Copied to clipboard', 4000);
            e.clearSelection();
        });

        clipboard.on('error', function (e) {
            Materialize.toast('Cannot copy to clipboard :(', 4000);
        });

        $.ajax({
            url: serverUrl + '/list.json',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                Object.keys(data).forEach(function (key) {
                    data[key] = null
                });
                $('input.autocomplete').autocomplete({
                    data,
                    onAutocomplete: function (t) {
                        self.updateName();
                    },
                    // limit: 5,
                });
                self.extensions = data;
            },
            error: function () {
                //TODO
                alert('ERROR');
            }

        });
    },
    updated: function () {
        $('.modal').modal();
        $('.tooltipped').tooltip({position: 'top', tooltip: 'Click me!'});
        console.log('update');
    }
});



