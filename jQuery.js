// Creating an object based off of the users input
$(document).ready(function(){
  var people = [], // Creating 'people' object array
    $ins = $('#username'),
    counter = {
      username: {}
    };
	
// Creating jQuery function for submission 
  $('#submit').click(function() {
    var person = {},
      valid = true;
    $ins.each(function() {
      var val = this.value.trim();
      if (val) {
        person[this.id] = val;
      }
    }); // If submission is valid, add a 'person' object to the 'people' array
    if (valid) {
      people.push(person);
      $ins.val('');

      // Adding a count to the 'people' array
      $.each(person, function(key, value) {
        var count = counter[key][value] || 0;
        counter[key][value] = count + 1;
      });
    }
	
	// Creating jQuery function to display the data, and stringify
	// the JS object into a JSON string
    $('#display_data').click(function() {
    $('p').text(JSON.stringify(people) );
    })
    })
  });