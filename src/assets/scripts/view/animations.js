import rellax from "rellax";

const elems = document.querySelectorAll(".parallax");
const animations = document.querySelectorAll(".animation");
let removeClasses = false;

rellax(".parallax", {
  horizontal: true,
  callback: function (position) {
    if (!removeClasses) {
      for (let i = 0; i < elems.length; i++) {
        const elem = elems[i];
        elem.classList.remove(
          "fade-in-left",
          "fade-in-right",
          "fade-in-fwd",
          "slide-in-elliptic-bottom"
        );
      }
    }
    removeClasses = true;
  },
});

for (let i = 0; i < animations.length; i++) {
  const animation = animations[i];
  animate("visible", animation, {
    root: null,
    rootMargin: "-100px",
    threshold: 1,
  });
}

function animate(classname, target, options) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        entry.target.classList.add(classname);
      } else {
        entry.target.classList.remove(classname);
      }
    });
  }, options);

  observer.observe(target);
}
