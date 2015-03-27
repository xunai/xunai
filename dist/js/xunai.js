$(function() {
      var window_height = $(window).height();
      $(".top-box").css('height', window_height - $('.main-footer').outerHeight() - $('.bottom-box').outerHeight() - 125);
      $(".img-head").on("click", function() {
            var me = $(this);
            var checkbox = me.prev("input[type=checkbox]");
            if (checkbox.attr("checked")) {
                  checkbox.attr("checked", false);
            } else {
                  checkbox.attr("checked", true);
            }
            me.parent().toggleClass("active");
      });
      $(".head-check-item .fa-square-o").click(function() {
            var me = $(this);
            me.parent().addClass("active");
            me.parent().children("input[type=checkbox]").attr("checked", true);
      });
      $(".head-check-item .fa-check-square-o").click(function() {
            var me = $(this);
            me.parent().removeClass("active");
            me.parent().children("input[type=checkbox]").attr("checked", false);

      });
      $(".selectall").click(function() {
            var me = $(this);
            me.parents(".tab-pane").find("input[type=checkbox]").attr("checked", true);
            me.parents(".tab-pane").find(".head-check-item").addClass("active");
      });
      $(".selectreverse").click(function() {
            var me = $(this);
            me.parents(".tab-pane").find("input[type=checkbox]").each(function(index, element) {
                  $(element).attr("checked", !$(element).attr("checked"));
            });
            me.parents(".tab-pane").find(".head-check-item").toggleClass("active");
      });
});