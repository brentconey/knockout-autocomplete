ko.components.register('ko-autocomplete', {
    viewModel: function (params) {
        var self = this;
        self.placeHolder = ko.observable(params.placeholder || '');
        if (typeof params.onResultSelected !== "function") {
            throw new Error("onResultSelected must be a function.");
        }
        self.searchText = params.searchText;
        self.searchResults = ko.observableArray([]);
        self.resultClick = function (data, event) {
            self.searchText(data[params.displayKey]);
            $.when(params.onResultSelected(data, params.resultsSelectedParamsObj)).done(function () {
                self.searchResults.removeAll();
            });
        };

        self.search = function (data, event) {
            var newValue = self.searchText();
            var keyPressed = event.keyCode;
            if (keyPressed === 27) {
                self.searchResults.removeAll();
                self.searchText('');
                if (typeof params.onSearchFieldCleared === "function") {
                    params.onSearchFieldCleared();
                }
                return;
            }
            if ((keyPressed === 40 || keyPressed === 38) && self.searchResults().length > 0) {
                //arrow keys
                var selectedResult = ko.utils.arrayFirst(self.searchResults(), function (result) {
                    return result.selected();
                });
                if (selectedResult) {
                    var index = self.searchResults.indexOf(selectedResult);
                    var nextIndex = index;
                    if (keyPressed === 40) {
                        nextIndex = nextIndex + 1;
                    } else {
                        nextIndex = nextIndex - 1;
                    }
                    selectedResult.selected(false);
                    if (self.searchResults()[nextIndex]) {
                        self.searchResults()[nextIndex].selected(true);
                    } else {
                        if (keyPressed === 40) {
                            self.searchResults()[0].selected(true);
                        } else {
                            self.searchResults()[self.searchResults().length - 1].selected(true);
                        }
                    }
                } else {
                    if (keyPressed === 40) {
                        self.searchResults()[0].selected(true);
                    } else {
                        self.searchResults()[self.searchResults().length - 1].selected(true);
                    }
                }
            } else if (keyPressed === 13 && self.searchResults().length > 0) {
                //enter key
                var selectedResult = ko.utils.arrayFirst(self.searchResults(), function (result) {
                    return result.selected();
                });
                if (selectedResult) {
                    self.searchText(selectedResult[params.displayKey]);
                    $.when(params.onResultSelected(selectedResult, params.resultsSelectedParamsObj)).done(function () {
                        self.searchResults.removeAll();
                    });

                }
            } else {
                //other keys
                if (newValue.length >= 2) {
                    $(event.currentTarget).addClass("tt-spinner");
                    $.ajax({
                        type: "GET",
                        url: params.dataSourceUrl + newValue,
                        global: false
                    }).done(function (data) {
                        $(event.currentTarget).removeClass("tt-spinner");
                        self.searchResults.removeAll();
                        $.each(data, function (index, searchResult) {
                            searchResult.selected = ko.observable(false);
                            var displayResult = searchResult[params.displayKey];
                            var displayKeyHtml = '';
                            var indexOfSearch = displayResult.indexOf(newValue);
                            if (indexOfSearch > -1) {
                                displayKeyHtml = displayResult.replace(newValue, "<strong>" + newValue + "</strong>");
                            } else {
                                displayKeyHtml = displayResult;
                            }
                            searchResult.displayKey = ko.observable(displayKeyHtml);
                            self.searchResults.push(searchResult);
                        });
                        $(event.currentTarget).removeClass("tt-spinner");
                    }).fail(function (failObject, textStatus, errorThrown) {
                        self.searchResults.removeAll();
                        toastr.error(failObject.responseJSON);
                        $(event.currentTarget).removeClass("tt-spinner");
                    });
                }
            }
            if (newValue === "") {
                self.searchResults.removeAll();
                if (typeof params.onSearchFieldCleared === "function") {
                    params.onSearchFieldCleared();
                }
            }
            $(document).on("keyup", function (e) {
                if (e.keyCode === 27) {
                    self.searchResults.removeAll();
                }
            });
        };
    },
    template: '<div class="sl-autocomplete"><input type="text" value="" class="sl-autocomplete-input" data-bind="textinput: searchText, hasFocus: true, event: { \'keyup\' : search }, attr: { placeholder: placeHolder }" autocomplete="off" /><div class="sl-autocomplete-results-panel" data-bind="visible: searchResults().length > 0"><ul class="sl-autocomplete-results" data-bind="foreach: searchResults"><li class="sl-autocomplete-result" data-bind="click: $parent.resultClick, css: { selected: selected }"><span class="sl-autocomplete-result-text" data-bind="html: displayKey"></span></li></ul></div></div>'
});