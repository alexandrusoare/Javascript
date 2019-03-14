    const data={
      email : "t1@gmail.com"}

    fetch('https://internship-2019.herokuapp.com/api-user-get',
    {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body:  JSON.stringify(data),
    }).then(console.log("data")).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    })
  