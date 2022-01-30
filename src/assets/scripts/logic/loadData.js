const styles = {
  tablet: { width: 520, pass: false },
  desktop: { width: 768, pass: false },
};

export const states = {
  TABLET: "tablet",
  DESKTOP: "desktop",
  FINISHED: "finished",
};

export default function loadCssAsync(widthScreen, callback) {
  const keys = Object.keys(styles);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const style = styles[key];
    if (style.width <= widthScreen) {
      style.pass = true;
      callback(key);
    }
  }

  let passes = 0;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const style = styles[key];
    if (style.pass) {
      passes++;
    }
  }

  console.log(passes);
  if (passes === keys.length) {
    callback(states.FINISHED);
  }
}
