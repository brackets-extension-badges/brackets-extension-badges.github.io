(function ($) {
    $(document).ready(function () {

        /**************************
         * Auto complete plugin  *
         *************************/
        $.fn.autocomplete = function (options) {
            // Defaults
            var defaults = {
                data: {},
                limit: Infinity,
                onAutocomplete: null,
                minLength: 1
            };

            options = $.extend(defaults, options);

            return this.each(function () {
                var $input = $(this);
                var data = options.data,
                    count = 0,
                    activeIndex = -1,
                    oldVal,
                    $inputDiv = $input.closest('.input-field'); // Div to append on

                // Check if data isn't empty
                if (!$.isEmptyObject(data)) {
                    var $autocomplete = $('<ul class="autocomplete-content dropdown-content"></ul>');
                    var $oldAutocomplete;

                    // Append autocomplete element.
                    // Prevent double structure init.
                    if ($inputDiv.length) {
                        $oldAutocomplete = $inputDiv.children('.autocomplete-content.dropdown-content').first();
                        if (!$oldAutocomplete.length) {
                            $inputDiv.append($autocomplete); // Set ul in body
                        }
                    } else {
                        $oldAutocomplete = $input.next('.autocomplete-content.dropdown-content');
                        if (!$oldAutocomplete.length) {
                            $input.after($autocomplete);
                        }
                    }
                    if ($oldAutocomplete.length) {
                        $autocomplete = $oldAutocomplete;
                    }

                    // Highlight partial match.
                    var highlight = function (string, $el) {
                        var img = $el.find('img');
                        var matchStart = $el.text().toLowerCase().indexOf("" + string.toLowerCase() + ""),
                            matchEnd = matchStart + string.length - 1,
                            beforeMatch = $el.text().slice(0, matchStart),
                            matchText = $el.text().slice(matchStart, matchEnd + 1),
                            afterMatch = $el.text().slice(matchEnd + 1);
                        $el.html("<span>" + beforeMatch + "<span class='highlight'>" + matchText + "</span>" + afterMatch + "</span>");
                        if (img.length) {
                            $el.prepend(img);
                        }
                    };

                    // Reset current element position
                    var resetCurrentElement = function () {
                        activeIndex = -1;
                        $autocomplete.find('.active').removeClass('active');
                    }

                    // Remove autocomplete elements
                    var removeAutocomplete = function () {
                        $autocomplete.empty();
                        resetCurrentElement();
                        oldVal = undefined;
                    };

                    $input.off('blur.autocomplete').on('blur.autocomplete', function () {
                        removeAutocomplete();
                    });

                    // Perform search
                    $input.off('keyup.autocomplete focus.autocomplete').on('keyup.autocomplete focus.autocomplete', function (e) {
                        // Reset count.
                        count = 0;
                        var val = $input.val().toLowerCase();

                        // Don't capture enter or arrow key usage.
                        if (e.which === 13 ||
                            e.which === 38 ||
                            e.which === 40) {
                            return;
                        }


                        // Check if the input isn't empty
                        if (oldVal !== val) {
                            removeAutocomplete();

                            if (val.length >= options.minLength) {
                                for (var key in data) {
                                    if (data.hasOwnProperty(key) &&
                                        key.toLowerCase().indexOf(val) !== -1 /*&&
                                     key.toLowerCase() !== val*/) {
                                        // Break if past limit
                                        if (count >= options.limit) {
                                            break;
                                        }

                                        var autocompleteOption = $('<li></li>');
                                        if (!!data[key]) {
                                            autocompleteOption.append('<img src="' + data[key] + '" class="right circle"><span>' + key + '</span>');
                                        } else {
                                            autocompleteOption.append('<span>' + key + '</span>');
                                        }

                                        $autocomplete.append(autocompleteOption);
                                        highlight(val, autocompleteOption);
                                        count++;
                                    }
                                }
                            }
                        }

                        // Update oldVal
                        oldVal = val;
                    });

                    $input.off('keydown.autocomplete').on('keydown.autocomplete', function (e) {
                        // Arrow keys and enter key usage
                        var keyCode = e.which,
                            liElement,
                            numItems = $autocomplete.children('li').length,
                            $active = $autocomplete.children('.active').first();

                        // select element on Enter
                        if (keyCode === 13 && activeIndex >= 0) {
                            liElement = $autocomplete.children('li').eq(activeIndex);
                            if (liElement.length) {
                                liElement.trigger('mousedown.autocomplete');
                                e.preventDefault();
                            }
                            return;
                        }

                        // Capture up and down key
                        if (keyCode === 38 || keyCode === 40) {
                            e.preventDefault();

                            if (keyCode === 38 &&
                                activeIndex > 0) {
                                activeIndex--;
                            }

                            if (keyCode === 40 &&
                                activeIndex < (numItems - 1)) {
                                activeIndex++;
                            }

                            $active.removeClass('active');
                            if (activeIndex >= 0) {
                                $autocomplete.children('li').eq(activeIndex).addClass('active');
                            }
                        }
                    });

                    // Set input value
                    $autocomplete.on('mousedown.autocomplete touchstart.autocomplete', 'li', function () {
                        var text = $(this).text().trim();
                        $input.val(text);
                        $input.trigger('change');
                        removeAutocomplete();

                        // Handle onAutocomplete callback.
                        if (typeof(options.onAutocomplete) === "function") {
                            options.onAutocomplete.call(this, text);
                        }
                    });
                }
            });
        };

    }); // End of $(document).ready

}(jQuery));