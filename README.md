# knockout-autocomplete
Knockout component for autocomplete search.

Dependencies: jQuery, Knockoutjs

Please refer to the index.html to see the simple use case.

Below is using the auto complete component:
 <ko-autocomplete params="dataSource: data, onResultSelected: resultSelected, displayKey: 'name', searchKey: 'name', searchText: searchText, textBoxCssClass: 'form-control'"></ko-autocomplete>
 
 Parameters:
 
 dataSource - This represents a javascript array of the data you want the auto complete to search.
 
 dataSourceUrl - This represents a GET endpoint to send the search string to that returns search matches. Ex. dataSourceUrl: '/states?q=' The search string will be appended to this url and sent to the server via an ajax GET call.
 
 Typically you will use either the dataSource or the dataSourceUrl as it doesn't make sense to need both.
 
 onResultSelected - This is a javascript function to call when a result from the search results is selected. The object from the array that was selected will be passed to this method.
 
 displayKey - This is the key from the dataSource array to display when returning matched results.
 
 searchKey (Only used with a dataSource, not a dataSourceUrl) - This is the key from the dataSource array to use for searching.
 
 searchText - This represents the search text box observable from your viewModel.
 
 textBoxCssClass - This is an optional parameter to add a class to the search text box from the component.
