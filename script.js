// desktop: HTML Drag & Drop API
const lists = document.querySelectorAll(".list");
const zones = document.querySelectorAll(".dropzone");
let draggedItem = null;

lists.forEach(item => {
  item.addEventListener("dragstart", e => {
    draggedItem = item;
    e.dataTransfer.setData("text/plain", item.id);
    item.classList.add("dragging");
  });

  item.addEventListener("dragend", () => {
    item.classList.remove("dragging");
    draggedItem = null;
  });
});

zones.forEach(zone => {
  zone.addEventListener("dragover", e => {
    e.preventDefault();
    zone.classList.add("dragover");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("dragover");
  });

  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("dragover");
    if (draggedItem) {
      zone.appendChild(draggedItem);
    }
  });
});

// Mmobile: Touch support using ghost clone (image + text stay intact)
lists.forEach(item => {
  item.addEventListener("touchstart", e => {
    e.preventDefault();

    const ghost = item.cloneNode(true);
    ghost.style.position = "absolute";
    ghost.style.pointerEvents = "none";
    ghost.style.opacity = "0.8";
    ghost.style.zIndex = "1000";
    document.body.appendChild(ghost);

    const moveAt = (x, y) => {
      ghost.style.left = `${x - ghost.offsetWidth / 2}px`;
      ghost.style.top = `${y - ghost.offsetHeight / 2}px`;
    };

    moveAt(e.touches[0].pageX, e.touches[0].pageY);

    const touchMoveHandler = e => {
      moveAt(e.touches[0].pageX, e.touches[0].pageY);
    };

    document.addEventListener("touchmove", touchMoveHandler);

    item.addEventListener("touchend", e => {
      document.removeEventListener("touchmove", touchMoveHandler);
      ghost.remove();

      const touch = e.changedTouches[0];
      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

      zones.forEach(zone => {
        if (zone.contains(dropTarget)) {
          zone.appendChild(item);
        }
      });
    }, { once: true });
  });
});
