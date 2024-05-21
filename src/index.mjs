const EARTH_RADIUS = 6371;

const convertDegreesToRadians = (deg) => (deg * Math.PI) / 180;

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

const calculateCentralAngle = (coords) => {
  console.log(coords);
  const long_diff = coords.longitude_b - coords.longitude_a;

  console.log(long_diff);

  const acos_paren =
    Math.sin(coords.latitude_a) * Math.sin(coords.latitude_b) +
    Math.cos(coords.latitude_a) *
      Math.cos(coords.latitude_b) *
      Math.cos(long_diff);

  console.log('acos_paren', acos_paren);

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
