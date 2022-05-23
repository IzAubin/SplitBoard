exports.getHomepage = (req, res, next) => {
  res.render("accueil", {});
};

exports.getIndex = (req, res, next) => {
  res.render("index", {});
};
