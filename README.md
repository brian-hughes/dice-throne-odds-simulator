# Dice Throne Simulator

Static TypeScript app that simulates 5 custom dice for a chosen hero and runs X trials to estimate ability activation probabilities.

To compile:

```bash
npm install
npm run build
# open dist/index.html or dist/index-standalone.html your browser
```

Alternatively you can download the `dt-odds-simulator.html` file which is a copy of the built 'index-standalone.html' from the dist directory.

Notes:
- Edit `src/heroes.ts` to define custom die faces and abilities per hero.
- Run `npm run build` to produce `dist/index.html` and `dist/bundle.js`.
