var app = angular.module("ShareCare", []);

app.controller('SharingController', ['$http', function ($http) {
  var ctrl = this;

  this.getExperiences = function() {
    $http.get('/experiences')
    .then(function (success) {
      // console.log(success.data);
      ctrl.experiences = success.data.experiences;
    }, function (err) {
      console.log("error", err);
    });
  };

  this.createExperience = function() {
    $http.post('/experiences', {
      experience: ctrl.newExperience
    }).then(function (success) {
      ctrl.experiences.push(success.data.experience);
      ctrl.newExperience.location = ""
      ctrl.newExperience.description = ""
    }, function (err) {
      console.log("error", err);
    });
  };

  this.updateExperience = function() {
    $http.patch('/experiences/' + ctrl.currentExperience._id, {
      experience: ctrl.currentExperience
    }).then(function (success) {
      delete ctrl.currentExperience;
    }, function (err) {
      console.log("error", err);
    });
  };

  this.deleteExperience = function (experience) {
    $http.delete('/experiences/' + experience._id)
    .then(function (success) {
      var i = ctrl.experiences.indexOf(experience);
      ctrl.experiences.splice(i, 1);
    }, function (err) {
      console.log("error", err);
    });
  };

  this.addCommentToExperience = function (experience) {
    experience.newComment.name = experience.newComment.name || "anonymous";

    experience.comments.push(experience.newComment);

    $http.patch('/experiences/' + experience._id, {
      experience: experience
    }).then(function (success) {
      experience.newComment = {};
      console.log(success);
    }, function (err) {
      console.log("error", err);
    });
  };

  this.getExperiences();
}]);
