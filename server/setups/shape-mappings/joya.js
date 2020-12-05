const _ = require("lodash");
module.exports = function getShapes() {
  const allOfIt = _.range(0, 1350);
  const shuffle = _.shuffle(allOfIt);
  const shuffleBase = allOfIt;
  const shuffleSegments5 = _.flatten(
    _.shuffle(
      _.map(_.range(0, shuffleBase.length / 5), i =>
        shuffleBase.slice(i * 5, (i + 1) * 5)
      )
    )
  );
  const shuffleSegments10 = _.flatten(
    _.shuffle(
      _.map(_.range(0, shuffleBase.length / 10), i =>
        shuffleBase.slice(i * 10, (i + 1) * 10)
      )
    )
  );
  const shuffleSegments20 = _.flatten(
    _.shuffle(
      _.map(_.range(0, shuffleBase.length / 20), i =>
        shuffleBase.slice(i * 20, (i + 1) * 20)
      )
    )
  );
  return {
    allOfIt,
    shuffle,
    shuffleSegments5,
    shuffleSegments10,
    shuffleSegments20,
    all: allOfIt,
    Warro: allOfIt,
    WarroOnly: allOfIt,
    totemL1: allOfIt,
    totemL2: allOfIt,
    totemR1: allOfIt,
    totemR2: allOfIt,
    totemsExt: allOfIt,
    totemsInt: allOfIt,
    totems: allOfIt,
    wings: allOfIt,
    wingsLeft: allOfIt,
    wingsRight: allOfIt,
    wingsX: allOfIt,
    V1L: allOfIt,
    V1R: allOfIt,
    V2L: allOfIt,
    V2R: allOfIt,
    trianguloTop: allOfIt,
    trianguloTopLeft: allOfIt,
    trianguloTopRight: allOfIt,
    trianguloBottom: allOfIt,
    trianguloBottomLeft: allOfIt,
    trianguloBottomRight: allOfIt,
    X: allOfIt,
    V1: allOfIt,
    V2: allOfIt,
    reloj: allOfIt,
  };
}
