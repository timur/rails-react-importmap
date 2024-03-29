var __assign = function () {
    return (__assign =
      Object.assign ||
      function (t) {
        for (var e, i = 1, s = arguments.length; i < s; i++)
          for (var n in (e = arguments[i]))
            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
        return t;
      }).apply(this, arguments);
  },
  thumbnailsSettings = {
    thumbnail: !0,
    animateThumb: !0,
    currentPagerPosition: "middle",
    alignThumbnails: "middle",
    thumbWidth: 100,
    thumbHeight: "80px",
    thumbMargin: 5,
    appendThumbnailsTo: ".lg-components",
    toggleThumb: !1,
    enableThumbDrag: !0,
    enableThumbSwipe: !0,
    thumbnailSwipeThreshold: 10,
    loadYouTubeThumbnail: !0,
    youTubeThumbSize: 1,
    thumbnailPluginStrings: { toggleThumbnails: "Toggle thumbnails" },
  },
  lGEvents = {
    afterAppendSlide: "lgAfterAppendSlide",
    init: "lgInit",
    hasVideo: "lgHasVideo",
    containerResize: "lgContainerResize",
    updateSlides: "lgUpdateSlides",
    afterAppendSubHtml: "lgAfterAppendSubHtml",
    beforeOpen: "lgBeforeOpen",
    afterOpen: "lgAfterOpen",
    slideItemLoad: "lgSlideItemLoad",
    beforeSlide: "lgBeforeSlide",
    afterSlide: "lgAfterSlide",
    posterClick: "lgPosterClick",
    dragStart: "lgDragStart",
    dragMove: "lgDragMove",
    dragEnd: "lgDragEnd",
    beforeNextSlide: "lgBeforeNextSlide",
    beforePrevSlide: "lgBeforePrevSlide",
    beforeClose: "lgBeforeClose",
    afterClose: "lgAfterClose",
    rotateLeft: "lgRotateLeft",
    rotateRight: "lgRotateRight",
    flipHorizontal: "lgFlipHorizontal",
    flipVertical: "lgFlipVertical",
    autoplay: "lgAutoplay",
    autoplayStart: "lgAutoplayStart",
    autoplayStop: "lgAutoplayStop",
  },
  Thumbnail = (function () {
    function t(t, e) {
      return (
        (this.thumbOuterWidth = 0),
        (this.thumbTotalWidth = 0),
        (this.translateX = 0),
        (this.thumbClickable = !1),
        (this.core = t),
        (this.$LG = e),
        this
      );
    }
    return (
      (t.prototype.init = function () {
        (this.settings = __assign(
          __assign({}, thumbnailsSettings),
          this.core.settings
        )),
          (this.thumbOuterWidth = 0),
          (this.thumbTotalWidth =
            this.core.galleryItems.length *
            (this.settings.thumbWidth + this.settings.thumbMargin)),
          (this.translateX = 0),
          this.setAnimateThumbStyles(),
          this.core.settings.allowMediaOverlap ||
            (this.settings.toggleThumb = !1),
          this.settings.thumbnail &&
            (this.build(),
            this.settings.animateThumb
              ? (this.settings.enableThumbDrag && this.enableThumbDrag(),
                this.settings.enableThumbSwipe && this.enableThumbSwipe(),
                (this.thumbClickable = !1))
              : (this.thumbClickable = !0),
            this.toggleThumbBar(),
            this.thumbKeyPress());
      }),
      (t.prototype.build = function () {
        var i = this;
        this.setThumbMarkup(),
          this.manageActiveClassOnSlideChange(),
          this.$lgThumb.first().on("click.lg touchend.lg", function (t) {
            var e = i.$LG(t.target);
            e.hasAttribute("data-lg-item-id") &&
              setTimeout(function () {
                var t;
                i.thumbClickable &&
                  !i.core.lgBusy &&
                  ((t = parseInt(e.attr("data-lg-item-id"))),
                  i.core.slide(t, !1, !0, !1));
              }, 50);
          }),
          this.core.LGel.on(lGEvents.beforeSlide + ".thumb", function (t) {
            t = t.detail.index;
            i.animateThumb(t);
          }),
          this.core.LGel.on(lGEvents.beforeOpen + ".thumb", function () {
            i.thumbOuterWidth = i.core.outer.get().offsetWidth;
          }),
          this.core.LGel.on(lGEvents.updateSlides + ".thumb", function () {
            i.rebuildThumbnails();
          }),
          this.core.LGel.on(lGEvents.containerResize + ".thumb", function () {
            i.core.lgOpened &&
              setTimeout(function () {
                (i.thumbOuterWidth = i.core.outer.get().offsetWidth),
                  i.animateThumb(i.core.index),
                  (i.thumbOuterWidth = i.core.outer.get().offsetWidth);
              }, 50);
          });
      }),
      (t.prototype.setThumbMarkup = function () {
        var t = "lg-thumb-outer ",
          t =
            (this.settings.alignThumbnails &&
              (t += "lg-thumb-align-" + this.settings.alignThumbnails),
            '<div class="' +
              t +
              '">\n        <div class="lg-thumb lg-group">\n        </div>\n        </div>');
        this.core.outer.addClass("lg-has-thumb"),
          (".lg-components" === this.settings.appendThumbnailsTo
            ? this.core.$lgComponents
            : this.core.outer
          ).append(t),
          (this.$thumbOuter = this.core.outer.find(".lg-thumb-outer").first()),
          (this.$lgThumb = this.core.outer.find(".lg-thumb").first()),
          this.settings.animateThumb &&
            this.core.outer
              .find(".lg-thumb")
              .css("transition-duration", this.core.settings.speed + "ms")
              .css("width", this.thumbTotalWidth + "px")
              .css("position", "relative"),
          this.setThumbItemHtml(this.core.galleryItems);
      }),
      (t.prototype.enableThumbDrag = function () {
        var e = this,
          i = {
            cords: { startX: 0, endX: 0 },
            isMoved: !1,
            newTranslateX: 0,
            startTime: new Date(),
            endTime: new Date(),
            touchMoveTime: 0,
          },
          s = !1;
        this.$thumbOuter.addClass("lg-grab"),
          this.core.outer
            .find(".lg-thumb")
            .first()
            .on("mousedown.lg.thumb", function (t) {
              e.thumbTotalWidth > e.thumbOuterWidth &&
                (t.preventDefault(),
                (i.cords.startX = t.pageX),
                (i.startTime = new Date()),
                (e.thumbClickable = !1),
                (s = !0),
                (e.core.outer.get().scrollLeft += 1),
                --e.core.outer.get().scrollLeft,
                e.$thumbOuter.removeClass("lg-grab").addClass("lg-grabbing"));
            }),
          this.$LG(window).on(
            "mousemove.lg.thumb.global" + this.core.lgId,
            function (t) {
              e.core.lgOpened &&
                s &&
                ((i.cords.endX = t.pageX), (i = e.onThumbTouchMove(i)));
            }
          ),
          this.$LG(window).on(
            "mouseup.lg.thumb.global" + this.core.lgId,
            function () {
              e.core.lgOpened &&
                (i.isMoved
                  ? (i = e.onThumbTouchEnd(i))
                  : (e.thumbClickable = !0),
                s &&
                  ((s = !1),
                  e.$thumbOuter
                    .removeClass("lg-grabbing")
                    .addClass("lg-grab")));
            }
          );
      }),
      (t.prototype.enableThumbSwipe = function () {
        var e = this,
          i = {
            cords: { startX: 0, endX: 0 },
            isMoved: !1,
            newTranslateX: 0,
            startTime: new Date(),
            endTime: new Date(),
            touchMoveTime: 0,
          };
        this.$lgThumb.on("touchstart.lg", function (t) {
          e.thumbTotalWidth > e.thumbOuterWidth &&
            (t.preventDefault(),
            (i.cords.startX = t.targetTouches[0].pageX),
            (e.thumbClickable = !1),
            (i.startTime = new Date()));
        }),
          this.$lgThumb.on("touchmove.lg", function (t) {
            e.thumbTotalWidth > e.thumbOuterWidth &&
              (t.preventDefault(),
              (i.cords.endX = t.targetTouches[0].pageX),
              (i = e.onThumbTouchMove(i)));
          }),
          this.$lgThumb.on("touchend.lg", function () {
            i.isMoved ? (i = e.onThumbTouchEnd(i)) : (e.thumbClickable = !0);
          });
      }),
      (t.prototype.rebuildThumbnails = function () {
        var t = this;
        this.$thumbOuter.addClass("lg-rebuilding-thumbnails"),
          setTimeout(function () {
            (t.thumbTotalWidth =
              t.core.galleryItems.length *
              (t.settings.thumbWidth + t.settings.thumbMargin)),
              t.$lgThumb.css("width", t.thumbTotalWidth + "px"),
              t.$lgThumb.empty(),
              t.setThumbItemHtml(t.core.galleryItems),
              t.animateThumb(t.core.index);
          }, 50),
          setTimeout(function () {
            t.$thumbOuter.removeClass("lg-rebuilding-thumbnails");
          }, 200);
      }),
      (t.prototype.setTranslate = function (t) {
        this.$lgThumb.css("transform", "translate3d(-" + t + "px, 0px, 0px)");
      }),
      (t.prototype.getPossibleTransformX = function (t) {
        return (t =
          (t =
            t > this.thumbTotalWidth - this.thumbOuterWidth
              ? this.thumbTotalWidth - this.thumbOuterWidth
              : t) < 0
            ? 0
            : t);
      }),
      (t.prototype.animateThumb = function (t) {
        if (
          (this.$lgThumb.css(
            "transition-duration",
            this.core.settings.speed + "ms"
          ),
          this.settings.animateThumb)
        ) {
          var e = 0;
          switch (this.settings.currentPagerPosition) {
            case "left":
              e = 0;
              break;
            case "middle":
              e = this.thumbOuterWidth / 2 - this.settings.thumbWidth / 2;
              break;
            case "right":
              e = this.thumbOuterWidth - this.settings.thumbWidth;
          }
          (this.translateX =
            (this.settings.thumbWidth + this.settings.thumbMargin) * t - 1 - e),
            this.translateX > this.thumbTotalWidth - this.thumbOuterWidth &&
              (this.translateX = this.thumbTotalWidth - this.thumbOuterWidth),
            this.translateX < 0 && (this.translateX = 0),
            this.setTranslate(this.translateX);
        }
      }),
      (t.prototype.onThumbTouchMove = function (t) {
        return (
          (t.newTranslateX = this.translateX),
          (t.isMoved = !0),
          (t.touchMoveTime = new Date().valueOf()),
          (t.newTranslateX -= t.cords.endX - t.cords.startX),
          (t.newTranslateX = this.getPossibleTransformX(t.newTranslateX)),
          this.setTranslate(t.newTranslateX),
          this.$thumbOuter.addClass("lg-dragging"),
          t
        );
      }),
      (t.prototype.onThumbTouchEnd = function (t) {
        (t.isMoved = !1),
          (t.endTime = new Date()),
          this.$thumbOuter.removeClass("lg-dragging");
        var e = t.endTime.valueOf() - t.startTime.valueOf(),
          i = t.cords.endX - t.cords.startX,
          e = Math.abs(i) / e;
        return (
          0.15 < e && t.endTime.valueOf() - t.touchMoveTime < 30
            ? (2 < (e += 1) && (e += 1),
              (e += e * (Math.abs(i) / this.thumbOuterWidth)),
              this.$lgThumb.css(
                "transition-duration",
                Math.min(e - 1, 2) + "settings"
              ),
              (this.translateX = this.getPossibleTransformX(
                this.translateX - (i *= e)
              )),
              this.setTranslate(this.translateX))
            : (this.translateX = t.newTranslateX),
          Math.abs(t.cords.endX - t.cords.startX) <
            this.settings.thumbnailSwipeThreshold && (this.thumbClickable = !0),
          t
        );
      }),
      (t.prototype.getThumbHtml = function (t, e, i) {
        var s = this.core.galleryItems[e].__slideVideoInfo || {},
          s =
            s.youtube && this.settings.loadYouTubeThumbnail
              ? "//img.youtube.com/vi/" +
                s.youtube[1] +
                "/" +
                this.settings.youTubeThumbSize +
                ".jpg"
              : t;
        return (
          '<div data-lg-item-id="' +
          e +
          '" class="lg-thumb-item ' +
          (e === this.core.index ? " active" : "") +
          '"\n        style="width:' +
          this.settings.thumbWidth +
          "px; height: " +
          this.settings.thumbHeight +
          ";\n            margin-right: " +
          this.settings.thumbMargin +
          'px;">\n            <img ' +
          (i ? 'alt="' + i + '"' : "") +
          ' data-lg-item-id="' +
          e +
          '" src="' +
          s +
          '" />\n        </div>'
        );
      }),
      (t.prototype.getThumbItemHtml = function (t) {
        for (var e = "", i = 0; i < t.length; i++)
          e += this.getThumbHtml(t[i].thumb, i, t[i].alt);
        return e;
      }),
      (t.prototype.setThumbItemHtml = function (t) {
        t = this.getThumbItemHtml(t);
        this.$lgThumb.html(t);
      }),
      (t.prototype.setAnimateThumbStyles = function () {
        this.settings.animateThumb &&
          this.core.outer.addClass("lg-animate-thumb");
      }),
      (t.prototype.manageActiveClassOnSlideChange = function () {
        var i = this;
        this.core.LGel.on(lGEvents.beforeSlide + ".thumb", function (t) {
          var e = i.core.outer.find(".lg-thumb-item"),
            t = t.detail.index;
          e.removeClass("active"), e.eq(t).addClass("active");
        });
      }),
      (t.prototype.toggleThumbBar = function () {
        var t = this;
        this.settings.toggleThumb &&
          (this.core.outer.addClass("lg-can-toggle"),
          this.core.$toolbar.append(
            '<button type="button" aria-label="' +
              this.settings.thumbnailPluginStrings.toggleThumbnails +
              '" class="lg-toggle-thumb lg-icon"></button>'
          ),
          this.core.outer
            .find(".lg-toggle-thumb")
            .first()
            .on("click.lg", function () {
              t.core.outer.toggleClass("lg-components-open");
            }));
      }),
      (t.prototype.thumbKeyPress = function () {
        var e = this;
        this.$LG(window).on(
          "keydown.lg.thumb.global" + this.core.lgId,
          function (t) {
            e.core.lgOpened &&
              e.settings.toggleThumb &&
              (38 === t.keyCode
                ? (t.preventDefault(),
                  e.core.outer.addClass("lg-components-open"))
                : 40 === t.keyCode &&
                  (t.preventDefault(),
                  e.core.outer.removeClass("lg-components-open")));
          }
        );
      }),
      (t.prototype.destroy = function () {
        this.settings.thumbnail &&
          (this.$LG(window).off(".lg.thumb.global" + this.core.lgId),
          this.core.LGel.off(".lg.thumb"),
          this.core.LGel.off(".thumb"),
          this.$thumbOuter.remove(),
          this.core.outer.removeClass("lg-has-thumb"));
      }),
      t
    );
  })();
export default Thumbnail;
