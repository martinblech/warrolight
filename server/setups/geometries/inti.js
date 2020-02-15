const { Stripe } = require("../../src/geometry");

// Front view:
//
//      p0
//    / | \
//   /  |  \
// p4   |  p3
//   \  |  /
//    p1/2
//
// Top view:
//
//     p1
//    /| \
//   / |  \
// p4--p0--p3
//   \ |  /
//    \| /
//     p2

const p0 = [0, 0, 0.87]
const p1 = [0, 0.5, 0]
const p2 = [0, -0.5, 0]
const p3 = [0.82, 0, 0.29]
const p4 = [-0.82, 0, 0.29]

// El orden de los segmentos es clave. Replica cómo vamos a conectar las luces y 
// el orden natural de los leds.

const scale = vector => vector.map(x => 40*x)
const stripes = [
  Stripe.fromXZUpwardY(scale(p0), scale(p1), 144),
  Stripe.fromXZUpwardY(scale(p0), scale(p2), 144),
  Stripe.fromXZUpwardY(scale(p0), scale(p3), 144),
  Stripe.fromXZUpwardY(scale(p0), scale(p4), 144),
  Stripe.fromXZUpwardY(scale(p2), scale(p4), 144),
  Stripe.fromXZUpwardY(scale(p2), scale(p1), 144),
  Stripe.fromXZUpwardY(scale(p2), scale(p3), 144),
  Stripe.fromXZUpwardY(scale(p1), scale(p4), 144),
  Stripe.fromXZUpwardY(scale(p1), scale(p3), 144),
];

module.exports = stripes;

