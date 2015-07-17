function showImageCroppingModal(container_width, container_height, zoom, contain, callback, dev) {
    callback = typeof container_height === "function" ? container_height : callback;
    container_height = typeof container_height !== "number" ? 500 : container_height;
    callback = typeof container_width === "function" ? container_width : callback;
    container_width = typeof container_width !== "number" ? 500 : container_width;
    callback = typeof zoom === "function" ? zoom : callback;
    zoom = typeof zoom !== "number" ? 2 : zoom;
    callback = typeof callback !== "function" ? function() {} : callback;
    contain = typeof contain !== "boolean" ? false : contain;

    var limits = {
        min: { height: 100, width: 100, zoom: 2 },
        max: { height: 500, width: 700, zoom: 4 }
    };

    container_height = container_height < limits.min.height ? limits.min.height : container_height > limits.max.height ? limits.max.height : container_height;
    container_width = container_width < limits.min.width ? limits.min.width : container_width > limits.max.width ? limits.max.width : container_width;
    zoom = zoom < limits.min.zoom ? limits.min.zoom : zoom > limits.max.zoom ? limits.max.zoom : zoom;

    var $background_image = $("#background_crop_image");
    var $foreground_image = $("#foreground_crop_image");
    var $outer_container = $("#cropping_gredyed_container");
    var $main_container = $("#cropping_main_container");
    var $drag_helper = $("#cropping_drag_helper");
    var $resize_container = $("#cropping_sizing_container");
    var $resize_warning = $("#cropping_resize_warning");

    $outer_container.height(container_height);
    $outer_container.width(container_width);

    var original_height = parseInt($foreground_image.height());
    var original_width = parseInt($foreground_image.width());

    var css_start_options = {
        height: $main_container.outerHeight(),
        width: original_width * ($main_container.outerHeight() / original_height)
    };

    $foreground_image.css(css_start_options);
    $background_image.css(css_start_options);

    var initial_height = parseInt($foreground_image.height());
    var initial_width = parseInt($foreground_image.width());

    css_start_options = {
        left: -(initial_width / 2 - container_width / 2),
        top: -(parseInt($main_container.css("padding-top")))
    };

    $foreground_image.css(css_start_options);
    $drag_helper.css(css_start_options);

    $resize_container.css({
        height: initial_height * 2 - container_height,
        width: initial_width * 2 - container_width,
        left: container_width - initial_width,
        top: container_height - initial_height
    });

    var resize_center = {
        x: (container_width / 2 - parseInt($foreground_image.css("left"))) / initial_width,
        y: (container_height / 2 - parseInt($foreground_image.css("top"))) / initial_height
    };

    var minimum = contain
        ? Math.min(container_height / initial_height, container_width / initial_width)
        : Math.max(container_height / initial_height, container_width / initial_width);

    $("#cropping_slider").slider({
        max: zoom * 1000,
        value: 1000,
        min: minimum * 1000,
        slide: function (event, ui) {
            if (ui.value > 1000 && initial_height * (ui.value / 1000) >= original_height)
                $resize_warning.show();
            else
                $resize_warning.hide();

            var css_options_hw = {
                height: initial_height * (ui.value / 1000),
                width: initial_width * (ui.value / 1000)
            };

            $foreground_image.css(css_options_hw);
            $background_image.css(css_options_hw);

            var css_options_lt = {
                left: -(resize_center.x * css_options_hw.width - container_width / 2),
                top: -(resize_center.y * css_options_hw.height - container_height / 2)
            };

            if (!contain || contain && minimum == container_width / initial_width) {
                css_options_lt.left = css_options_lt.left > 0 ? 0 : css_options_lt.left;

                css_options_lt.left = -css_options_lt.left + container_width > css_options_hw.width
                    ? -(css_options_hw.width - container_width) / container_width * 100 + "%"
                    : css_options_lt.left / container_width * 100 + "%";
            }

            if (!contain || contain && minimum == container_height / initial_height) {
                css_options_lt.top = css_options_lt.top > 0 ? 0 : css_options_lt.top;

                css_options_lt.top = -css_options_lt.top + container_height > css_options_hw.height
                    ? -(css_options_hw.height - container_height) / container_height * 100 + "%"
                    : css_options_lt.top / container_height * 100 + "%";
            }

            $foreground_image.css(css_options_lt);
            $drag_helper.css(css_options_lt);

            var resizer_css = {
                height: css_options_hw.height * 2 - container_height,
                width: css_options_hw.width * 2 - container_width,
                left: container_width - css_options_hw.width,
                top: container_height - css_options_hw.height
            };

            resizer_css.height = contain && resizer_css.height < container_height ? container_height : resizer_css.height;
            resizer_css.width = contain && resizer_css.width < container_width ? container_width : resizer_css.width;
            resizer_css.left = contain && resizer_css.left > 0 ? 0 : resizer_css.left;
            resizer_css.top = contain && resizer_css.top > 0 ? 0 : resizer_css.top;

            $resize_container.css(resizer_css);
        }
    });

    $drag_helper.draggable({
        drag: function(event, ui) {
            resize_center = {
                x: (container_width / 2 - ui.position.left) / $foreground_image.width(),
                y: (container_height / 2 - ui.position.top) / $foreground_image.height()
            };

            $foreground_image.css({
                left: ui.position.left,
                top: ui.position.top
            });
        },
        containment: $resize_container
    });

    $("#save_button").click(function() {
        var pos = {
            left: Math.abs(parseInt($foreground_image.css("left"))),
            top: Math.abs(parseInt($foreground_image.css("top")))
        };

        callback({
            height: container_height,
            width: container_width,
            ratio: $foreground_image.height() / original_height,
            top_x: pos.left / $foreground_image.width(),
            top_y: pos.top / $foreground_image.height(),
            bot_x: (pos.left + container_width) / $foreground_image.width(),
            bot_y: (pos.top + container_height) / $foreground_image.height()
        });
    });
}

$(document).ready(function() {
    showImageCroppingModal(function(data) {
        console.log(Object.keys(data).reduce(function(str, val) {
            return str + val + ": " + data[val] + "\n"
        }, ""));
    });
});
