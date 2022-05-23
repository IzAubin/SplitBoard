exports.getEquipement = ( req,res,next) => {
  res.render("equipement", {});
}

exports.getAccessoire = (req, res,next) => {
  res.render("accessoires");
}

exports.commentCaFonctionne = (req, res,next) => {
  res.render("fonctionnement");
}