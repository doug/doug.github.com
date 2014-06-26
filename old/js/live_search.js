jQuery.fn.liveUpdate = function(items){
    var rows = items,
      cache = rows.map(function(){
        return $(this).find('.index').text().toLowerCase();
      });
      
    this
      .keyup(filter).keyup()
      .parents('form').submit(function(){
        return false;
      });
    
  return this;
    
  function filter(){
    var term = jQuery.trim( jQuery(this).val().toLowerCase() ), scores = [];
    
    if ( !term ) {
      rows.fadeTo(0,1);
    } else {
      cache.each(function(i){
        var score = this.score(term) + 0.3;
        jQuery(rows[ i ]).fadeTo(0,score);
      });
    }
  }
};