import "../../styles/fonts.css";
import "../../styles/mobile.css";
import loadCssAsync from "../logic/loadData";

listenWindowResize();

const styles = {
  tablet: () => import("../../styles/mobile-medium.css"),
  desktop: () => import("../../styles/desktop.css"),
  finished: (resizeObserver) => {
    resizeObserver.disconnect();
  },
};

function listenWindowResize() {
  const element = document.documentElement;

  const resizeObserver = new ResizeObserver(() => {
    loadCssAsync(element.clientWidth, (state) => {
      const style = styles[state];
      style(resizeObserver);
    });
  });

  resizeObserver.observe(element);
}
