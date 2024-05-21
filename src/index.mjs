const EARTH_RADIUS = 6371;

const convertDegreesToRadians = (deg) => (deg * Math.PI) / 180;

const convertRadiansToDegrees = (rad) => rad * (180 / Math.PI);

const parseArgs = () => {
  const args = process.argv.slice(2);
  const values = {};

  args.forEach((arg) => {
    const [key, value] = arg.split('=');

    if (key.startsWith('--')) {
      const arg_name = key.slice(2);
      values[arg_name] = value;
    }
  });

  if (
    !values.latitude_a ||
    !values.longitude_a ||
    !values.latitude_b ||
    !values.longitude_b
  ) {
    throw new Error('Too few latitude & longitude arguments');
  }

  if (values.n) {
    values.n = parseInt(values.n);
  } else {
    values.n = null;
  }

  values.latitude_a = parseFloat(values.latitude_a);
  values.longitude_a = parseFloat(values.longitude_a);
  values.latitude_b = parseFloat(values.latitude_b);
  values.longitude_b = parseFloat(values.longitude_b);

  console.log(
    `Location A (Lat/Long): (${values.latitude_a}, ${values.longitude_a})\nLocation B (Lat/Long): (${values.latitude_b}, ${values.longitude_b})`
  );
  values.n
    ? console.log(`Find ${values.n} intermediary points.`)
    : console.log('Intermediary (n) points not entered');
  console.log('------------------------------------');

  return values;
};

const coordsToLatLong = (coords) => {
  return [
    Math.atan2(coords[2], Math.sqrt(coords[0] ** 2 + coords[1] ** 2)),
    Math.atan2(coords[1], coords[0]),
  ];
};

// Spherical interpolation
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

const calculateCentralAngle = (coords) => {
  console.log(coords);
  const long_diff = coords.longitude_b - coords.longitude_a;

  const acos_paren =
    Math.sin(coords.latitude_a) * Math.sin(coords.latitude_b) +
    Math.cos(coords.latitude_a) *
      Math.cos(coords.latitude_b) *
      Math.cos(long_diff);

  return Math.acos(acos_paren);
};

const arg_values = parseArgs();
const { n, ...location_values } = arg_values;

// Convert the values of location_values to radians
const radian_location_values = {};

Object.entries(location_values).forEach(([key, val]) => {
  radian_location_values[key] = convertDegreesToRadians(val);
});

const central_angle = calculateCentralAngle(radian_location_values);

console.log('CENTRAL ANGLE', central_angle);

console.log('DISTANCE', EARTH_RADIUS * central_angle);

const midpoint_coords = calculateIntermediatePoint(
  0.5,
  radian_location_values,
  central_angle
);

console.log('midpoint_coords', midpoint_coords);

const midpoint_rads = coordsToLatLong(midpoint_coords);

console.log(
  '\x1b[35m%s\x1b[0m',
  midpoint_rads.map((point) => convertRadiansToDegrees(point))
);

