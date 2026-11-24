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
    home = 374,
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
  const walkButton = document.getElementById("catWalkButton"),
    napButton = document.getElementById("catNapButton");
  const controls = document.getElementById("catMotionControls");
  const floorY = 255,
    bed = { x: 12, y: 138, w: 224, h: 110 },
    pillow = 129,
    doorstep = 221;
  const stride = [0, 6, 2, 7, 3, 5, 1, 4];
  let phase = "rest",
    phaseAt = 0,
    walkStart = 374,
    goal = 374,
    facing = -1,
    afterWalk = "rest",
    manualNap = false;
  let autoMuted = false,
    autoWindow = false,
    hasBed = false,
    careGoal = 374,
    careFacing = 1,
    wakeForCare = false;
  function setPhase(value, now) {
    phase = value;
    phaseAt = now;
    scene.dataset.catPose = value;
    labels();
  }
  function labels() {
    // The game owns button labels and availability.
  }

  function bedPicture(key) {
    g.drawImage(art[key], bed.x, bed.y, bed.w, bed.h);
  }
  function bedFront() {
    g.save();
    g.translate(bed.x, bed.y);
    g.scale(bed.w, bed.h);
    g.beginPath();
    g.moveTo(0.009, 0.335);
    g.bezierCurveTo(0.025, 0.5, 0.12, 0.51, 0.23, 0.565);
    g.bezierCurveTo(0.3, 0.6, 0.3, 0.735, 0.41, 0.748);
    g.bezierCurveTo(0.52, 0.77, 0.66, 0.75, 0.7, 0.665);
    g.bezierCurveTo(0.74, 0.535, 0.94, 0.54, 0.992, 0.36);
    g.lineTo(1, 1);
    g.lineTo(0, 1);
    g.closePath();
    g.clip();
    g.drawImage(art.empty, 0, 0, 1, 1);
    g.restore();
  }
  function smallOutfit(hat, glasses) {
    if (worn.hat) mount(art.hat, hat, [824, 287], [552, 110, 883, 506]);
    if (worn.glasses)
      mount(art.glasses, glasses, [952, 412], [681, 275, 660, 265]);
  }
  function occupiedBed(key) {
    bedPicture(key);
    g.save();
    g.translate(bed.x, bed.y);
    if (key === "asleep")
      smallOutfit([129, 15, 0.119, 0.38], [136, 47, 0.074, 0.37]);
    else smallOutfit([125, 18, 0.095, -0.1], [143, 41, 0.068, -0.13]);
    g.restore();
  }
  function walkFrame(cx, foot, dir, distance, scale = 1) {
    const im = art.walk,
      i = stride[Math.floor((Math.abs(distance) / 62) * 8) % 8],
      w = im.width / 4,
      h = im.height / 2;
    g.save();
    g.translate(cx, foot);
    g.scale(dir * scale, scale);
    g.drawImage(
      im,
      (i % 4) * w,
      Math.floor(i / 4) * h,
      w,
      h,
      -80,
      -177,
      160,
      213,
    );
    smallOutfit([20, -117, 0.11, -0.12], [40, -98, 0.094, -0.05]);
    g.restore();
  }
  function upright(cx, dir) {
    g.save();
    g.translate(cx, floorY);
    g.scale(0.55 * dir, 0.55);
    character("idle", -180, -248, 0, false, 0);
    g.restore();
  }
  function move(to, then, now) {
    walkStart = home;
    goal = to;
    afterWalk = then;
    facing = to >= home ? 1 : -1;
    setPhase("walk", now);
  }
  function beginNap(manual, now) {
    manualNap = manual;
    move(doorstep, "enter", now);
  }
  function beginWake(then, now) {
    manualNap = false;
    autoMuted = autoWindow;
    afterWalk = then;
    setPhase("rise", now);
  }
  function redraw() {
    stopFrames();
    if (visible && ready) draw(performance.now());
  }
  walkButton.onclick = () => {
    if (!window.YasmineCatActions?.walk()) return;
    scene.scrollIntoView({behavior:motion.matches?"instant":"smooth",block:"center"});
    const now = performance.now();
    autoMuted = autoWindow;
    if (phase === "sleep") beginWake("walk", now);
    else move(home > 310 ? doorstep + 18 : 405, "rest", now);
    redraw();
  };
  napButton.onclick = () => { window.YasmineCatActions?.nap(); sync(); };
  function schedule(delay) {
    timer = setTimeout(() => {
      frame = requestAnimationFrame(draw);
    }, delay);
  }
  const garden = new Image();
  garden.src = new URL("../potting-bench.webp",assetRoot).href;
  function ambience(now) {
    const remaining=Number(scene.dataset.walkUntil)-Date.now();
    if(remaining>0){
      if(garden.complete && garden.naturalWidth) g.drawImage(garden,0,0,520,290);
      else {g.fillStyle="#b8d6ae";g.fillRect(0,0,520,290);}
      const t=1-remaining/7000;
      const fraction=t<.4?t/.4:t<.63?1:(1-t)/.37;
      const x=90+300*ease(fraction);
      if(t>=.4 && t<.63){
        g.save();g.translate(x,255);g.scale(.55,.55);character("sniff",-180,-248,0,false,0);g.restore();
        g.font="32px sans-serif";g.fillText("🌿",x+64,254);
      } else walkFrame(x,255,t<.4?1:-1,300*fraction);
      schedule(motion.matches?180:45);return;
    }
    const reduced = motion.matches,
      age = now - phaseAt;
    if (["rest", "walk"].includes(phase) && autoWindow && !autoMuted && afterWalk !== "enter") beginNap(false, now);
    else if (phase === "rest" && !reduced && age >= 5500)
      move(home > 310 ? (hasBed ? doorstep + 18 : 133) : 405, "rest", now);
    const elapsed = now - phaseAt;
    if (Number(scene.dataset.walkUntil)>Date.now()) {
      g.font="30px sans-serif";g.fillText("🌿",445,248);g.font="20px sans-serif";g.fillText("🐾",home-40,273);
    }
    if (phase === "walk") {
      const delta = goal - walkStart,
        distance = Math.min(Math.abs(delta), elapsed * 0.085);
      home = reduced ? goal : walkStart + Math.sign(delta) * distance;
      if (reduced || distance >= Math.abs(delta)) setPhase(afterWalk, now);
    } else if (phase === "enter" && (reduced || elapsed >= 580)) {
      home = pillow;
      setPhase("settle", now);
    } else if (phase === "settle" && (reduced || elapsed >= 730))
      setPhase("sleep", now);
    else if (phase === "rise" && (reduced || elapsed >= 460))
      setPhase("exit", now);
    else if (phase === "exit" && (reduced || elapsed >= 550)) {
      home = doorstep + 18;
      facing = 1;
      if (afterWalk === "walk") move(405, "rest", now);
      else setPhase("rest", now);
    }
    if (phase === "settle" || phase === "sleep" || phase === "rise") {
      occupiedBed(phase === "sleep" ? "asleep" : "settle");
    } else {
      if (hasBed) bedPicture("empty");
      if (phase === "enter" || phase === "exit") {
        const entering = phase === "enter",
          t = clamp((now - phaseAt) / (entering ? 580 : 550)),
          u = ease(t);
        home = entering
          ? doorstep + (pillow - doorstep) * u
          : pillow + (doorstep + 18 - pillow) * u;
        const height = entering ? u : 1 - u;
        walkFrame(
          home,
          floorY - 46 * height - 23 * Math.sin(t * Math.PI),
          entering ? -1 : 1,
          44 * u,
          1 - 0.13 * height,
        );
        if (entering ? t > 0.14 : t < 0.86) bedFront();
      } else {
        paintEllipse(home, floorY, 62, 5, "rgba(115,76,40,.15)");
        if (phase === "walk")
          walkFrame(home, floorY, facing, Math.abs(home - walkStart));
        else upright(home, facing);
      }
    }
    if (scene.dataset.tired === "true" && phase === "rest") {
      g.font="24px sans-serif";g.fillStyle="#725434";g.fillText("🥱",home,95);
    }
    if (phase === "rest") {
      if (!reduced) schedule(Math.max(80, phaseAt + 5500 - now));
    } else if (phase !== "sleep") schedule(reduced ? 0 : 50);
  }
  function stopFrames() {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
  }
  function draw(now) {
    if (!ready || !visible) return;
    g.setTransform(2, 0, 0, 2, 0, 0);
    g.clearRect(0, 0, 520, 290);
    if (!active) {
      ambience(now);
      return;
    }
    if (hasBed) bedPicture("empty");
    const reduced = motion.matches;
    const wakeDuration = wakeForCare && !reduced ? 0.55 : 0;
    const elapsed = (now - started) / 1000 - wakeDuration,
      dish = active === "Feed" || active === "Water";
    if (elapsed < 0) {
      const u = (elapsed + wakeDuration) / wakeDuration;
      if (u < .25) occupiedBed("settle");
      else {
        const hop = clamp((u - .25) / .75);
        walkFrame(pillow + (from - pillow) * ease(hop), floorY - 46 * (1 - hop) - 22 * Math.sin(Math.PI * hop), 1, 44 * hop, .87 + .13 * hop);
        if (hop < .86) bedFront();
      }
      schedule(40);
      return;
    }
    const approach = reduced ? 0 : 0.72,
      dt = elapsed - approach;
    let x = 82,
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
      home =
        from + (careGoal - from) * (approach ? ease(elapsed / approach) : 1);
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
    } else if (active === "Treat") {
      pose = elapsed < .8 ? "sniff" : elapsed < 3.2 ? "eat" : "idle";
      angle = reduced ? 0 : .008 * Math.sin(elapsed * 17);
    } else if (active === "Play") {
      const a = reduced ? 0.8 : elapsed,
        cycle = (a % 1.65) / 1.65;
      const swat = cycle > 0.26 && cycle < 0.79,
        reach = swat ? Math.sin((Math.PI * (cycle - 0.26)) / 0.53) : 0;
      pose = swat ? "bat" : "idle";
      x = 82 + reach * 5;
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
    g.save();
    g.translate(careGoal, floorY);
    g.scale(0.55 * careFacing, 0.55);
    g.translate(-262, -258);
    if (dish) bowl(active === "Water", progress, ring, false);
    g.restore();
    paintEllipse(home, floorY, 63, 5, "rgba(115,76,40,.15)");
    if (dish && dt < 0 && Math.abs(careGoal - from) > 2) {
      walkFrame(home, floorY, careFacing, Math.abs(home - from));
    } else {
      g.save();
      g.translate(home, floorY);
      g.scale(0.55 * careFacing, 0.55);
      g.translate(-262, -258);
      character(pose, x, y, angle, active === "Water" && pose === "eat", lap);
      g.restore();
    }
    g.save();
    g.translate(careGoal, floorY);
    g.scale(0.55 * careFacing, 0.55);
    g.translate(-262, -258);
    if (dish) bowl(active === "Water", progress, -1, true);
    if (active === "Play") {
      if (scene.dataset.toy === "feather")
        feather(fx, fy, reduced ? 0 : 0.15 * Math.sin(elapsed * 5.3));
      else yarn(fx, fy);
    }
    if (active === "Treat") {
      if (elapsed < 2.5) {
        const t = clamp(elapsed / 1.3);
        const tx = 440 - 55 * ease(t), ty = 240 + 3 * ease(t);
        const radius = elapsed < 1.8 ? 8 : Math.max(0, 8 * (2.5-elapsed)/.7);
        paintEllipse(tx, ty, radius, radius*.7, "#ac6a32");
        paintEllipse(tx-2, ty-2, radius*.22, radius*.18, "#f7d99e");
      } else {
        g.font = "26px sans-serif";g.fillText("♥", 370, 180-(elapsed-2.5)*16);
      }
    }
    if (active === "Brush") brush(brx, bry, brAngle);
    g.restore();
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
        [
          "idle",
          "sniff",
          "eat",
          "bat",
          "groom",
          "hat",
          "glasses",
          "walk",
          "empty",
          "settle",
          "asleep",
        ].map(
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
      controls.hidden = false;
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
    const now = performance.now();
    const owns = scene.dataset.bed === "true";
    const period = owns && scene.classList.contains("is-napping");
    if (period !== autoWindow) {
      autoMuted = false;
      autoWindow = period;
    }
    if (hasBed && !owns) {
      home = 374;
      manualNap = false;
      setPhase("rest", now);
    }
    hasBed = owns;
    if (
      !manualNap &&
      !autoWindow &&
      ["sleep", "settle", "enter"].includes(phase)
    )
      beginWake("rest", now);
    if (next !== active) {
      if (next) {
        autoMuted = autoWindow;
        manualNap = false;
        wakeForCare = hasBed && ["sleep", "rise", "enter", "exit", "settle"].includes(phase);
        if (wakeForCare)
          home = doorstep + 18;
      }
      active = next;
      from = home;
      started = now;
      setPhase("rest", now);
      careFacing = home > 365 ? -1 : 1;
      careGoal =
        next === "Feed" || next === "Water" ? home + careFacing * 57 : home;
      facing = careFacing;
    }
    visible = !area.hidden && !area.classList.contains("cat-in-shelter") && !document.hidden;
    if (visible && !ready && !loading) {
      loadArt();
      return;
    }
    if (!ready) return;
    const view = [
      visible,
      owns,
      period,
      area.lang,
      document.documentElement.lang,
      next,
      scene.dataset.outfit,
      scene.dataset.toy,
      motion.matches,
      scene.dataset.tired,
    ].join("|");
    if (view === lastView) return;
    lastView = view;
    const outfit = (scene.dataset.outfit || "").split(" ");
    worn.hat = outfit.includes("hat");
    worn.glasses = outfit.includes("glasses");
    stopFrames();
    labels();
    if (visible) draw(performance.now());
  }
  const observer = new MutationObserver(sync);
  observer.observe(scene, {
    attributes: true,
    attributeFilter: [
      "data-action",
      "data-toy",
      "class",
      "data-outfit",
      "data-bed",
      "data-tired",
    ],
  });
  observer.observe(area, {
    attributes: true,
    attributeFilter: ["hidden", "lang", "class"],
  });
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", sync);
  sync();
})();
