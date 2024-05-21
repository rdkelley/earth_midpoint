const convertDegreesToRadians = (deg) => (deg * Math.PI) / 180;

const formatArgs = () => {
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

const arg_values = formatArgs();
const { n, ...location_values } = arg_values;

// Convert the values of location_values to radians
const radian_location_values = {};

Object.entries(location_values).forEach(([key, val]) => {
  radian_location_values[key] = convertDegreesToRadians(val);
});

console.log(radian_location_values);

const longitude_diff =
  radian_location_values.longitude_b - radian_location_values.longitude_a;

// Intermediate values
const b_x =
  Math.cos(radian_location_values.latitude_b) * Math.cos(longitude_diff);
const b_y =
  Math.cos(radian_location_values.latitude_b) * Math.sin(longitude_diff);

console.log(b_x);
console.log(b_y);
