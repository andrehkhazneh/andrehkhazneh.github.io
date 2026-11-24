/* Two-pass mouse hunt in the nursery. The game owns the round and rewards. */
(function () {
  const assetRoot = new URL("../images/cat-care/", document.currentScript.src);
  window.createNurseryMouseHunt = function (options) {
    const root = document.getElementById("mouseChase"),
      canvas = root.querySelector("canvas"),
      ctx = canvas.getContext("2d"),
      button = root.querySelector("button"),
      hint = root.querySelector(".hunt-hint"),
      tries = root.querySelector(".hunt-attempt");
    let outfit = [],
      current = null,
      loaded = false,
      loading = false,
      failed = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sprites = {};
    function oval(g, x, y, rx, ry, c, tilt = 0) {
      g.beginPath();
      g.ellipse(x, y, rx, ry, tilt, 0, 2 * Math.PI);
      g.fillStyle = c;
      g.fill();
    }
    function path(g, coords, color, stroke, width = 1) {
      const p = new Path2D(coords);
      if (color) {
        g.fillStyle = color;
        g.fill(p);
      }
      if (stroke) {
        g.strokeStyle = stroke;
        g.lineWidth = width;
        g.lineCap = "round";
        g.stroke(p);
      }
    }
    function grad(g, x, y, X, Y, colors) {
      const a = g.createLinearGradient(x, y, X, Y);
      colors.forEach(([s, c]) => a.addColorStop(s, c));
      return a;
    }
    function glaze(g, x, y, r, color, edge) {
      let a = g.createRadialGradient(x, y, 0, x, y, r);
      a.addColorStop(0, color);
      a.addColorStop(1, edge);
      return a;
    }
    function leaf(g, x, y, l, w, angle, colors) {
      g.save();
      g.translate(x, y);
      g.rotate(angle);
      const fill = grad(g, 0, -w, 0, w, [
        [0, colors[0]],
        [0.52, colors[1]],
        [1, colors[0]],
      ]);
      path(
        g,
        "M0 0 Q" +
          l * 0.45 +
          " " +
          -w * 1.8 +
          " " +
          l +
          " 0 Q" +
          l * 0.45 +
          " " +
          w * 1.7 +
          " 0 0Z",
        fill,
      );
      path(
        g,
        "M0 0 Q" + l * 0.46 + " " + -w * 0.15 + " " + l * 0.86 + " 0",
        null,
        colors[0],
        1,
      );
      g.restore();
    }
    function pot(g, x, ground, scale, palette, flowers) {
      g.save();
      g.translate(x, ground);
      g.scale(scale, scale);
      oval(g, 5, -1, 46, 7, "#91704943");
      const greens = ["#557951", "#91aa66"];
      for (let j = 0; j < 5; j++) {
        const topx = (j - 2) * 12,
          ty = -82 - (j % 3) * 12;
        path(
          g,
          "M0 -48 Q" + topx * 0.5 + " -70 " + topx + " " + ty,
          null,
          "#688355",
          2.4,
        );
        leaf(g, topx * 0.75, ty + 9, 21, 6, -0.7 - j * 0.12, greens);
        leaf(g, topx * 0.65, ty + 13, 20, 6, -2.4 + j * 0.09, greens);
        if (flowers) {
          for (let k = 0; k < 5; k++) {
            let a = k * 1.257;
            oval(
              g,
              topx + 5 * Math.cos(a),
              ty + 5 * Math.sin(a),
              5,
              3.7,
              "#ffdfae",
              a,
            );
          }
          oval(g, topx, ty, 2.6, 2.6, "#c49446");
        }
      }
      const clay = grad(g, -39, -40, 38, -32, [
        [0, palette[0]],
        [0.24, palette[1]],
        [0.75, palette[1]],
        [1, palette[0]],
      ]);
      path(g, "M-38 -52 L-31 -10 Q-29 0 0 1 Q28 1 31 -9 L38 -52Z", clay);
      path(g, "M-37 -44 Q0 -34 37 -44", null, palette[0], 2);
      path(
        g,
        "M-42 -58 Q0 -70 42 -58 L40 -46 Q0 -34 -40 -46Z",
        clay,
        palette[0],
        1.2,
      );
      oval(g, 0, -58, 41, 7, palette[1]);
      oval(g, 0, -59, 35, 4, "#675643");
      g.restore();
    }
    const bg = document.createElement("canvas");
    bg.width = 1120;
    bg.height = 640;
    const back = bg.getContext("2d");
    back.scale(2, 2);
    function nursery(g) {
      g.fillStyle = grad(g, 0, 0, 560, 260, [
        [0, "#faf1cd"],
        [1, "#ded4a3"],
      ]);
      g.fillRect(0, 0, 560, 320);
      g.save();
      const arch = new Path2D("M-10 187V89Q89 -8 275 -20Q448 -11 570 76V187Z");
      g.clip(arch);
      g.fillStyle = grad(g, 0, 0, 0, 185, [
        [0, "#afd1c2"],
        [0.7, "#e3e8bc"],
        [1, "#b6ca9c"],
      ]);
      g.fillRect(0, 0, 560, 190);
      g.fillStyle = glaze(g, 116, 56, 72, "#fffbd1", "#fff3bb00");
      g.fillRect(35, 0, 162, 148);
      for (let i = 0; i < 20; i++) {
        const x = i * 34 - 25;
        oval(
          g,
          x,
          172 + 13 * Math.sin(i * 2),
          46,
          48 + (i % 3) * 10,
          i % 2 ? "#b1c398" : "#c5d1a2",
        );
      }
      for (const x of [15, 114, 225, 336, 445, 545]) {
        g.fillStyle = "#d2c59b";
        g.fillRect(x, 0, 6, 190);
        g.fillStyle = "#f5e8c5";
        g.fillRect(x, 0, 2, 190);
      }
      g.fillStyle = "#e9dbb8";
      g.fillRect(0, 76, 560, 5);
      g.restore();
      g.fillStyle = "#c9ae84";
      g.fillRect(0, 185, 560, 7);
      g.fillStyle = grad(g, 0, 192, 0, 320, [
        [0, "#ecd7b1"],
        [1, "#f8e7c7"],
      ]);
      g.fillRect(0, 192, 560, 128);
      for (let j = 0; j < 4; j++) {
        const y = 206 + j * j * 10;
        path(g, "M0 " + y + " L560 " + y, null, "#d7bf984f", 1);
        path(
          g,
          "M" + (j * 97 + 42) + " " + y + " l-12 16",
          null,
          "#d7bf984f",
          1,
        );
      }
      path(g, "M95 0 L175 0 L486 320 L345 320Z", "#fff4c536");
      for (let j = 0; j < 3; j++) {
        const x = j === 0 ? 15 : j === 1 ? 492 : 535,
          len = 6 + j;
        path(g, "M" + x + " -8 q-9 28 2 " + len * 6, null, "#728c60", 2);
        for (let k = 0; k < len; k++)
          leaf(g, x - 3, k * 6, 14 - k * 0.8, 4.5, k % 2 ? 1.1 : 2.6, [
            "#789367",
            "#a4b680",
          ]);
      }
      g.save();
      g.translate(49, 216);
      g.rotate(-0.08);
      oval(g, 3, 2, 34, 5, "#977b5340");
      path(
        g,
        "M-20 -48 Q0 -43 23 -49 L18 -39 Q42 -9 29 -2 Q0 4 -30 -2 Q-37 -10 -16 -38Z",
        grad(g, -30, -30, 31, 0, [
          [0, "#ae8e65"],
          [0.4, "#ddbe8e"],
          [1, "#af9068"],
        ]),
        "#a18763",
      );
      path(g, "M-20 -39 Q2 -36 20 -40", null, "#796b4e", 2);
      oval(g, 0, -18, 10, 9, "#ece0b7");
      leaf(g, -4, -16, 10, 3, -0.65, ["#698053", "#93a26b"]);
      g.restore();
    }
    nursery(back);
    const fits = {
      idle: [
        [949, 163, 0.7, 0.028],
        [1083, 345, 0.66, -0.055],
      ],
      sniff: [
        [1090, 437, 0.605, 0.3],
        [1153, 685, 0.455, 0.141],
      ],
      bat: [
        [825, 170, 0.6, -0.17],
        [994, 259, 0.501, -0.26],
      ],
    };
    function accessory(key, f) {
      if (!outfit.includes(key)) return;
      const g = ctx;
      g.save();
      g.translate(f[0], f[1]);
      g.rotate(f[3]);
      g.scale(f[2], f[2]);
      if (key === "hat") g.drawImage(sprites.hat, -272, -177, 883, 506);
      else g.drawImage(sprites.glasses, -271, -137, 660, 265);
      g.restore();
    }
    function cat(p, x, y, angle, squish = 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(0.145, 0.145 * squish);
      ctx.translate(-780, -985);
      ctx.drawImage(sprites[p], 0, 0, 1536, 1024);
      accessory("hat", fits[p][0]);
      accessory("glasses", fits[p][1]);
      ctx.restore();
    }
    function walk(x, y, t) {
      const im = sprites.walk,
        i = [0, 6, 2, 7, 3, 5, 1, 4][Math.floor(t * 10) % 8],
        w = im.width / 4,
        h = im.height / 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.drawImage(
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
      accessory("hat", [20, -117, 0.11, -0.12]);
      accessory("glasses", [40, -98, 0.094, -0.05]);
      ctx.restore();
    }
    function mouse(x, y, dir, t) {
      const g = ctx;
      g.save();
      g.translate(x, y);
      g.scale(dir, 1);
      const wiggle = reduced.matches ? 0 : Math.sin(t * 19);
      path(
        g,
        "M-15 -6 Q-31 " + (-11 + wiggle * 4) + " -35 -3 T-45 -4",
        null,
        "#a87679",
        2.7,
      );
      for (const [x1, f] of [
        [-10, 1],
        [9, -1],
      ])
        oval(g, x1 + 2 * wiggle * f, 0, 5, 2.1, "#be8c82", wiggle * 0.12);
      g.translate(0, -Math.abs(wiggle) * 1.1);
      const fur = grad(g, -6, -23, 5, -1, [
        [0, "#cbbdb1"],
        [0.45, "#a89f9b"],
        [1, "#827b7d"],
      ]);
      oval(g, -2, -10, 19, 12, fur, -0.13);
      path(g, "M3 -16Q12 -27 22 -16L30 -10Q25 -4 10 -4Q4 -4 3 -16Z", fur);
      oval(g, 12, -22, 5.8, 7.4, "#a49b9c", -0.3);
      oval(g, 12, -22, 3.8, 4.9, "#e2b8ad", -0.3);
      oval(g, 20, -14, 2.6, 3.2, "#362c2a");
      oval(g, 20.9, -15.3, 0.85, 1, "#fff4d6");
      oval(g, 29, -10, 2.4, 1.9, "#986864");
      for (let i = 0; i < 2; i++)
        path(g, "M23 -9 l11 " + (i * 5 - 3), null, "#746c67", 0.75);
      g.restore();
    }
    const L = 285,
      R = 461,
      center = (L + R) / 2,
      clamp = (v) => Math.max(0, Math.min(1, v)),
      mix = (a, b, u) => a + (b - a) * u;
    let mode = "run",
      t = 0,
      attempt = 1,
      dir = 1,
      wind = 0.9,
      raf = 0,
      stamp = null,
      lunge = null,
      windowOn = false;
    const intro = 1.5,
      cross = 2.65;
    function crossU() {
      return clamp((t - intro - wind) / cross);
    }
    function mouseX(u) {
      return dir > 0 ? mix(L, R, u) : mix(R, L, u);
    }

    function frame() {
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.drawImage(bg, 0, 0, 560, 320);
      let x = 136,
        y = 265,
        p = "idle",
        tilt = 0,
        compress = 1,
        mx = L + 19,
        face = 1,
        showMouse = true,
        steps = false;
      if (mode === "run") {
        const u = crossU();
        face = dir;
        mx = mouseX(u);
        if (t < intro) {
          x = reduced.matches ? 136 : mix(-55, 136, clamp(t / intro));
          steps = !reduced.matches;
          showMouse = false;
        } else {
          p = "sniff";
          const wig = reduced.matches
            ? 0
            : Math.sin(Math.PI * 4 * clamp((t - intro) / wind));
          tilt = 0.024 * wig;
          compress = 0.94 + 0.025 * wig;
          if (t < intro + wind) {
            mx =
              mouseX(0) -
              dir * 12 * Math.sin(Math.PI * clamp((t - intro) / wind));
            face = -dir;
          }
        }
      } else if (mode === "jump" || mode === "finish") {
        const u = mode === "finish" ? 1 : clamp(t / 0.85);
        x = mix(136, lunge.land, u);
        y -= reduced.matches ? 0 : 63 * Math.sin(Math.PI * u);
        p = u < 0.82 ? "bat" : lunge.ok ? "idle" : "sniff";
        tilt = reduced.matches ? 0 : -0.12 * Math.sin(Math.PI * u);
        face = lunge.dir;
        mx = mix(lunge.start, lunge.ok ? (face > 0 ? 614 : -58) : mouseX(1), u);
        showMouse = u < 0.95;
      } else if (mode === "retry") {
        p = "sniff";
        mx = mouseX(0);
      }
      oval(ctx, x, 268, 58 - (265 - y) * 0.28, 6, "#8d67412c");
      if (steps) walk(x, y, t);
      else cat(p, x, y, tilt, compress);
      if (showMouse) {
        oval(ctx, mx, 280, 18, 3.8, "#88664435");
        mouse(mx, 278, face, mode === "ready" ? 0 : t);
      }
      pot(ctx, L, 281, 0.88, ["#a2684a", "#cf936f"], true);
      pot(ctx, R, 281, 0.98, ["#8c7855", "#b9a271"], false);
    }

    function phrase(ar, en) {
      return options.language() === "ar" ? ar : en;
    }
    function setText(node, value) {
      if (node.textContent !== value) node.textContent = value;
    }
    function labels() {
      const name = options.name();
      let message;
      if (failed)
        message = phrase(
          "ما تحمّلت رسومات المطاردة.",
          "The chase artwork could not load.",
        );
      else if (!loaded)
        message = phrase("عم تجهز المطاردة…", "Getting the chase ready…");
      else if (mode === "retry")
        message = phrase(
          "انتبه… رح ترجع من الأصيص التاني.",
          "Watch the other pot. The mouse is coming back!",
        );
      else if (mode === "jump")
        message = lunge.ok
          ? phrase("لحقتها " + name + "!", name + " spotted the mouse!")
          : lunge.reason === "early"
            ? phrase(
                "بكّرت! الفارة بعدها عند الأصيص.",
                "Too soon! The mouse is still by the pot.",
              )
            : phrase(
                "سبقتك الفارة واختبت.",
                "Too late! The mouse slipped behind the pot.",
              );
      else if (windowOn)
        message = phrase(
          "هلّق! الفارة بين الأصيصين.",
          "Now! The mouse is between the pots.",
        );
      else if (crossU() > 0.73)
        message = phrase(
          "الفارة قربت من الأصيص التاني!",
          "The mouse is almost at the other pot!",
        );
      else
        message = phrase(
          "راقب ديل الفارة. اكبس لما تصير بنص الفراغ.",
          "Watch for the tail. Pounce when the mouse reaches the middle.",
        );
      setText(hint, message);
      setText(
        tries,
        attempt === 1
          ? phrase("المحاولة الأولى", "First pass")
          : phrase("الفرصة التانية", "Second chance"),
      );
      setText(
        button,
        failed
          ? phrase("جرّب التحميل من جديد", "Retry loading")
          : phrase("انقضّي!", "Pounce!"),
      );
      button.disabled = !failed && (!loaded || mode !== "run");
      canvas.setAttribute(
        "aria-label",
        phrase(
          name + " بتراقب الفارة بين الأصص.",
          name + " watches the mouse between the pots.",
        ),
      );
    }
    function snapshot() {
      if (current) Object.assign(current, { mode, t, attempt, lunge });
    }
    function jump(ok, u, reason) {
      lunge = {
        ok,
        dir,
        start: mouseX(u),
        land: ok ? center : mouseX(u) - 40,
        reason,
      };
      mode = "jump";
      t = 0;
      windowOn = false;
      snapshot();
      options.save();
      labels();
    }
    function update(dt) {
      t += dt;
      if (mode === "run") {
        const u = crossU();
        windowOn = u >= 0.27 && u <= 0.73;
        if (t >= intro + wind + cross) jump(false, 1, "late");
      } else if (mode === "jump" && t >= 0.95) {
        if (lunge.ok || attempt === 2) {
          const success = lunge.ok;
          options.finish(success);
          return;
        }
        mode = "retry";
        t = 0;
        attempt = 2;
        dir = -1;
        wind = 0.65;
      } else if (mode === "retry" && t >= 0.92) {
        mode = "run";
        t = intro;
        windowOn = false;
      }
      snapshot();
      labels();
    }
    function visible() {
      return !document.hidden && options.visible() && !root.hidden;
    }
    function loop() {
      if (raf || !current || !loaded || !visible()) return;
      raf = requestAnimationFrame((now) => {
        raf = 0;
        if (!current || !visible()) {
          stamp = null;
          return;
        }
        if (stamp !== null && now - stamp < 32) {
          loop();
          return;
        }
        const dt = stamp === null ? 0 : Math.min(0.15, (now - stamp) / 1000);
        stamp = now;
        update(dt);
        if (current) {
          frame();
          loop();
        }
      });
    }
    function sync(round) {
      if (round !== current) {
        current = round;
        stamp = null;
        if (round) {
          mode = round.mode || "run";
          t = round.t || 0;
          attempt = round.attempt || 1;
          lunge = round.lunge || null;
          dir = attempt === 2 ? -1 : 1;
          wind = attempt === 2 ? 0.65 : 0.95;
          windowOn = false;
        }
      }
      root.hidden = !round;
      if (!round || !visible()) {
        cancelAnimationFrame(raf);
        raf = 0;
        stamp = null;
        return;
      }
      outfit = options.outfit();
      labels();
      if (loaded) {
        if (!raf) frame();
        loop();
      } else if (!loading && !failed) load();
    }
    async function load() {
      loading = true;
      failed = false;
      labels();
      try {
        await Promise.all(
          ["idle", "sniff", "bat", "walk", "hat", "glasses"].map(
            async (key) => {
              const img = new Image();
              img.src = new URL(key + ".webp", assetRoot).href;
              await img.decode();
              sprites[key] = img;
            },
          ),
        );
        loaded = true;
      } catch {
        failed = true;
      }
      loading = false;
      sync(options.round());
    }
    button.onclick = () => {
      if (failed) {
        load();
        return;
      }
      if (!current || !visible() || mode !== "run" || !loaded) return;
      const u = crossU();
      jump(u >= 0.27 && u <= 0.73, u, u < 0.27 ? "early" : "late");
      frame();
    };
    document.addEventListener("visibilitychange", () => sync(options.round()));
    // Remaining time in the current pass, paused whenever the hunt is off screen.
    function secondsLeft() {
      if (!current) return 0;
      if (mode === "jump") return Math.max(0, Math.ceil(0.95 - t));
      if (mode === "retry") return Math.max(0, Math.ceil(0.92 - t));
      return Math.max(0, Math.ceil(intro + wind + cross - t));
    }
    return { sync, secondsLeft };
  };
})();
