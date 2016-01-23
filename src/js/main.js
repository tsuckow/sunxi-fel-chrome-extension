chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('ui.html', {
    'id': 'sunxi',
    //Without min/max you can still "maximize" the window despite not resizeable
    'innerBounds': {
      'minWidth': 500,
      'minHeight': 225,
      'maxWidth': 500,
      'maxHeight': 225,
      'width': 500,
      'height': 225
    },
    'resizable': false,
    /*'frame': {
      'color':'#343'
    }*/
  });
});

