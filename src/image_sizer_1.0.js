$.widget("custom.cropper", {
	version: "1.0",
	widget_event_prefix: "cropping",

	options: {
		width: 400,
		height: 400,
		zoom: 2,
		contain: false,
		image_url: "https://stevenimle.github.io/Image_Resizer/examples/images/example_image_1.jpg",

		//jQuery elements
		button: null,

		//callbacks
		submit: function() {},
		slide: function() {},
		drag: function() {}
	},

	limits: {
		min: {
			height: 100,
			width: 100,
			zoom: 2
		},
		max: {
			height: 500,
			width: 700,
			zoom: 4
		}
	},

	_create: function() {
		this.element.hide();
		this._createElements();
		this._setValueLimits();
		this._getElements();
		this._setImage();
	},

	_setup: function(_this) {
		_this.$outer_container.height(_this.options.height);
		_this.$outer_container.width(_this.options.width);

		_this.original_height = parseInt(_this.$foreground_image.height());
		_this.original_width = parseInt(_this.$foreground_image.width());

		var css_start_options = {
			height: _this.$main_container.outerHeight(),
			width: _this.original_width * (_this.$main_container.outerHeight() / _this.original_height)
		};

		_this.$foreground_image.css(css_start_options);
		_this.$background_image.css(css_start_options);

		_this.initial_height = parseInt(_this.$foreground_image.height());
		_this.initial_width = parseInt(_this.$foreground_image.width());

		css_start_options = {
			left: -(_this.initial_width / 2 - _this.options.width / 2),
			top: -(parseInt(_this.$main_container.css("padding-top")))
		};

		_this.$foreground_image.css(css_start_options);
		_this.$drag_helper.css(css_start_options);

		_this.$resize_container.css({
			height: _this.initial_height * 2 - _this.options.height,
			width: _this.initial_width * 2 - _this.options.width,
			left: _this.options.width - _this.initial_width,
			top: _this.options.height - _this.initial_height
		});

		_this.resize_center = {
			x: (_this.options.width / 2 - parseInt(_this.$foreground_image.css("left"))) / _this.initial_width,
			y: (_this.options.height / 2 - parseInt(_this.$foreground_image.css("top"))) / _this.initial_height
		};

		_this.minimum = _this.options.contain
			? Math.min(_this.options.height / _this.initial_height, _this.options.width / _this.initial_width)
			: Math.max(_this.options.height / _this.initial_height, _this.options.width / _this.initial_width);

		_this._createEventListeners(_this);
	},

	_setImage: function() {
		var _this = this;
		this.$foreground_image.attr("src", this.options.image_url);
		this.$background_image.attr("src", this.options.image_url).load(function() {
			_this.element.show();
			_this._setup(_this);
		});
	},

	_getElements: function() {
		this.$foreground_image = this.element.find("#foreground_crop_image");
		this.$background_image = this.element.find("#background_crop_image");
		this.$outer_container = this.element.find("#cropping_gredyed_container");
		this.$main_container = this.element.find("#cropping_main_container");
		this.$drag_helper = this.element.find("#cropping_drag_helper");
		this.$resize_container = this.element.find("#cropping_sizing_container");
		this.$resize_warning = this.element.find("#cropping_resize_warning");
	},

	_setValueLimits: function() {
		this.options.height = this.options.height < this.limits.min.height
			? this.limits.min.height : this.options.height > this.limits.max.height
			                      ? this.limits.max.height : this.options.height;
		this.options.width = this.options.width < this.limits.min.width
			? this.limits.min.width : this.options.width > this.limits.max.width
			                     ? this.limits.max.width : this.options.width;
		this.options.zoom = this.options.zoom < this.limits.min.zoom
			? this.limits.min.zoom : this.options.zoom > this.limits.max.zoom
			                    ? this.limits.max.zoom : this.options.zoom;
	},

	_createElements: function() {
		this.element.html('<div id="cropping_main_container"><div id="cropping_gredyed_container">'
		                  + '<div id="cropping_sizing_container"></div><div id="cropping_inner_container">'
		                  + '<img id="foreground_crop_image" src=""/></div><div id="cropping_drag_helper">'
		                  + '<img id="background_crop_image" src=""/><div id="cropping_pointer"></div></div>'
		                  + '<div id="cropping_dtr"><span>Drag to Reposition</span></div></div>'
		                  + '<div id="cropping_slider_outer_container"><div id="cropping_slider_container">'
		                  + '<div class="cropping_slider_indicator" id="csi_minus"></div><div id="cropping_slider"></div>'
		                  + '<div class="cropping_slider_indicator" id="csi_plus"></div></div></div>'
		                  + '<div id="cropping_resize_warning"><span>Zooming in this close will make your photo less clear.</span>'
		                  + '</div></div><div id="cropping_footer"><div id="save_button"><span>Save</span></div></div>');
	},

	_createEventListeners: function(_this) {
		if (!this.options.button) {
			this.options.button = this.element.find("#save_button");
			this.element.find("#cropping_footer").show();
		}

		this.options.button.click(function() {
			var pos = {
				left: Math.abs(parseInt(_this.$foreground_image.css("left"))),
				top: Math.abs(parseInt(_this.$foreground_image.css("top")))
			};

			_this.options.submit({
				height: _this.options.height,
				width: _this.options.width,
				ratio: _this.$foreground_image.height() / _this.original_height,
				top_x: pos.left / _this.$foreground_image.width(),
				top_y: pos.top / _this.$foreground_image.height(),
				bot_x: (pos.left + _this.options.width) / _this.$foreground_image.width(),
				bot_y: (pos.top + _this.options.height) / _this.$foreground_image.height()
			});
		});

		this.$drag_helper.draggable({
			drag: function(event, ui) {
				_this.resize_center = {
					x: (_this.options.width / 2 - ui.position.left) / _this.$foreground_image.width(),
					y: (_this.options.height / 2 - ui.position.top) / _this.$foreground_image.height()
				};

				_this.$foreground_image.css({
					left: ui.position.left,
					top: ui.position.top
				});

				_this.options.drag(event, ui);
			},
			containment: _this.$resize_container
		});

		this.element.find("#cropping_slider").slider({
			max: _this.options.zoom * 1000,
			value: 1000,
			min: _this.minimum * 1000,
			slide: function(event, ui) {
				if (ui.value > 1000 && _this.initial_height * (ui.value / 1000) >= _this.original_height)
					_this.$resize_warning.show();
				else
					_this.$resize_warning.hide();

				var css_options_hw = {
					height: _this.initial_height * (ui.value / 1000),
					width: _this.initial_width * (ui.value / 1000)
				};

				_this.$foreground_image.css(css_options_hw);
				_this.$background_image.css(css_options_hw);

				var css_options_lt = {
					left: -(_this.resize_center.x * css_options_hw.width - _this.options.width / 2),
					top: -(_this.resize_center.y * css_options_hw.height - _this.options.height / 2)
				};

				if (!_this.options.contain || _this.options.contain
				                              && _this.minimum == _this.options.width / _this.initial_width) {
					css_options_lt.left = css_options_lt.left > 0 ? 0 : css_options_lt.left;

					css_options_lt.left = -css_options_lt.left + _this.options.width > css_options_hw.width
						? -(css_options_hw.width - _this.options.width) / _this.options.width * 100 + "%"
						: css_options_lt.left / _this.options.width * 100 + "%";
				}

				if (!_this.options.contain || _this.options.contain
				                              && _this.minimum == _this.options.height / _this.initial_height) {
					css_options_lt.top = css_options_lt.top > 0 ? 0 : css_options_lt.top;

					css_options_lt.top = -css_options_lt.top + _this.options.height > css_options_hw.height
						? -(css_options_hw.height - _this.options.height) / _this.options.height * 100 + "%"
						: css_options_lt.top / _this.options.height * 100 + "%";
				}

				_this.$foreground_image.css(css_options_lt);
				_this.$drag_helper.css(css_options_lt);

				var resizer_css = {
					height: css_options_hw.height * 2 - _this.options.height,
					width: css_options_hw.width * 2 - _this.options.width,
					left: _this.options.width - css_options_hw.width,
					top: _this.options.height - css_options_hw.height
				};

				resizer_css.height = _this.options.contain && resizer_css.height < _this.options.height
					? _this.options.height : resizer_css.height;
				resizer_css.width = _this.options.contain && resizer_css.width < _this.options.width
					? _this.options.width : resizer_css.width;
				resizer_css.left = _this.options.contain && resizer_css.left > 0 ? 0 : resizer_css.left;
				resizer_css.top = _this.options.contain && resizer_css.top > 0 ? 0 : resizer_css.top;

				_this.$resize_container.css(resizer_css);

				_this.options.slide(event, ui);
			}
		});
	},

	ratio: function() {
		return this.$foreground_image.height() / this.original_height;
	},

	start: function() {
		return {
			x: Math.abs(parseInt(this.$foreground_image.css("left"))) / this.$foreground_image.width(),
			y: Math.abs(parseInt(this.$foreground_image.css("top"))) / this.$foreground_image.height()
		};
	},

	end: function() {
		var left = Math.abs(parseInt(this.$foreground_image.css("left")));
		var top = Math.abs(parseInt(this.$foreground_image.css("top")));

		return {
			x: (left + this.options.width) / this.$foreground_image.width(),
			y: (top + this.options.height) / this.$foreground_image.height()
		};
	}
});