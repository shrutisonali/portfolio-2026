/* ============================================
   NARUTO-RUNNER.JS — Chrome T-Rex Game (Naruto skin)
   Adapted from trex-runner.com for native integration
   ============================================ */

(function() {
  // Only define if not already defined
  if (window.__NarutoRunnerDefined) return;
  window.__NarutoRunnerDefined = true;

  var k = 0;

  function g(A, z) {
    if (g.instance_) {
      // Reset existing instance for re-init
      g.instance_.stopListening();
      cancelAnimationFrame(g.instance_.raqId);
      g.instance_ = null;
    }
    g.instance_ = this;
    this.outerContainerEl = typeof A === 'string' ? document.querySelector(A) : A;
    this.containerEl = null;
    this.snackbarEl = null;
    this.config = z || g.config;
    this.dimensions = Object.assign({}, g.defaultDimensions);
    this.canvas = null;
    this.canvasCtx = null;
    this.tRex = null;
    this.distanceMeter = null;
    this.distanceRan = 0;
    this.highestScore = parseInt(localStorage.getItem('naruto-runner-hi') || '0', 10) / 0.025 || 0;
    this.time = 0;
    this.runningTime = 0;
    this.msPerFrame = 1000 / d;
    this.currentSpeed = this.config.SPEED;
    this.obstacles = [];
    this.started = false;
    this.activated = false;
    this.crashed = false;
    this.paused = false;
    this.resizeTimerId_ = null;
    this.playCount = 0;
    this.audioBuffer = null;
    this.soundFx = {};
    this.audioContext = null;
    this.images = {};
    this.imagesLoaded = 0;
    this.muteSnd = true; // muted by default in overlay
    this.gamepadPreviousKeyDown = false;
    this.loadImages();
  }

  // Expose for overlay integration
  window.NarutoRunnerGame = g;

  var e = 600;
  var d = 60;
  var f = window.devicePixelRatio > 1;
  var r = window.navigator.userAgent.indexOf("CriOS") > -1 || window.navigator.userAgent == "UIWebViewForStaticFileContent";
  var n = window.navigator.userAgent.indexOf("Mobi") > -1 || r || "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  var h = "ontouchstart" in window;

  g.config = {
    ACCELERATION: 0.001,
    BG_CLOUD_SPEED: 0.2,
    BOTTOM_PAD: 10,
    CLEAR_TIME: 3000,
    CLOUD_FREQUENCY: 0.5,
    GAMEOVER_CLEAR_TIME: 750,
    GAP_COEFFICIENT: 0.6,
    GRAVITY: 0.6,
    INITIAL_JUMP_VELOCITY: 12,
    MAX_CLOUDS: 6,
    MAX_OBSTACLE_LENGTH: 3,
    MAX_OBSTACLE_DUPLICATION: 2,
    MAX_SPEED: 13,
    MIN_JUMP_HEIGHT: 35,
    MOBILE_SPEED_COEFFICIENT: 1.2,
    RESOURCE_TEMPLATE_ID: "audio-resources",
    SPEED: 6,
    SPEED_DROP_COEFFICIENT: 3
  };

  g.defaultDimensions = { WIDTH: e, HEIGHT: 150 };

  g.classes = {
    CANVAS: "runner-canvas",
    CONTAINER: "runner-container",
    CRASHED: "crashed",
    ICON: "icon-offline",
    SNACKBAR: "snackbar",
    SNACKBAR_SHOW: "snackbar-show",
    TOUCH_CONTROLLER: "controller"
  };

  g.spriteDefinition = {
    LDPI: {
      CACTUS_LARGE: { x: 332, y: 2 },
      CACTUS_SMALL: { x: 228, y: 2 },
      CLOUD: { x: 86, y: 2 },
      HORIZON: { x: 2, y: 54 },
      PTERODACTYL: { x: 134, y: 2 },
      RESTART: { x: 2, y: 2 },
      TEXT_SPRITE: { x: 484, y: 2 },
      TREX: { x: 677, y: 2 }
    },
    HDPI: {
      CACTUS_LARGE: { x: 652, y: 2 },
      CACTUS_SMALL: { x: 446, y: 2 },
      CLOUD: { x: 166, y: 2 },
      HORIZON: { x: 2, y: 104 },
      PTERODACTYL: { x: 260, y: 2 },
      RESTART: { x: 2, y: 2 },
      TEXT_SPRITE: { x: 954, y: 2 },
      TREX: { x: 1338, y: 2 }
    }
  };

  g.sounds = {
    BUTTON_PRESS: "offline-sound-press",
    HIT: "offline-sound-hit",
    SCORE: "offline-sound-reached"
  };

  g.keycodes = {
    JUMP: { "38": 1, "32": 1 },
    DUCK: { "40": 1 },
    RESTART: { "13": 1 }
  };

  g.events = {
    ANIM_END: "webkitAnimationEnd",
    CLICK: "click",
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    MOUSEDOWN: "mousedown",
    MOUSEUP: "mouseup",
    RESIZE: "resize",
    TOUCHEND: "touchend",
    TOUCHSTART: "touchstart",
    VISIBILITY: "visibilitychange",
    BLUR: "blur",
    FOCUS: "focus",
    LOAD: "load",
    GAMEPADCONNECTED: "gamepadconnected"
  };

  g.prototype = {
    updateConfigSetting: function(z, A) {
      if (z in this.config && A != undefined) {
        this.config[z] = A;
        switch (z) {
          case "GRAVITY":
          case "MIN_JUMP_HEIGHT":
          case "SPEED_DROP_COEFFICIENT":
            this.tRex.config[z] = A;
            break;
          case "INITIAL_JUMP_VELOCITY":
            this.tRex.setJumpVelocity(A);
            break;
          case "SPEED":
            this.setSpeed(A);
            break;
        }
      }
    },
    loadImages: function() {
      // Use images from our assets folder
      var img1x = document.getElementById("naruto-sprite-1x");
      var img2x = document.getElementById("naruto-sprite-2x");
      if (f && img2x) {
        g.imageSprite = img2x;
        this.spriteDef = g.spriteDefinition.HDPI;
      } else if (img1x) {
        g.imageSprite = img1x;
        this.spriteDef = g.spriteDefinition.LDPI;
      }
      if (g.imageSprite) {
        this.init();
      }
    },
    loadSounds: function() {
      // Sound loading - use embedded audio elements
      if (!r) {
        try {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext || false);
          var sounds = ['offline-sound-press', 'offline-sound-hit', 'offline-sound-reached'];
          var self = this;
          sounds.forEach(function(id) {
            var el = document.getElementById(id);
            if (el && el.src) {
              var src = el.src;
              src = src.substr(src.indexOf(",") + 1);
              var buf = c(src);
              self.audioContext.decodeAudioData(buf, function(name, decoded) {
                self.soundFx[name] = decoded;
              }.bind(null, id === 'offline-sound-press' ? 'BUTTON_PRESS' : id === 'offline-sound-hit' ? 'HIT' : 'SCORE'));
            }
          });
        } catch(e) {}
      }
    },
    setSpeed: function(z) {
      var B = z || this.currentSpeed;
      if (this.dimensions.WIDTH < e) {
        var A = B * this.dimensions.WIDTH / e * this.config.MOBILE_SPEED_COEFFICIENT;
        this.currentSpeed = A > B ? B : A;
      } else if (z) {
        this.currentSpeed = z;
      }
    },
    init: function() {
      this.adjustDimensions();
      this.setSpeed();
      this.containerEl = document.createElement("div");
      this.containerEl.className = g.classes.CONTAINER;
      this.canvas = w(this.containerEl, this.dimensions.WIDTH, this.dimensions.HEIGHT, g.classes.PLAYER);
      this.canvasCtx = this.canvas.getContext("2d");
      this.canvasCtx.fillStyle = "#f7f7f7";
      this.canvasCtx.fill();
      g.updateCanvasScaling(this.canvas);
      this.horizon = new v(this.canvas, this.spriteDef, this.dimensions, this.config.GAP_COEFFICIENT);
      this.distanceMeter = new t(this.canvas, this.spriteDef.TEXT_SPRITE, this.dimensions.WIDTH);
      this.tRex = new i(this.canvas, this.spriteDef.TREX);
      this.outerContainerEl.appendChild(this.containerEl);
      if (n) { this.createTouchController(); }
      this.startListening();
      this.update();
      window.addEventListener(g.events.RESIZE, this.debounceResize.bind(this));
    },
    createTouchController: function() {
      this.touchController = document.createElement("div");
      this.touchController.className = g.classes.TOUCH_CONTROLLER;
    },
    debounceResize: function() {
      if (!this.resizeTimerId_) {
        this.resizeTimerId_ = setInterval(this.adjustDimensions.bind(this), 250);
      }
    },
    adjustDimensions: function() {
      clearInterval(this.resizeTimerId_);
      this.resizeTimerId_ = null;
      var z = window.getComputedStyle(this.outerContainerEl);
      var A = Number(z.paddingLeft.substr(0, z.paddingLeft.length - 2));
      this.dimensions.WIDTH = this.outerContainerEl.offsetWidth - A * 2;
      if (this.canvas) {
        this.canvas.width = this.dimensions.WIDTH;
        this.canvas.height = this.dimensions.HEIGHT;
        g.updateCanvasScaling(this.canvas);
        this.distanceMeter.calcXPos(this.dimensions.WIDTH);
        this.clearCanvas();
        this.horizon.update(0, 0, true);
        this.tRex.update(0);
        if (this.activated || this.crashed || this.paused) {
          this.containerEl.style.width = this.dimensions.WIDTH + "px";
          this.containerEl.style.height = this.dimensions.HEIGHT + "px";
          this.distanceMeter.update(0, Math.ceil(this.distanceRan));
          this.stop();
        } else {
          this.tRex.draw(0, 0);
        }
        if (this.crashed && this.gameOverPanel) {
          this.gameOverPanel.updateDimensions(this.dimensions.WIDTH);
          this.gameOverPanel.draw();
        }
      }
    },
    playIntro: function() {
      if (!this.started && !this.crashed) {
        this.playingIntro = true;
        this.tRex.playingIntro = true;
        var z = "@-webkit-keyframes intro { from { width:" + i.config.WIDTH + "px }to { width: " + this.dimensions.WIDTH + "px }}";
        try { document.styleSheets[0].insertRule(z, 0); } catch(e) {}
        var startBound = this.startGame.bind(this);
        this.containerEl.addEventListener(g.events.ANIM_END, startBound);
        this.containerEl.addEventListener("animationend", startBound);
        // Fallback if animation event never fires
        setTimeout(startBound, 500);
        this.containerEl.style.webkitAnimation = "intro .4s ease-out 1 both";
        this.containerEl.style.animation = "intro .4s ease-out 1 both";
        this.containerEl.style.width = this.dimensions.WIDTH + "px";
        if (this.touchController) { this.outerContainerEl.appendChild(this.touchController); }
        this.activated = true;
        this.started = true;
      } else if (this.crashed) {
        this.restart();
      }
    },
    startGame: function() {
      this.runningTime = 0;
      this.playingIntro = false;
      this.tRex.playingIntro = false;
      this.containerEl.style.webkitAnimation = "";
      this.playCount++;
    },
    clearCanvas: function() {
      this.canvasCtx.clearRect(0, 0, this.dimensions.WIDTH, this.dimensions.HEIGHT);
    },
    update: function() {
      this.drawPending = false;
      var B = p();
      var A = B - (this.time || B);
      this.time = B;
      if (this.activated) {
        this.clearCanvas();
        if (this.tRex.jumping) { this.tRex.updateJump(A); }
        this.runningTime += A;
        var z = this.runningTime > this.config.CLEAR_TIME;
        if (this.tRex.jumpCount == 1 && !this.playingIntro) { this.playIntro(); }
        if (this.playingIntro) {
          this.horizon.update(0, this.currentSpeed, z);
        } else {
          A = !this.started ? 0 : A;
          this.horizon.update(A, this.currentSpeed, z);
        }
        var D = z && u(this.horizon.obstacles[0], this.tRex);
        if (!D) {
          this.distanceRan += this.currentSpeed * A / this.msPerFrame;
          if (this.currentSpeed < this.config.MAX_SPEED) {
            this.currentSpeed += this.config.ACCELERATION;
          }
        } else {
          this.gameOver();
        }
        var C = this.distanceMeter.update(A, Math.ceil(this.distanceRan));
        if (C && !this.muteSnd) { this.playSound(this.soundFx.SCORE); }
      }
      if (!this.crashed) {
        this.tRex.update(A);
        this.raq();
      }
    },
    handleEvent: function(z) {
      return (function(B, A) {
        switch (B) {
          case A.KEYDOWN:
          case A.TOUCHSTART:
          case A.MOUSEDOWN:
          case A.GAMEPADCONNECTED:
            this.onKeyDown(z);
            break;
          case A.KEYUP:
          case A.TOUCHEND:
          case A.MOUSEUP:
            this.onKeyUp(z);
            break;
        }
      }.bind(this))(z.type, g.events);
    },
    startListening: function() {
      document.addEventListener(g.events.KEYDOWN, this);
      document.addEventListener(g.events.KEYUP, this);
      if (n) {
        if (this.touchController) {
          this.touchController.addEventListener(g.events.TOUCHSTART, this);
          this.touchController.addEventListener(g.events.TOUCHEND, this);
        }
        this.containerEl.addEventListener(g.events.TOUCHSTART, this);
      } else {
        document.addEventListener(g.events.MOUSEDOWN, this);
        document.addEventListener(g.events.MOUSEUP, this);
      }
    },
    stopListening: function() {
      document.removeEventListener(g.events.KEYDOWN, this);
      document.removeEventListener(g.events.KEYUP, this);
      if (n) {
        if (this.touchController) {
          this.touchController.removeEventListener(g.events.TOUCHSTART, this);
          this.touchController.removeEventListener(g.events.TOUCHEND, this);
        }
        this.containerEl.removeEventListener(g.events.TOUCHSTART, this);
      } else {
        document.removeEventListener(g.events.MOUSEDOWN, this);
        document.removeEventListener(g.events.MOUSEUP, this);
      }
    },
    onKeyDown: function(z) {
      if (n) { z.preventDefault(); }
      if (!this.crashed && (g.keycodes.JUMP[z.keyCode] || z.type == g.events.TOUCHSTART || z.type == g.events.GAMEPADCONNECTED)) {
        if (!this.activated) {
          this.loadSounds();
          this.activated = true;
        }
        if (!this.tRex.jumping && !this.tRex.ducking) {
          if (!this.muteSnd) { this.playSound(this.soundFx.BUTTON_PRESS); }
          this.tRex.startJump(this.currentSpeed);
        }
      }
      if (this.crashed && z.type == g.events.TOUCHSTART && z.currentTarget == this.containerEl) {
        this.restart();
      }
      if (this.activated && !this.crashed && g.keycodes.DUCK[z.keyCode]) {
        z.preventDefault();
        if (this.tRex.jumping) {
          this.tRex.setSpeedDrop();
        } else if (!this.tRex.jumping && !this.tRex.ducking) {
          this.tRex.setDuck(true);
        }
      }
    },
    onKeyUp: function(C) {
      var B = String(C.keyCode);
      var A = g.keycodes.JUMP[B] || C.type == g.events.TOUCHEND || C.type == g.events.MOUSEDOWN;
      if (this.isRunning() && A) {
        this.tRex.endJump();
      } else if (g.keycodes.DUCK[B]) {
        this.tRex.speedDrop = false;
        this.tRex.setDuck(false);
      } else if (this.crashed) {
        var z = p() - this.time;
        if (g.keycodes.RESTART[B] || this.isLeftClickOnCanvas(C) || (z >= this.config.GAMEOVER_CLEAR_TIME && g.keycodes.JUMP[B])) {
          this.restart();
        }
      } else if (this.paused && A) {
        this.tRex.reset();
        this.play();
      }
    },
    isLeftClickOnCanvas: function(z) {
      return z.button != null && z.button < 2 && z.type == g.events.MOUSEUP && z.target == this.canvas;
    },
    raq: function() {
      if (!this.drawPending) {
        this.drawPending = true;
        this.raqId = requestAnimationFrame(this.update.bind(this));
      }
    },
    isRunning: function() { return !!this.raqId; },
    gameOver: function() {
      if (!this.muteSnd) { this.playSound(this.soundFx.HIT); }
      b(200);
      this.stop();
      this.crashed = true;
      this.distanceMeter.acheivement = false;
      this.tRex.update(100, i.status.CRASHED);
      if (!this.gameOverPanel) {
        this.gameOverPanel = new s(this.canvas, this.spriteDef.TEXT_SPRITE, this.spriteDef.RESTART, this.dimensions);
      } else {
        this.gameOverPanel.draw();
      }
      if (this.distanceRan > this.highestScore) {
        this.highestScore = Math.ceil(this.distanceRan);
        this.distanceMeter.setHighScore(this.highestScore);
        var hi = Math.round(this.highestScore * 0.025);
        localStorage.setItem('naruto-runner-hi', String(hi));
      }
      this.time = p();
    },
    stop: function() {
      this.activated = false;
      this.paused = true;
      cancelAnimationFrame(this.raqId);
      this.raqId = 0;
    },
    play: function() {
      if (!this.crashed) {
        this.activated = true;
        this.paused = false;
        this.tRex.update(0, i.status.RUNNING);
        this.time = p();
        this.update();
      }
    },
    restart: function() {
      if (!this.raqId) {
        this.playCount++;
        this.runningTime = 0;
        this.activated = true;
        this.crashed = false;
        this.distanceRan = 0;
        this.setSpeed(this.config.SPEED);
        this.time = p();
        this.containerEl.classList.remove(g.classes.CRASHED);
        this.clearCanvas();
        this.distanceMeter.reset(this.highestScore);
        this.horizon.reset();
        this.tRex.reset();
        if (!this.muteSnd) { this.playSound(this.soundFx.BUTTON_PRESS); }
        this.update();
      }
    },
    onVisibilityChange: function(z) {
      // Only pause if tab is truly hidden, not on blur within page
      if (document.hidden || document.webkitHidden) {
        this.stop();
      } else if (!this.crashed) {
        this.tRex.reset();
        this.play();
      }
    },
    playSound: function(A) {
      if (A && this.audioContext) {
        try {
          var z = this.audioContext.createBufferSource();
          z.buffer = A;
          z.connect(this.audioContext.destination);
          z.start(0);
        } catch(e) {}
      }
    },
    destroy: function() {
      this.stopListening();
      cancelAnimationFrame(this.raqId);
      this.raqId = 0;
      g.instance_ = null;
    }
  };

  g.updateCanvasScaling = function(B, z, F) {
    var A = B.getContext("2d");
    var G = Math.floor(window.devicePixelRatio) || 1;
    var D = 1;
    var E = G / D;
    if (G !== D) {
      var C = z || B.width;
      var H = F || B.height;
      B.width = C * E;
      B.height = H * E;
      B.style.width = C + "px";
      B.style.height = H + "px";
      A.scale(E, E);
      return true;
    } else if (G == 1) {
      B.style.width = B.width + "px";
      B.style.height = B.height + "px";
    }
    return false;
  };

  function l(A, z) { return Math.floor(Math.random() * (z - A + 1)) + A; }
  function b(z) { if (n && window.navigator.vibrate) { window.navigator.vibrate(z); } }

  function w(A, C, z, D) {
    var B = document.createElement("canvas");
    B.className = D ? g.classes.CANVAS + " " + D : g.classes.CANVAS;
    B.width = C;
    B.height = z;
    A.appendChild(B);
    return B;
  }

  function c(E) {
    var z = (E.length / 4) * 3;
    var D = atob(E);
    var C = new ArrayBuffer(z);
    var A = new Uint8Array(C);
    for (var B = 0; B < z; B++) { A[B] = D.charCodeAt(B); }
    return A.buffer;
  }

  function p() { return r ? new Date().getTime() : performance.now(); }

  // Game Over Panel
  function s(A, B, z, C) {
    this.canvas = A;
    this.canvasCtx = A.getContext("2d");
    this.canvasDimensions = C;
    this.textImgPos = B;
    this.restartImgPos = z;
    this.draw();
  }
  s.dimensions = { TEXT_X: 0, TEXT_Y: 13, TEXT_WIDTH: 191, TEXT_HEIGHT: 11, RESTART_WIDTH: 36, RESTART_HEIGHT: 32 };
  s.prototype = {
    updateDimensions: function(z, A) { this.canvasDimensions.WIDTH = z; if (A) this.canvasDimensions.HEIGHT = A; },
    draw: function() {
      var z = s.dimensions;
      var B = this.canvasDimensions.WIDTH / 2;
      var J = z.TEXT_X, I = z.TEXT_Y, E = z.TEXT_WIDTH, H = z.TEXT_HEIGHT;
      var D = Math.round(B - (z.TEXT_WIDTH / 2));
      var C = Math.round((this.canvasDimensions.HEIGHT - 25) / 3);
      var A = z.TEXT_WIDTH, M = z.TEXT_HEIGHT;
      var G = z.RESTART_WIDTH, F = z.RESTART_HEIGHT;
      var L = B - (z.RESTART_WIDTH / 2), K = this.canvasDimensions.HEIGHT / 2;
      if (f) { I *= 2; J *= 2; E *= 2; H *= 2; G *= 2; F *= 2; }
      J += this.textImgPos.x; I += this.textImgPos.y;
      this.canvasCtx.drawImage(g.imageSprite, J, I, E, H, D, C, A, M);
      this.canvasCtx.drawImage(g.imageSprite, this.restartImgPos.x, this.restartImgPos.y, G, F, L, K, z.RESTART_WIDTH, z.RESTART_HEIGHT);
    }
  };

  // Collision detection
  function u(H, B, J) {
    if (!H) return false;
    var G = new o(B.xPos + 1, B.yPos + 1, B.config.WIDTH - 2, B.config.HEIGHT - 2);
    var I = new o(H.xPos + 1, H.yPos + 1, H.typeConfig.width * H.size - 2, H.typeConfig.height - 2);
    if (y(G, I)) {
      var z = H.collisionBoxes;
      var F = B.ducking ? i.collisionBoxes.DUCKING : i.collisionBoxes.RUNNING;
      for (var K = 0; K < F.length; K++) {
        for (var E = 0; E < z.length; E++) {
          var A = x(F[K], G);
          var C = x(z[E], I);
          if (y(A, C)) return [A, C];
        }
      }
    }
    return false;
  }
  function x(A, z) { return new o(A.x + z.x, A.y + z.y, A.width, A.height); }
  function y(z, B) { return z.x < B.x + B.width && z.x + z.width > B.x && z.y < B.y + B.height && z.height + z.y > B.y; }
  function o(z, C, A, B) { this.x = z; this.y = C; this.width = A; this.height = B; }

  // Obstacle
  function q(D, B, z, C, A, E) {
    this.canvasCtx = D; this.spritePos = z; this.typeConfig = B; this.gapCoefficient = A;
    this.size = l(1, q.MAX_OBSTACLE_LENGTH); this.dimensions = C;
    this.remove = false; this.xPos = 0; this.yPos = 0; this.width = 0;
    this.collisionBoxes = []; this.gap = 0; this.speedOffset = 0;
    this.currentFrame = 0; this.timer = 0;
    this.init(E);
  }
  q.MAX_GAP_COEFFICIENT = 1.5;
  q.MAX_OBSTACLE_LENGTH = 3;
  q.prototype = {
    init: function(z) {
      this.cloneCollisionBoxes();
      if (this.size > 1 && this.typeConfig.multipleSpeed > z) this.size = 1;
      this.width = this.typeConfig.width * this.size;
      this.xPos = this.dimensions.WIDTH - this.width;
      if (Array.isArray(this.typeConfig.yPos)) {
        var A = n ? this.typeConfig.yPosMobile : this.typeConfig.yPos;
        this.yPos = A[l(0, A.length - 1)];
      } else { this.yPos = this.typeConfig.yPos; }
      this.draw();
      if (this.size > 1) {
        this.collisionBoxes[1].width = this.width - this.collisionBoxes[0].width - this.collisionBoxes[2].width;
        this.collisionBoxes[2].x = this.width - this.collisionBoxes[2].width;
      }
      if (this.typeConfig.speedOffset) { this.speedOffset = Math.random() > 0.5 ? this.typeConfig.speedOffset : -this.typeConfig.speedOffset; }
      this.gap = this.getGap(this.gapCoefficient, z);
    },
    draw: function() {
      var z = this.typeConfig.width, A = this.typeConfig.height;
      if (f) { z *= 2; A *= 2; }
      var B = (z * this.size) * (0.5 * (this.size - 1)) + this.spritePos.x;
      if (this.currentFrame > 0) B += z * this.currentFrame;
      this.canvasCtx.drawImage(g.imageSprite, B, this.spritePos.y, z * this.size, A, this.xPos, this.yPos, this.typeConfig.width * this.size, this.typeConfig.height);
    },
    update: function(z, A) {
      if (!this.remove) {
        if (this.typeConfig.speedOffset) A += this.speedOffset;
        this.xPos -= Math.floor((A * d / 1000) * z);
        if (this.typeConfig.numFrames) {
          this.timer += z;
          if (this.timer >= this.typeConfig.frameRate) {
            this.currentFrame = this.currentFrame == this.typeConfig.numFrames - 1 ? 0 : this.currentFrame + 1;
            this.timer = 0;
          }
        }
        this.draw();
        if (!this.isVisible()) this.remove = true;
      }
    },
    getGap: function(B, C) { var A = Math.round(this.width * C + this.typeConfig.minGap * B); return l(A, Math.round(A * q.MAX_GAP_COEFFICIENT)); },
    isVisible: function() { return this.xPos + this.width > 0; },
    cloneCollisionBoxes: function() { var A = this.typeConfig.collisionBoxes; for (var z = A.length - 1; z >= 0; z--) this.collisionBoxes[z] = new o(A[z].x, A[z].y, A[z].width, A[z].height); }
  };

  q.types = [
    { type: "CACTUS_SMALL", width: 17, height: 35, yPos: 105, multipleSpeed: 4, minGap: 120, minSpeed: 0, collisionBoxes: [new o(0, 7, 5, 27), new o(4, 0, 6, 34), new o(10, 4, 7, 14)] },
    { type: "CACTUS_LARGE", width: 25, height: 50, yPos: 90, multipleSpeed: 7, minGap: 120, minSpeed: 0, collisionBoxes: [new o(0, 12, 7, 38), new o(8, 0, 7, 49), new o(13, 10, 10, 38)] },
    { type: "PTERODACTYL", width: 46, height: 40, yPos: [100, 75, 50], yPosMobile: [100, 50], multipleSpeed: 999, minSpeed: 8.5, minGap: 150, collisionBoxes: [new o(15, 15, 16, 5), new o(18, 21, 24, 6), new o(2, 14, 4, 3), new o(6, 10, 4, 7), new o(10, 8, 6, 9)], numFrames: 2, frameRate: 1000 / 6, speedOffset: 0.8 }
  ];

  // T-Rex (Naruto) character
  function i(A, z) {
    this.canvas = A; this.canvasCtx = A.getContext("2d"); this.spritePos = z;
    this.xPos = 0; this.yPos = 0; this.groundYPos = 0;
    this.currentFrame = 0; this.currentAnimFrames = []; this.blinkDelay = 0;
    this.animStartTime = 0; this.timer = 0; this.msPerFrame = 1000 / d;
    this.config = i.config; this.status = i.status.WAITING;
    this.jumping = false; this.ducking = false; this.jumpVelocity = 0;
    this.reachedMinHeight = false; this.speedDrop = false; this.jumpCount = 0; this.jumpspotX = 0;
    this.init();
  }
  i.config = { DROP_VELOCITY: -5, GRAVITY: 0.6, HEIGHT: 47, HEIGHT_DUCK: 25, INIITAL_JUMP_VELOCITY: -10, INTRO_DURATION: 1500, MAX_JUMP_HEIGHT: 30, MIN_JUMP_HEIGHT: 30, SPEED_DROP_COEFFICIENT: 3, SPRITE_WIDTH: 262, START_X_POS: 50, WIDTH: 44, WIDTH_DUCK: 59 };
  i.collisionBoxes = { DUCKING: [new o(1, 18, 55, 25)], RUNNING: [new o(22, 0, 17, 16), new o(1, 18, 30, 9), new o(10, 35, 14, 8), new o(1, 24, 29, 5), new o(5, 30, 21, 4), new o(9, 34, 15, 4)] };
  i.status = { CRASHED: "CRASHED", DUCKING: "DUCKING", JUMPING: "JUMPING", RUNNING: "RUNNING", WAITING: "WAITING" };
  i.BLINK_TIMING = 7000;
  i.animFrames = { WAITING: { frames: [44, 0], msPerFrame: 1000 / 3 }, RUNNING: { frames: [88, 132], msPerFrame: 1000 / 12 }, CRASHED: { frames: [220], msPerFrame: 1000 / 60 }, JUMPING: { frames: [0], msPerFrame: 1000 / 60 }, DUCKING: { frames: [262, 321], msPerFrame: 1000 / 8 } };

  i.prototype = {
    init: function() {
      this.blinkDelay = this.setBlinkDelay();
      this.groundYPos = g.defaultDimensions.HEIGHT - this.config.HEIGHT - g.config.BOTTOM_PAD;
      this.yPos = this.groundYPos;
      this.minJumpHeight = this.groundYPos - this.config.MIN_JUMP_HEIGHT;
      this.draw(0, 0);
      this.update(0, i.status.WAITING);
    },
    setJumpVelocity: function(z) { this.config.INIITAL_JUMP_VELOCITY = -z; this.config.DROP_VELOCITY = -z / 2; },
    update: function(z, A) {
      this.timer += z;
      if (A) {
        this.status = A; this.currentFrame = 0;
        this.msPerFrame = i.animFrames[A].msPerFrame;
        this.currentAnimFrames = i.animFrames[A].frames;
        if (A == i.status.WAITING) { this.animStartTime = p(); this.setBlinkDelay(); }
      }
      if (this.playingIntro && this.xPos < this.config.START_X_POS) { this.xPos += Math.round((this.config.START_X_POS / this.config.INTRO_DURATION) * z); }
      if (this.status == i.status.WAITING) { this.blink(p()); } else { this.draw(this.currentAnimFrames[this.currentFrame], 0); }
      if (this.timer >= this.msPerFrame) { this.currentFrame = this.currentFrame == this.currentAnimFrames.length - 1 ? 0 : this.currentFrame + 1; this.timer = 0; }
      if (this.speedDrop && this.yPos == this.groundYPos) { this.speedDrop = false; this.setDuck(true); }
    },
    draw: function(z, E) {
      var D = z, C = E;
      var A = this.ducking && this.status != i.status.CRASHED ? this.config.WIDTH_DUCK : this.config.WIDTH;
      var B = this.config.HEIGHT;
      if (f) { D *= 2; C *= 2; A *= 2; B *= 2; }
      D += this.spritePos.x; C += this.spritePos.y;
      if (this.ducking && this.status != i.status.CRASHED) {
        this.canvasCtx.drawImage(g.imageSprite, D, C, A, B, this.xPos, this.yPos, this.config.WIDTH_DUCK, this.config.HEIGHT);
      } else {
        if (this.ducking && this.status == i.status.CRASHED) this.xPos++;
        this.canvasCtx.drawImage(g.imageSprite, D, C, A, B, this.xPos, this.yPos, this.config.WIDTH, this.config.HEIGHT);
      }
    },
    setBlinkDelay: function() { this.blinkDelay = Math.ceil(Math.random() * i.BLINK_TIMING); },
    blink: function(A) {
      var z = A - this.animStartTime;
      if (z >= this.blinkDelay) {
        this.draw(this.currentAnimFrames[this.currentFrame], 0);
        if (this.currentFrame == 1) { this.setBlinkDelay(); this.animStartTime = A; }
      }
    },
    startJump: function(z) {
      if (!this.jumping) {
        this.update(0, i.status.JUMPING);
        this.jumpVelocity = this.config.INIITAL_JUMP_VELOCITY - (z / 10);
        this.jumping = true; this.reachedMinHeight = false; this.speedDrop = false;
      }
    },
    endJump: function() { if (this.reachedMinHeight && this.jumpVelocity < this.config.DROP_VELOCITY) this.jumpVelocity = this.config.DROP_VELOCITY; },
    updateJump: function(A) {
      var B = i.animFrames[this.status].msPerFrame;
      var z = A / B;
      if (this.speedDrop) { this.yPos += Math.round(this.jumpVelocity * this.config.SPEED_DROP_COEFFICIENT * z); }
      else { this.yPos += Math.round(this.jumpVelocity * z); }
      this.jumpVelocity += this.config.GRAVITY * z;
      if (this.yPos < this.minJumpHeight || this.speedDrop) this.reachedMinHeight = true;
      if (this.yPos < this.config.MAX_JUMP_HEIGHT || this.speedDrop) this.endJump();
      if (this.yPos > this.groundYPos) { this.reset(); this.jumpCount++; }
      this.update(A);
    },
    setSpeedDrop: function() { this.speedDrop = true; this.jumpVelocity = 1; },
    setDuck: function(z) {
      if (z && this.status != i.status.DUCKING) { this.update(0, i.status.DUCKING); this.ducking = true; }
      else if (this.status == i.status.DUCKING) { this.update(0, i.status.RUNNING); this.ducking = false; }
    },
    reset: function() { this.yPos = this.groundYPos; this.jumpVelocity = 0; this.jumping = false; this.ducking = false; this.update(0, i.status.RUNNING); this.midair = false; this.speedDrop = false; this.jumpCount = 0; }
  };

  // Distance Meter
  function t(B, A, z) {
    this.canvas = B; this.canvasCtx = B.getContext("2d"); this.image = g.imageSprite;
    this.spritePos = A; this.x = 0; this.y = 5; this.currentDistance = 0;
    this.maxScore = 0; this.highScore = 0; this.container = null; this.digits = [];
    this.acheivement = false; this.defaultString = ""; this.flashTimer = 0; this.flashIterations = 0;
    this.config = t.config; this.maxScoreUnits = this.config.MAX_DISTANCE_UNITS;
    this.init(z);
  }
  t.dimensions = { WIDTH: 10, HEIGHT: 13, DEST_WIDTH: 11 };
  t.yPos = [0, 13, 27, 40, 53, 67, 80, 93, 107, 120];
  t.config = { MAX_DISTANCE_UNITS: 5, ACHIEVEMENT_DISTANCE: 100, COEFFICIENT: 0.025, FLASH_DURATION: 1000 / 4, FLASH_ITERATIONS: 3 };
  t.prototype = {
    init: function(A) { var B = ""; this.calcXPos(A); this.maxScore = this.maxScoreUnits; for (var z = 0; z < this.maxScoreUnits; z++) { this.draw(z, 0); this.defaultString += "0"; B += "9"; } this.maxScore = parseInt(B); },
    calcXPos: function(z) { this.x = z - (t.dimensions.DEST_WIDTH * (this.maxScoreUnits + 1)); },
    draw: function(J, I, K) {
      var z = t.dimensions.WIDTH, C = t.dimensions.HEIGHT, B = t.dimensions.WIDTH * I, A = 0;
      var H = J * t.dimensions.DEST_WIDTH, F = this.y, G = t.dimensions.WIDTH, D = t.dimensions.HEIGHT;
      if (f) { z *= 2; C *= 2; B *= 2; }
      B += this.spritePos.x; A += this.spritePos.y;
      this.canvasCtx.save();
      if (K) { this.canvasCtx.translate(this.x - (this.maxScoreUnits * 2) * t.dimensions.WIDTH, this.y); }
      else { this.canvasCtx.translate(this.x, this.y); }
      this.canvasCtx.drawImage(this.image, B, A, z, C, H, F, G, D);
      this.canvasCtx.restore();
    },
    getActualDistance: function(z) { return z ? Math.round(z * this.config.COEFFICIENT) : 0; },
    update: function(z, E) {
      var C = true, B = false;
      if (!this.acheivement) {
        E = this.getActualDistance(E);
        if (E > this.maxScore && this.maxScoreUnits == this.config.MAX_DISTANCE_UNITS) { this.maxScoreUnits++; this.maxScore = parseInt(this.maxScore + "9"); }
        if (E > 0) {
          if (E % this.config.ACHIEVEMENT_DISTANCE == 0) { this.acheivement = true; this.flashTimer = 0; B = true; }
          var D = (this.defaultString + E).substr(-this.maxScoreUnits); this.digits = D.split("");
        } else { this.digits = this.defaultString.split(""); }
      } else {
        if (this.flashIterations <= this.config.FLASH_ITERATIONS) {
          this.flashTimer += z;
          if (this.flashTimer < this.config.FLASH_DURATION) C = false;
          else if (this.flashTimer > this.config.FLASH_DURATION * 2) { this.flashTimer = 0; this.flashIterations++; }
        } else { this.acheivement = false; this.flashIterations = 0; this.flashTimer = 0; }
      }
      if (C) { for (var A = this.digits.length - 1; A >= 0; A--) this.draw(A, parseInt(this.digits[A])); }
      this.drawHighScore();
      return B;
    },
    drawHighScore: function() { this.canvasCtx.save(); this.canvasCtx.globalAlpha = 0.8; for (var z = this.highScore.length - 1; z >= 0; z--) this.draw(z, parseInt(this.highScore[z], 10), true); this.canvasCtx.restore(); },
    setHighScore: function(A) { A = this.getActualDistance(A); var z = (this.defaultString + A).substr(-this.maxScoreUnits); this.highScore = ["10", "11", ""].concat(z.split("")); },
    reset: function(A) { this.update(0); this.acheivement = false; if (A) this.setHighScore(A); }
  };

  // Cloud
  function m(A, z, B) { this.canvas = A; this.canvasCtx = this.canvas.getContext("2d"); this.spritePos = z; this.containerWidth = B; this.xPos = B; this.yPos = 0; this.remove = false; this.cloudGap = l(m.config.MIN_CLOUD_GAP, m.config.MAX_CLOUD_GAP); this.init(); }
  m.config = { HEIGHT: 14, MAX_CLOUD_GAP: 400, MAX_SKY_LEVEL: 30, MIN_CLOUD_GAP: 100, MIN_SKY_LEVEL: 71, WIDTH: 46 };
  m.prototype = {
    init: function() { this.yPos = l(m.config.MAX_SKY_LEVEL, m.config.MIN_SKY_LEVEL); this.draw(); },
    draw: function() { this.canvasCtx.save(); var z = m.config.WIDTH, A = m.config.HEIGHT; if (f) { z *= 2; A *= 2; } this.canvasCtx.drawImage(g.imageSprite, this.spritePos.x, this.spritePos.y, z, A, this.xPos, this.yPos, m.config.WIDTH, m.config.HEIGHT); this.canvasCtx.restore(); },
    update: function(z) { if (!this.remove) { this.xPos -= Math.ceil(z); this.draw(); if (!this.isVisible()) this.remove = true; } },
    isVisible: function() { return this.xPos + m.config.WIDTH > 0; }
  };

  // Horizon Line
  function a(A, z) { this.spritePos = z; this.canvas = A; this.canvasCtx = A.getContext("2d"); this.sourceDimensions = {}; this.dimensions = a.dimensions; this.sourceXPos = [this.spritePos.x, this.spritePos.x + this.dimensions.WIDTH]; this.xPos = []; this.yPos = 0; this.bumpThreshold = 0.5; this.setSourceDimensions(); this.draw(); }
  a.dimensions = { WIDTH: 600, HEIGHT: 12, YPOS: 127 };
  a.prototype = {
    setSourceDimensions: function() { for (var z in a.dimensions) { if (f) { if (z != "YPOS") this.sourceDimensions[z] = a.dimensions[z] * 2; } else { this.sourceDimensions[z] = a.dimensions[z]; } this.dimensions[z] = a.dimensions[z]; } this.xPos = [0, a.dimensions.WIDTH]; this.yPos = a.dimensions.YPOS; },
    getRandomType: function() { return Math.random() > this.bumpThreshold ? this.dimensions.WIDTH : 0; },
    draw: function() { this.canvasCtx.drawImage(g.imageSprite, this.sourceXPos[0], this.spritePos.y, this.sourceDimensions.WIDTH, this.sourceDimensions.HEIGHT, this.xPos[0], this.yPos, this.dimensions.WIDTH, this.dimensions.HEIGHT); this.canvasCtx.drawImage(g.imageSprite, this.sourceXPos[1], this.spritePos.y, this.sourceDimensions.WIDTH, this.sourceDimensions.HEIGHT, this.xPos[1], this.yPos, this.dimensions.WIDTH, this.dimensions.HEIGHT); },
    updateXPos: function(C, A) { var B = C; var z = C == 0 ? 1 : 0; this.xPos[B] -= A; this.xPos[z] = this.xPos[B] + this.dimensions.WIDTH; if (this.xPos[B] <= -this.dimensions.WIDTH) { this.xPos[B] += this.dimensions.WIDTH * 2; this.xPos[z] = this.xPos[B] - this.dimensions.WIDTH; this.sourceXPos[B] = this.getRandomType() + this.spritePos.x; } },
    update: function(A, B) { var z = Math.floor(B * (d / 1000) * A); if (this.xPos[0] <= 0) this.updateXPos(0, z); else this.updateXPos(1, z); this.draw(); },
    reset: function() { this.xPos[0] = 0; this.xPos[1] = a.dimensions.WIDTH; }
  };

  // Horizon (world)
  function v(A, z, C, B) { this.canvas = A; this.canvasCtx = this.canvas.getContext("2d"); this.config = v.config; this.dimensions = C; this.gapCoefficient = B; this.obstacles = []; this.obstacleHistory = []; this.horizonOffsets = [0, 0]; this.cloudFrequency = this.config.CLOUD_FREQUENCY; this.spritePos = z; this.clouds = []; this.cloudSpeed = this.config.BG_CLOUD_SPEED; this.horizonLine = null; this.runningTime = 0; this.init(); }
  v.config = { BG_CLOUD_SPEED: 0.2, BUMPY_THRESHOLD: 0.3, CLOUD_FREQUENCY: 0.5, HORIZON_HEIGHT: 16, MAX_CLOUDS: 6 };
  v.prototype = {
    init: function() { this.addCloud(); this.horizonLine = new a(this.canvas, this.spritePos.HORIZON); },
    update: function(z, B, A) { this.runningTime += z; this.horizonLine.update(z, B); this.updateClouds(z, B); if (A) this.updateObstacles(z, B); },
    updateClouds: function(A, C) { var z = this.cloudSpeed / 1000 * A * C; var E = this.clouds.length; if (E) { for (var B = E - 1; B >= 0; B--) this.clouds[B].update(z); var D = this.clouds[E - 1]; if (E < this.config.MAX_CLOUDS && (this.dimensions.WIDTH - D.xPos) > D.cloudGap && this.cloudFrequency > Math.random()) this.addCloud(); this.clouds = this.clouds.filter(function(F) { return !F.remove; }); } },
    updateObstacles: function(z, C) {
      var E = this.obstacles.slice(0);
      for (var B = 0; B < this.obstacles.length; B++) { var A = this.obstacles[B]; A.update(z, C); if (A.remove) E.shift(); }
      this.obstacles = E;
      if (this.obstacles.length > 0) {
        var D = this.obstacles[this.obstacles.length - 1];
        if (D && !D.followingObstacleCreated && D.isVisible() && (D.xPos + D.width + D.gap) < this.dimensions.WIDTH) { this.addNewObstacle(C); D.followingObstacleCreated = true; }
      } else { this.addNewObstacle(C); }
    },
    addNewObstacle: function(B) { var C = l(0, q.types.length - 1); var z = q.types[C]; if (this.duplicateObstacleCheck(z.type) || B < z.minSpeed) { this.addNewObstacle(B); } else { var A = this.spritePos[z.type]; this.obstacles.push(new q(this.canvasCtx, z, A, this.dimensions, this.gapCoefficient, B)); this.obstacleHistory.unshift(z.type); if (this.obstacleHistory.length > 1) this.obstacleHistory.splice(g.config.MAX_OBSTACLE_DUPLICATION); } },
    duplicateObstacleCheck: function(B) { var z = 0; for (var A = 0; A < this.obstacleHistory.length; A++) z = this.obstacleHistory[A] == B ? z + 1 : 0; return z >= g.config.MAX_OBSTACLE_DUPLICATION; },
    reset: function() { this.obstacles = []; this.horizonLine.reset(); },
    addCloud: function() { this.clouds.push(new m(this.canvas, this.spritePos.CLOUD, this.dimensions.WIDTH)); }
  };
})();
