/**
 * Script for recursively searching the window object 
 * for a string value. 
 */
;(function( win, str, count ){

  var 
    winCollection = [],
    min = 5,
    depth = 1,
    top = (!! count && count > min) ? count : min,
    winStrings = [],
    found = [],
    skip = [
      'self',
      'window',
      'document',
      'parent',
      'chrome',
      'jQuery',
      'external',
      '$',
      'angular',
      'd3',
      'enabledPlugin',
      'top',
      'proto',
      '__proto__',
      'navigator',
      'frames',
      'location'
    ],
    remainder = []
  ;

  function WinObj(name, depth, obj) {
    this.depth = depth;
    this.name = name;
    this.value = obj;
    this.path = null;
  }

  function reducer ( depth, iterator, next ) {
    var 
      enumerate = next.value || next, 
      p, 
      obj, 
      depth = depth || 1
    ;

    for( p in enumerate ) {

      if( enumerate.hasOwnProperty(p) 
        && enumerate.propertyIsEnumerable(p) 
        && typeof enumerate[p] !== 'function' 
        && !! enumerate[p]
        && Object.keys(enumerate[p]).length
        && skip.indexOf(p) < 0 ) {

          obj = new WinObj(p, depth, enumerate[p] );
          obj.path = ( !! next.path ) ? next.path + '.' + p : 'window.' + p;
          if( typeof enumerate[p] === 'string') {
            winStrings.push( obj );
            if( obj.value === str ) {
              found.push({ path: obj.path, value: obj.value, depth: obj.depth });
            }
          }
          else {
            ( !! iterator )
              ? iterator.push( obj ) 
              : winCollection.push(obj)
            ;
          }       
      }
    }
    if( !! iterator ) return iterator;   
  }

  depth++;
  reducer(depth, null, win);

  depth++;
  remainder = winCollection.reduce(reducer.bind(null, depth), []);

  do {
    depth++;
    remainder = remainder.reduce(reducer.bind(null, depth), []);
  }
  while( remainder.length > 0 && depth < top );

  if( count < min ) console.log('NB: minimum levels to check is: ' + min);

  if( found.length ) {
    found.forEach(function(d, i){
      console.log( 'SUCCESS:' + (i + 1) + ' (found on level ' + d.depth + ' of ' + top + ' levels checked)');
      console.log( d.path + ' -> ' + d.value );
    });
  }
  else {
    console.log( 'NOTHING FOUND FOR: ' + str + ' ' + top + ' levels checked)');
  }
}(window, "LG", 8));
