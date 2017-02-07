var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://postgres@localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);

    db.user_create_seed(function(){
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(){
      console.log("Vehicle Table Init")
    });
})

app.get('/api/users', function(req,res) {
  db.get_users(function(err, users) {
    if(!err) {
      res.status(200).send(users);
    }
    else {
      res.status(404).send(err);
    }
  })
});

app.get('/api/vehicles', function(req, res) {
  db.get_vehicles(function(err, vehicles) {
    if(!err) {
      res.status(200).send(vehicles);
    }
    else {
      res.status(404).send(err);
    }
  })
});

app.post('/api/users', function(req, res) {
  db.add_user([req.body.firstname, req.body.lastname, req.body.email], function(err, user) {
    if(!err) {
      res.status(200).send(user);
    }
    else {
      res.status(404).send(err);
    }
  })
});
app.post('/api/vehicles', function(req, res) {
  db.add_vehicle([req.body.make, req.body.model, req.body.year, Number(req.body.ownerId)], function(err, vehicle) {
    if(!err) {
      res.status(200).send(vehicle);
    }
    else {
      res.status(404).send(err);
    }
  })
});

app.get('/api/user/:userId/vehiclecount', function(req, res) {
  db.vehicle_count([parseInt(req.params.userId)], function(err, count) {
    if(!err) {
      res.status(200).send({'count': count[0]});
    }
    else {
      res.status(404).send(err);
    }
  })
});
app.get('/api/user/:userId/vehicle', function(req,res) {
  db.get_vehicles_by_id([parseInt(req.params.userId)], function(err, vehicles) {
    if (!err) {
      res.status(200).send(vehicles);
    }
    else {
      res.status(500).send(err);
    }
  })
});
app.get('/api/vehicle/', function(req,res) {
  if(req.query.UserEmail) {
    db.get_vehicles_by_email([req.query.UserEmail], function(err, vehicles) {
      if (!err) {
        res.status(200).send(vehicles);
      }
      else {
        res.status(500).send(err);
      }
    })
  }
  else if (req.query.userFirstStart) {
    db.get_vehicles_by_owner([req.query.userFirstStart+'%'], function(err, vehicles) {
      if (!err) {
        res.status(200).send(vehicles);
      }
      else {
        res.status(404).send(err);
      }
    })
  }
  else {
    res.status(404).send();
  }
});
app.get('/api/newervehiclesbyyear', function(req, res) {
  db.newer_vehicles_by_year(function(err, vehicles) {
    if (!err) {
      res.status(200).send(vehicles);
    }
    else {
      res.status(404).send(err);
    }
  })
});

app.put('/api/vehicle/:vehicleId/user/:userId', function(req, res) {
  db.change_vehicle_owner([parseInt(req.params.vehicleId),parseInt(req.params.userId)], function(err, vehicle) {
    if (!err) {
      res.status(200).send(vehicle);
    }
    else {
      res.status(404).send(err);
    }
  })
});

app.delete('/api/user/:userId/vehicle/:vehicleId', function(req, res) {
  db.remove_owner([parseInt(req.params.userId), parseInt(req.params.vehicleId)], function(err, vehicle) {
    if(!err) {
      res.status(200).send();
    }
    else {
      res.status(404).send(err);
    }
  })
});
app.delete('/api/vehicle/:vehicleId', function(req, res) {
  db.delete_vehicle([parseInt(req.params.vehicleId)], function(err, vehicle) {
    if(!err) {
      res.status(200).send();
    }
    else {
      res.status(404).send(err);
    }
  })
})


app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
})

module.exports = app;
