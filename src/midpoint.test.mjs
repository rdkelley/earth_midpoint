import assert from "node:assert";
import { describe, it, test } from "node:test";

import { computePoints } from "./index.mjs";

describe("midpoint & inter point calculator", () => {
  it("should correctly calculate the midpoint (mix of pos & neg) and intr_points", () => {
    const args = [
      "--latitude_a=33.91714",
      "--longitude_a=-118.15370",
      "--latitude_b=51.48907",
      "--longitude_b=-0.29238",
      "--n=5",
    ];

    const result = computePoints(args);

    const expected = {
      mid_point: [60.115694769012485, -72.54193858714169],
      n: 5,
      intr_points: [
        [44.37636601703829, -107.88249829996597],
        [53.53379028434157, -93.46664205151326],
        [60.115694769012485, -72.54193858714169],
        [62.197875327387095, -45.47076011144746],
        [58.85741593095451, -19.465830446801995],
      ],
    };

    assert.deepStrictEqual(result, expected);
  });

  it("should correctly calculate the midpoint for negative start and positive end", () => {
    const args = [
      "--latitude_a=-34.522266586397606",
      "--longitude_a=-58.26268173473442",
      "--latitude_b=40.716158675079996",
      "--longitude_b=-74.17088458489494",
      "--n=5",
    ];

    const result = computePoints(args);

    const expected = {
      mid_point: [3.1269180795986458, -65.88299305245508],
      n: 5,
      intr_points: [
        [-22.006500306670265, -61.18175137005877],
        [-9.447586931172093, -63.61954131720436],
        [3.1269180795986458, -65.88299305245508],
        [15.696433395324393, -68.20226150747868],
        [28.238235511093308, -70.83112343062012],
      ],
    };

    assert.deepStrictEqual(result, expected);
  });

  it("should correctly calculate the midpoint for negative start and end", () => {
    const args = [
      "--latitude_a=-16.45176329215226",
      "--longitude_a=-44.213509967580734",
      "--latitude_b=-36.3017379983866",
      "--longitude_b=-159.70179200911824",
      "--n=5",
    ];

    const result = computePoints(args);

    const expected = {
      mid_point: [-42.62985915861863, -94.12898956359604],
      n: 5,
      intr_points: [
        [-27.145680620014875, -57.896776339874364],
        [-36.25291463392298, -74.23644228811283],
        [-42.62985915861863, -94.12898956359604],
        [-44.978001451524776, -116.95256461600944],
        [-42.657774248619546, -139.78696190509805],
      ],
    };

    assert.deepStrictEqual(result, expected);
  });

  it("should throw an error if a param is missing", () => {
    const args = [
      "--longitude_a=-118.15370",
      "--latitude_b=51.48907",
      "--longitude_b=-0.29238",
      "--n=5",
    ];

    assert.throws(() => {
      computePoints(args);
    }, new Error("Too few latitude & longitude arguments for custom run"));
  });

  it("should throw an error if latitude_a is out of range", () => {
    const args = [
      "--latitude_a=100",
      "--longitude_a=-118.15370",
      "--latitude_b=51.48907",
      "--longitude_b=-0.29238",
      "--n=5",
    ];

    assert.throws(() => {
      computePoints(args);
    }, new Error("Invalid latitude_a: 100. It must be between -90 and 90."));
  });

  it("should throw an error if longitude_a is out of range", () => {
    const args = [
      "--latitude_a=33.91714",
      "--longitude_a=-200",
      "--latitude_b=51.48907",
      "--longitude_b=-0.29238",
      "--n=5",
    ];

    assert.throws(() => {
      computePoints(args);
    }, new Error("Invalid longitude_a: -200. It must be between -180 and 180."));
  });

  it("should correctly calculate the number of intermediate points", () => {
    const args = [
      "--latitude_a=-34.522266586397606",
      "--longitude_a=-58.26268173473442",
      "--latitude_b=40.716158675079996",
      "--longitude_b=-74.17088458489494",
      "--n=18",
    ];

    const result = computePoints(args);

    assert.strictEqual(result.intr_points.length, 18);
  });

  it("should not throw an error if all params are left out", () => {
    const args = [];

    assert.doesNotThrow(() => {
      computePoints(args);
    });
  });

  it("should not throw an error if just n is left out", () => {
    const args = [
      "--latitude_a=33.91714",
      "--longitude_a=-118.15370",
      "--latitude_b=51.48907",
      "--longitude_b=-0.29238",
    ];

    assert.doesNotThrow(() => {
      computePoints(args);
    });
  });
});
