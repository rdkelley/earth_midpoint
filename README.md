## Find Midpoint Between 2 Locations on Earth (...and calculate intermediary points, if you wish)

Finds the midpoint between two locations on Earth, represented by latitude and longitude in degrees. Optionally, finds `n` intermediary points evenly spaced between the two locations. It does this by finding the central angle between the two locations using the spherical law of cosines and uses this to calculate fractional steps with spherical interpolation. There are limitations to this method, but the results should be accurate for most applications not requiring extreme precision. Ideally, a future version might feature ways to approximately account for the ellipsoidal shape of Earth, even without applying an iterative method like Vincenty's formulae.

Refrences: [This explanation by Chris Veness](https://www.movable-type.co.uk/scripts/latlong.html) was used to derive the equations related to the spherical law of cosines and latitude/longitude conversions. Additional sources I used for implementation can be found [here](https://gis.stackexchange.com/questions/4906/why-is-law-of-cosines-more-preferable-than-haversine-when-calculating-distance-b) and [here](https://en.wikipedia.org/wiki/Spherical_trigonometry) and [this page](https://www.distance.to/New-York,NY,USA-(New-York-County)/London,England,GBR) was used for refrence and to compare results.

### Running the Module

The easiest way to run the module is clone this repository and from the project root directory:

```
npm start
```

**Without any locations specified, the module will fill in demo data. It will use Dodger Stadium as Location A and Fenway Park as Location B, and it will find 6 intermediary points.**

### Running the Module with Your Own Locations

From the package root directory:

```
node ./src/index.mjs --latitude_a=33.91714 --longitude_a=-118.15370 --latitude_b=51.48907 --longitude_b=-0.29238 --n=5
```

Change locations and the value of `n` as you wish.

### Testing

There are minimal tests included to make sure the module can handle different locations, and that it throws an error if params are out of bounds or missing.

Running tests will require Node version 20 or higher since `node:assert` is used. You should be able to run them on v18 also, as long as you add `--experimental-test` to the `"test"` script in `package.json`.

To test:

```
npm test
```
