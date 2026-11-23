/* Visual presentation of the cat. The care timers and economy are owned by game.js. */
(function () {
  "use strict";
  const scene = document.getElementById("catScene"),
    area = document.getElementById("catArea");
  const actor = document.getElementById("catCareActor"),
    canvas = document.getElementById("catCareCanvas");
  const backdrop = document.getElementById("catCareRoom"),
    g = canvas.getContext("2d");
  if (!g) return;
  const assetRoot = new URL("../images/cat-care/", document.currentScript.src);
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const art = {},
    worn = { hat: false, glasses: false };
  let lastView = "",
    ready = false,
    loading = false,
    active = "",
    started = 0,
    from = 34,
    home = 34,
    timer = 0,
    frame = 0,
    visible = false;
  const fits = {
    idle: [
      [949, 163, 0.7, 0.028],
      [1083, 345, 0.66, -0.055],
    ],
    sniff: [
      [1090, 437, 0.605, 0.3],
      [1153, 685, 0.455, 0.141],
    ],
    eat: [
      [1098, 564, 0.56, 0.32],
      [1142, 833, 0.435, 0.237],
    ],
    bat: [
      [825, 170, 0.6, -0.17],
      [994, 259, 0.501, -0.26],
    ],
    groom: [
      [898, 213, 0.65, -0.19],
      [1078, 324, 0.69, -0.29],
    ],
  };
  const clamp = (v) => Math.max(0, Math.min(1, v)),
    ease = (v) => {
      v = clamp(v);
      return v * v * (3 - 2 * v);
    };
  function paintEllipse(x, y, rx, ry, fill) {
    g.beginPath();
    g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    g.fillStyle = fill;
    g.fill();
  }
  function line(x, y, xx, yy, c, w) {
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(xx, yy);
    g.strokeStyle = c;
    g.lineWidth = w;
    g.lineCap = "round";
    g.stroke();
  }
  function room(g) {
    const sky = g.createLinearGradient(0, 0, 520, 240);
    sky.addColorStop(0, "#fff2d2");
    sky.addColorStop(1, "#ecd5ad");
    g.fillStyle = sky;
    g.fillRect(0, 0, 520, 290);
    g.save();
    g.beginPath();
    g.moveTo(35, 140);
    g.lineTo(35, 78);
    g.bezierCurveTo(36, 7, 157, 7, 159, 78);
    g.lineTo(159, 140);
    g.closePath();
    g.fillStyle = "#dfcca6";
    g.fill();
    g.clip();
    g.fillStyle = "#dce5c6";
    g.fillRect(41, 32, 112, 103);
    for (const [x, y, rx, ry, c] of [
      [85, 147, 81, 48, "#c8d5af"],
      [141, 155, 63, 54, "#bbcea7"],
    ]) {
      g.beginPath();
      g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      g.fillStyle = c;
      g.fill();
    }
    g.fillStyle = "#efddbb";
    g.fillRect(94, 28, 5, 106);
    g.fillRect(40, 84, 115, 5);
    g.restore();
    const floor = g.createLinearGradient(0, 207, 0, 290);
    floor.addColorStop(0, "#e4c199");
    floor.addColorStop(0.12, "#efd1a8");
    floor.addColorStop(1, "#f6dfbb");
    g.fillStyle = floor;
    g.fillRect(0, 207, 520, 83);
  }
  function mount(image, fit, ref, crop) {
    g.save();
    g.translate(fit[0], fit[1]);
    g.rotate(fit[3]);
    g.scale(fit[2], fit[2]);
    g.drawImage(image, crop[0] - ref[0], crop[1] - ref[1], crop[2], crop[3]);
    g.restore();
  }
  function character(p, x, y, angle, drinking, lap) {
    g.save();
    g.translate(x, y);
    g.translate(175, 248);
    g.rotate(angle);
    g.translate(-175, -248);
    if (p === "sniff" || p === "eat") g.translate(11, 6);
    g.scale(0.25, 0.25);
    g.drawImage(art[p], 0, 0, 1536, 1024);
    if (drinking) {
      g.save();
      g.translate(1188, 936);
      g.rotate(-0.18);
      g.fillStyle = "#e89197";
      g.beginPath();
      g.moveTo(-7, -2);
      const l = 4 + lap * 26;
      g.quadraticCurveTo(-10, l, 0, l);
      g.quadraticCurveTo(9, l, 8, -2);
      g.closePath();
      g.fill();
      g.restore();
    }
    if (worn.hat) mount(art.hat, fits[p][0], [824, 287], [552, 110, 883, 506]);
    if (worn.glasses)
      mount(art.glasses, fits[p][1], [952, 412], [681, 275, 660, 265]);
    g.restore();
  }
  const bx = 394,
    by = 257;
  function bowl(water, progress, ring, front) {
    g.save();
    g.translate(bx, by);
    const rim = water ? "#8bbbc3" : "#eaaa88",
      body = water ? "#51939a" : "#ba7153";
    if (!front) {
      paintEllipse(0, 13, 39, 4, "rgba(116,80,47,.13)");
      g.fillStyle = body;
      g.beginPath();
      g.moveTo(-34, 0);
      g.quadraticCurveTo(-29, 19, -19, 18);
      g.quadraticCurveTo(23, 23, 29, 12);
      g.lineTo(34, 0);
      g.fill();
      paintEllipse(0, 0, 34, 7, rim);
      paintEllipse(0, 0, 30, 5, water ? "#76bbc3" : "#8e604e");
      if (water && ring >= 0) {
        g.beginPath();
        g.ellipse(-6, 0, 2 + ring * 19, 0.6 + ring * 3, 0, 0, Math.PI * 2);
        g.strokeStyle = "rgba(235,255,255," + (1 - ring) * 0.9 + ")";
        g.lineWidth = 1.4;
        g.stroke();
      }
      if (!water) {
        for (let i = 0; i < Math.ceil(15 * (1 - progress)); i++)
          paintEllipse(
            -21 + ((i * 17) % 42),
            1 - ((i * 7) % 6),
            3.2,
            2,
            i % 2 ? "#ac784f" : "#87512f",
          );
      }
    } else {
      g.fillStyle = rim;
      g.beginPath();
      g.moveTo(-34, 0);
      g.bezierCurveTo(-25, 8, 25, 9, 34, 0);
      g.bezierCurveTo(25, 11, -26, 11, -34, 0);
      g.fill();
    }
    g.restore();
  }
  function feather(x, y, angle) {
    g.save();
    g.translate(x, y);
    g.rotate(angle);
    g.strokeStyle = "#9c7657";
    g.lineWidth = 1.7;
    g.beginPath();
    g.moveTo(0, -24);
    g.bezierCurveTo(21, -48, 38, -69, 63, -56);
    g.stroke();
    line(63, -56, 96, -93, "#91633d", 4);
    g.rotate(0.24);
    g.fillStyle = "#467d81";
    g.beginPath();
    g.moveTo(0, -29);
    g.bezierCurveTo(-15, -14, -12, 0, -5, 10);
    g.bezierCurveTo(9, -1, 12, -19, 0, -29);
    g.fill();
    line(0, -26, -5, 11, "#d5d6a7", 1.4);
    for (let i = 0; i < 4; i++) {
      const yy = -16 + i * 5;
      line(-2, yy + 2, 5, yy - 4, "#b3cdad", 0.8);
    }
    g.restore();
  }
  function brush(x, y, angle) {
    g.save();
    g.translate(x, y);
    g.rotate(angle);
    line(-5, 3, -42, 19, "#925736", 6);
    line(-8, 2, -38, 16, "#c58751", 2);
    g.fillStyle = "#d5a16e";
    g.beginPath();
    g.roundRect(-10, -8, 28, 18, 7);
    g.fill();
    g.fillStyle = "#815744";
    g.beginPath();
    g.roundRect(-7, -6, 22, 11, 4);
    g.fill();
    for (let i = 0; i < 6; i++)
      line(-6 + i * 3.5, 4, -4 + i * 3.5, 10, "#574d42", 1.3);
    g.restore();
  }
  function yarn(x, y) {
    g.save();
    g.translate(x, y);
    paintEllipse(0, 0, 10, 10, "#d67e9b");
    g.strokeStyle = "#925069";
    g.lineWidth = 1.2;
    for (let i = -4; i <= 4; i += 4) {
      g.beginPath();
      g.moveTo(-7, i - 4);
      g.quadraticCurveTo(2, i - 3, 7, i + 4);
      g.stroke();
    }
    g.beginPath();
    g.moveTo(6, 6);
    g.quadraticCurveTo(14, 17, 23, 8);
    g.stroke();
    g.restore();
  }
  function stopFrames() {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
  }
  function draw(now) {
    if (!ready || !visible) return;
    const reduced = motion.matches;
    const elapsed = (now - started) / 1000,
      dish = active === "Feed" || active === "Water";
    const approach = reduced ? 0 : 0.72,
      dt = elapsed - approach;
    let x = home,
      y = 10,
      angle = 0,
      lap = 0,
      ring = -1,
      pose = "idle",
      progress = 0;
    let fx = 0,
      fy = 0,
      brx = 0,
      bry = 0,
      brAngle = 0;
    if (dish) {
      x = from + (82 - from) * (approach ? ease(elapsed / approach) : 1);
      home = x;
      if (!reduced && dt < 0) y -= Math.abs(Math.sin(elapsed * 14)) * 1.9;
      if (dt >= 0 && dt < 3.18) {
        pose = dt < 0.2 || dt > 2.96 ? "sniff" : "eat";
        if (pose === "eat") {
          const phase = (Math.max(0, dt - 0.2) * 2.75) % 1;
          lap = reduced ? 0.65 : Math.max(0, Math.sin(phase * Math.PI * 2));
          ring = reduced ? 0.5 : phase;
          angle = reduced
            ? 0
            : (active === "Water" ? 0.002 : 0.007) * Math.sin(dt * 13);
        }
      }
      progress = ease((dt - 0.2) / 2.7);
    } else if (active === "Play") {
      const a = reduced ? 0.8 : elapsed,
        cycle = (a % 1.65) / 1.65;
      const swat = cycle > 0.26 && cycle < 0.79,
        reach = swat ? Math.sin((Math.PI * (cycle - 0.26)) / 0.53) : 0;
      pose = swat ? "bat" : "idle";
      x = from + reach * 5;
      y -= reach * 9;
      angle = swat ? -reach * 0.018 : 0;
      fx = x + 340 + (1 - reach) * 19;
      fy = y + 88 - 18 * Math.sin(a * 4) - reach * 5;
    } else if (active === "Brush") {
      const a = reduced ? 1 : elapsed;
      pose = a > 0.35 && a < 3.95 ? "groom" : "idle";
      const pass = reduced ? 0.5 : (1 - Math.cos(a * 5.7)) / 2;
      angle = pose === "groom" && !reduced ? -0.019 * pass : 0;
      brx =
        x +
        (pose === "groom" ? 242 : 241) -
        14 * pass -
        20 * (1 - clamp((a - 0.15) / 0.42));
      bry = y + (pose === "groom" ? 104 : 110) + 13 * pass;
      brAngle = -0.3 + 0.16 * pass;
    }
    g.setTransform(2, 0, 0, 2, 0, 0);
    g.clearRect(0, 0, 520, 290);
    paintEllipse(x + 180, 259, 126, 9, "rgba(131,86,43,.13)");
    if (dish) bowl(active === "Water", progress, ring, false);
    character(pose, x, y, angle, active === "Water" && pose === "eat", lap);
    if (dish) bowl(active === "Water", progress, -1, true);
    if (active === "Play") {
      if (scene.dataset.toy === "feather")
        feather(fx, fy, reduced ? 0 : 0.15 * Math.sin(elapsed * 5.3));
      else yarn(fx, fy);
    }
    if (active === "Brush") brush(brx, bry, brAngle);
    actor.style.setProperty("--cat-center", ((x + 180) / 520) * 100 + "%");
    if (active)
      timer = setTimeout(
        () => {
          frame = requestAnimationFrame(draw);
        },
        reduced ? 150 : 40,
      );
  }
  async function loadArt() {
    loading = true;
    try {
      await Promise.all(
        ["idle", "sniff", "eat", "bat", "groom", "hat", "glasses"].map(
          (name) =>
            new Promise((ok, fail) => {
              const img = new Image();
              img.onload = () => {
                art[name] = img;
                ok();
              };
              img.onerror = fail;
              img.src = new URL(name + ".webp", assetRoot).href;
            }),
        ),
      );
      const bg = backdrop.getContext("2d");
      bg.scale(2, 2);
      room(bg);
      ready = true;
      scene.classList.add("cat-art-ready");
      actor.hidden = false;
      backdrop.hidden = false;
      sync();
    } catch {
      /* The existing SVG scene remains usable if an image cannot load. */
    } finally {
      loading = false;
    }
  }
  function sync() {
    const next = scene.classList.contains("cat-drinking")
      ? "Water"
      : scene.dataset.action || "";
    if (next !== active) {
      if (!active && ready && visible && next) {
        const transform = getComputedStyle(actor).transform;
        if (transform !== "none" && actor.clientWidth)
          home +=
            (new DOMMatrixReadOnly(transform).m41 * 520) / actor.clientWidth;
        home = Math.max(12, Math.min(82, home));
      }
      from = home;
      active = next;
      started = performance.now();
    }
    visible = !area.hidden && !document.hidden;
    if (visible && !ready && !loading) {
      loadArt();
      return;
    }
    if (!ready) return;
    const view = [
      visible,
      next,
      scene.dataset.outfit,
      scene.dataset.toy,
      motion.matches,
    ].join("|");
    if (view === lastView) return;
    lastView = view;
    const outfit = (scene.dataset.outfit || "").split(" ");
    worn.hat = outfit.includes("hat");
    worn.glasses = outfit.includes("glasses");
    stopFrames();
    actor.classList.toggle("strolling", visible && !active);
    if (visible) draw(performance.now());
  }
  const observer = new MutationObserver(sync);
  observer.observe(scene, {
    attributes: true,
    attributeFilter: ["data-action", "data-toy", "class", "data-outfit"],
  });
  observer.observe(area, { attributes: true, attributeFilter: ["hidden"] });
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", sync);
  sync();
})();
