import rellax from "rellax";

rellax(".rellax");

const animations = document.querySelectorAll(".animation");

function animate(classname, target, options) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        console.log(classname);
        entry.target.classList.add(classname);
      } else {
        entry.target.classList.remove(classname);
      }
    });
  }, options);

  observer.observe(target);
}

for (let i = 0; i < animations.length; i++) {
  const animation = animations[i];
  animate("visible", animation, {
    root: null,
    rootMargin: "-100px",
    threshold: 1,
  });
}
