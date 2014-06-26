var SearchBar = {
    liveUpdate : function() {
        $("#search").liveUpdate($(".item")).focus();
    }
}

$(document).ready(function() {
    $("#search_container").show();
    SearchBar.liveUpdate();
});