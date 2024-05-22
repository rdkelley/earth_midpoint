const EARTH_RADIUS = 6371;

const convertDegreesToRadians = (deg) => (deg * Math.PI) / 180;

const convertRadiansToDegrees = (rad) => rad * (180 / Math.PI);

/**
 * Parses command-line arguments and extracts latitude and longitude coordinates,
 * along with an optional number of intermediary points.
 *
 * @returns {Object} An object containing the parsed values:
 *   - `latitude_a` (number): Latitude of the first location.
 *   - `longitude_a` (number): Longitude of the first location.
 *   - `latitude_b` (number): Latitude of the second location.
 *   - `longitude_b` (number): Longitude of the second location.
 *   - `n` (number|null): The number of intermediary points, or null if not specified.
 *
 * @throws {Error} Throws an error if any of the latitude or longitude arguments are missing.
 */
const parseArgs = () => {
  const args = process.argv.slice(2);
  const values = {};
  let using_demo_data = false;

  args.forEach((arg) => {
    const [key, value] = arg.split('=');

    if (key.startsWith('--')) {
      const arg_name = key.slice(2);
      values[arg_name] = value;
    }
  });

  if (values.n) {
    values.n = parseInt(values.n);
  } else {
    values.n = null;
  }

  // If no long/lat values are specified, fill in
  // some initial data (lat/long from Google Maps)
  if (
    !values.latitude_a &&
    !values.longitude_a &&
    !values.latitude_b &&
    !values.longitude_b
  ) {
    // Dodger Stadium
    values.latitude_a = 34.074;
    values.longitude_a = -118.2399;
    // Fenway Park
    values.latitude_b = 42.3469;
    values.longitude_b = -71.097;

    values.n = 6;

    using_demo_data = true;
  }
  // If a custom data is entered, but not complete, throw error
  else if (
    !values.latitude_a ||
    !values.longitude_a ||
    !values.latitude_b ||
    !values.longitude_b
  ) {
    throw new Error('Too few latitude & longitude arguments for custom run');
  }

  values.latitude_a = parseFloat(values.latitude_a);
  values.longitude_a = parseFloat(values.longitude_a);
  values.latitude_b = parseFloat(values.latitude_b);
  values.longitude_b = parseFloat(values.longitude_b);

  if (using_demo_data) {
    console.log(
      '\x1b[42m%s\x1b[0m',
      'Using demo data: from Dodger Stadium to Fenway Park!'
    );
  } else {
    console.log('\x1b[42m%s\x1b[0m', '\nData Entered:');
  }

  console.log(
    `Location A (Lat/Long): (${values.latitude_a}, ${values.longitude_a})\nLocation B (Lat/Long): (${values.latitude_b}, ${values.longitude_b})`
  );
  values.n
    ? console.log(`Find ${values.n} intermediary points.`)
    : console.log('Intermediary (n) points not entered');
  console.log('------------------------------------');

  return values;
};

/**
 * Converts Cartesian coordinates to latitude and longitude in radians.
 *
 * @param {number[]} coords - An array of Cartesian coords [x, y, z].
 * @returns {number[]} An array:
 *   - [0]: Latitude in radians.
 *   - [1]: Longitude in radians.
 */
const coordsToLatLong = (coords) => {
  return [
    Math.atan2(coords[2], Math.sqrt(coords[0] ** 2 + coords[1] ** 2)),
    Math.atan2(coords[1], coords[0]),
  ];
};

/**
 * Calculates the Cartesian coords of an intermediate point represented by the fraction f
 *
 * @param {number} f - The fraction of the distance between the two points (0 <= f <= 1).
 * @param {Object} coords - An object containing the latitude and longitude of the two points.
 * @returns {number[]} An array containing the Cartesian coordinates [x, y, z] of the intermediate point.
 *
 */
const calculateIntermediatePoint = (f, coords, central_angle) => {
  const a = Math.sin((1 - f) * central_angle) / Math.sin(central_angle);
  const b = Math.sin(f * central_angle) / Math.sin(central_angle);

  const x =
    a * Math.cos(coords.latitude_a) * Math.cos(coords.longitude_a) +
    b * Math.cos(coords.latitude_b) * Math.cos(coords.longitude_b);

  const y =
    a * Math.cos(coords.latitude_a) * Math.sin(coords.longitude_a) +
    b * Math.cos(coords.latitude_b) * Math.sin(coords.longitude_b);

  const z = a * Math.sin(coords.latitude_a) + b * Math.sin(coords.latitude_b);

  return [x, y, z];
};

/**
 * Calculates the central angle between two geographical points on a sphere given their latitudes and longitudes.
 *
 * @param {Object} coords - An object containing the latitude and longitude of the two points.
 * @returns {number} The central angle between the two points in radians.
 *
 */
const calculateCentralAngle = (coords) => {
  const long_diff = coords.longitude_b - coords.longitude_a;

  const acos_paren =
    Math.sin(coords.latitude_a) * Math.sin(coords.latitude_b) +
    Math.cos(coords.latitude_a) *
      Math.cos(coords.latitude_b) *
      Math.cos(long_diff);

  return Math.acos(acos_paren);
};

/**
 * Generates an array of intermediate points along a great circle between two geographical points. Skips
 * when the step == 0 and when step == 1 to provde n points between start and end.
 *
 * @param {number} n - The number of intermediate points to generate.
 * @param {...any} calc_params - The parameters to be passed to the `calculateIntermediatePoint` function.
 * @returns {number[][]} An array of arrays, each containing the Cartesian coordinates [x, y, z] of an intermediate point.
 *
 */
const interpolate = (n, ...calc_params) => {
  const f_steps = [];
  const step_size = 1 / (n + 1);

  for (let i = 1; i <= n; i++) {
    f_steps.push(i * step_size);
  }

  return f_steps.map((f) => calculateIntermediatePoint(f, ...calc_params));
};

/**
 * Prints the results of the midpoint and intermediary points calculations.
 *
 * @param {number[]} mid_point - An array containing the midpoint. By now, it should be in degrees lat/long
 * @param {number} n - The number of intermediary points needed.
 * @param {number[][]} intr_points - An array of arrays, each containing the intermediary point.
 *
 */
const printResults = (mid_point, n, intr_points) => {
  console.log(
    '\x1b[32m%s\x1b[0m',
    `The midpoint is located at ${mid_point[0].toFixed(
      4
    )}, ${mid_point[1].toFixed(4)}.\n`
  );

  if (n) {
    console.log(
      '\x1b[32m%s\x1b[0m',
      `${n} intermediary points were calculated:\n`
    );

    for (let i = 0; i < n; i++) {
      console.log(
        '\x1b[32m%s\x1b[0m',
        `${i + 1}: ${intr_points[i][0].toFixed(4)}, ${intr_points[i][1].toFixed(
          4
        )}`
      );
    }
  } else {
    console.log('No intermediary points were requested.');
  }
};

const init = () => {
  const arg_values = parseArgs();
  let intr_points;

  const { n, ...location_values } = arg_values;

  // Convert the values of location_values to radians
  const radian_location_values = {};

  Object.entries(location_values).forEach(([key, val]) => {
    radian_location_values[key] = convertDegreesToRadians(val);
  });

  const central_angle = calculateCentralAngle(radian_location_values);

  const midpoint_coords = calculateIntermediatePoint(
    0.5,
    radian_location_values,
    central_angle
  );

  const midpoint_rads = coordsToLatLong(midpoint_coords);

  const mid_point = midpoint_rads.map((point) =>
    convertRadiansToDegrees(point)
  );

  // n intermediary points requested
  // Ignore 1 point, since that will just be the midpoint
  if (n && n > 1) {
    // intr_points will be array of n points, each represented by Cartesian coordinates [x, y, z]
    const intr_points_cart = interpolate(
      n,
      radian_location_values,
      central_angle
    );

    // Convert to lat/long radians... then degrees
    intr_points = intr_points_cart.map((point_cart) =>
      coordsToLatLong(point_cart).map((point_rads) =>
        convertRadiansToDegrees(point_rads)
      )
    );
  }

  printResults(mid_point, n, intr_points);
};

init();
