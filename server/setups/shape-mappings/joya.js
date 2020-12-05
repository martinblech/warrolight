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
  const r0 = _.range(0, 150);
  const r1 = _.range(150, 300);
  const r2 = _.range(300, 450);
  const r3 = _.range(450, 600);
  const r4 = _.range(600, 750);
  const r5 = _.range(750, 900);
  const h0 = _.range(900, 975);
  const h1 = _.range(975, 1050);
  const h2 = _.range(1050, 1125);
  const h3 = _.range(1125, 1200);
  const h4 = _.range(1200, 1275);
  const h5 = _.range(1275, 1350);
  const Warro = _.concat(r1, r2, r4, r5, h1, h4);
  const WarroOnly = Warro;
  const totemL1 = _.concat(h5, h0);
  const totemL2 = r0;
  const totemR1 = r3;
  const totemR2 = _.concat(h2, h3);
  const totemsExt = _.concat(totemL2, totemR2);
  const totemsInt = _.concat(totemL1, totemR1);
  const totems = _.concat(totemL1, totemL2, totemR1, totemR2);
  const wings = totems;
  const wingsLeft = _.concat(totemL1, totemL2);
  const wingsRight = _.concat(totemR1, totemR2);
  const X = _.concat(r4, h4, r5);
  const wingsX = _.concat(wings, X);
  const V1 = _.concat(r5, r0, r1, h5, h0);
  const V1L = _.concat(r5, r0, h5);
  const V2L = _.concat(r0, r1, h0);
  const V2 = _.concat(r2, r3, r4, h2, h3);
  const V1R = _.concat(r3, r4, h3);
  const V2R = _.concat(r2, r3, h2);
  return {
    allOfIt,
    all: allOfIt,
    shuffle,
    shuffleSegments5,
    shuffleSegments10,
    shuffleSegments20,
    Warro,
    WarroOnly,
    totemL1,
    totemL2,
    totemR1,
    totemR2,
    totemsExt,
    totemsInt,
    totems,
    wings,
    wingsLeft,
    wingsRight,
    X,
    wingsX,
    V1,
    V2,
    V1L,
    V1R,
    V2L,
    V2R,
    trianguloTop: Warro,
    trianguloTopLeft: totemL1,
    trianguloTopRight: totemR1,
    trianguloBottom: totems,
    trianguloBottomLeft: totemL2,
    trianguloBottomRight: totemR2,
    reloj: Warro,
  };
}
