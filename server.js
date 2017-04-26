var express         = require('express'),
    server          = express(),
    mongoose        = require('mongoose'),
    Schema          = mongoose.Schema,
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    MONGOURI        = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
    PORT            = process.env.PORT || 3000,
    dbname          = "sharing_is_caring";

var experienceSchema = new Schema({
  location: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  comments: [{
    name: String,
    reaction: String
  }]
}, {collection: 'Experience', strict: true});
var Experience = mongoose.model(null, experienceSchema);

mongoose.connect(MONGOURI + '/' + dbname);

server.use(express.static('public'));
server.use(bodyParser.urlencoded({
  extended: true
}));
server.use(bodyParser.json());
server.use(methodOverride('_method'));

server.use(function (req, res, next) {
  console.log("req.body", req.body);
  console.log("req.params", req.params);

  next();
});

server.get('/experiences', function (req, res) {
  Experience.find({}, function (error, experiences) {
    if (error) {
      console.log("error", error);
    } else {
      res.json({
        experiences: experiences
      });
    }
  })
});

server.post('/experiences', function (req, res) {
  var newExperience = new Experience(req.body.experience);

  newExperience.save(function (error, experience) {
    if (error) {
      console.log("error", error);
    } else {
      res.json({
        experience: experience
      });
    }
  });
});

server.patch('/experiences/:id', function (req, res) {
  Experience.findByIdAndUpdate(req.params.id, req.body.experience, function (error, experience) {
    if (error) {
      console.log("error", error);
    } else {
      res.json({
        experience: experience
      });
    }
  });
});

server.delete('/experiences/:id', function (req, res) {
  Experience.findByIdAndRemove(req.params.id, function (error, experience) {
    if (error) {
      console.log("error", error);
    } else {
      res.json({
        message: "removed"
      });
    }
  });
});

server.listen(PORT, function() {
  console.log("server running...");
});
