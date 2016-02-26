/* */ 
"format cjs";
({
  number: function(text, render) {
    return function(text, render) {
      return +render(text);
    }
  }
})
