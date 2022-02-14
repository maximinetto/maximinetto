import rellax from "rellax";

const elems = document.querySelectorAll(".parallax");
const animations = document.querySelectorAll(".animation");

removeAnimation().then(() => {
  rellax(".parallax", {
    horizontal: true,
  });
});

for (let i = 0; i < animations.length; i++) {
  const animation = animations[i];
  animate("visible", animation, {
    root: null,
    rootMargin: "-100px",
    threshold: 0.7,
  });
}

async function removeAnimation() {
  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    await promiseListener("animationend", elem, { once: true });
    elem.classList.remove(
      "fade-in-left",
      "fade-in-right",
      "fade-in-fwd",
      "slide-in-elliptic-bottom-fwd"
    );
  }
}

async function promiseListener(type, elem, options) {
  return new Promise((resolve, reject) => {
    elem.addEventListener(type, resolve, options);
  });
}

function animate(classname, target, options) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log(entry);
      if (entry.intersectionRatio > 0) {
        entry.target.classList.add(classname);
        observer.unobserve(entry.target);
      } else {
        entry.target.classList.remove(classname);
      }
    });
  }, options);

  observer.observe(target);
}
