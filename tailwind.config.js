/** @type {import('tailwindcss').Config} */
module.exports = {
  // Every file that may use NativeWind classes: all of the app's code is under src/.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
