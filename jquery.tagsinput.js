(function($) {
    $.fn.TagsInput = function(options) {
        //默认参数
        var defaults = {
            usedTags: "",
			usedTagsName:"记忆标签",
            hotTags: "",
			hotTagsName: "热门标签",
            tagNum: 0,
            maxWords: 0
        };
        //用传入参数覆盖了默认值
        var opts = $.extend(defaults, options);
        //对象
        var $this = $(this);
        $this.hide();
        var arrayTags;
        var strHtml;
        strHtml = "<div class=\"tags-wrapper clearfix\">";
        strHtml += "<div id=\"addTagWrap\" ><div class=\"added-tags-wrapper\"></div>";
        strHtml += "<input id=\"tagInput\" type=\"text\" placeholder=\"添加标签，以逗号、分号或空格隔开\" autocomplete=\"off\">";
        strHtml += "</div><div class=\"layer-tags-wrapper\">";
        if (opts.hotTags != "") {
            strHtml += "<div class=\"clearfix layer-tags-box\"><div class=\"layer-tags-left\">"+opts.hotTagsName+"</div><div class=\"layer-tags-right\">";
            arrayTags = opts.hotTags.split('|');
            for (i = 0; i < arrayTags.length; i++) {
                strHtml += "<a class=\"layer-tag-name\" href=\"javascript:;\">" + arrayTags[i] + "</a>";
            }
            strHtml += "</div></div>";
        }
        if (opts.usedTags != "") {
            strHtml += "<div class=\"clearfix layer-tags-box\"><div class=\"layer-tags-left\">"+opts.usedTagsName+"</div><div class=\"layer-tags-right\">";
            arrayTags = opts.usedTags.split('|');
            for (i = 0; i < arrayTags.length; i++) {
                strHtml += "<a class=\"layer-tag-name\" href=\"javascript:;\">" + arrayTags[i] + "</a>";
            }
            strHtml += "</div></div>";
        }
        if (opts.tagNum != 0 && opts.maxWords != 0) {
            strHtml += "<div class=\"layer-tags-foot clearfix \">最多可添加" + opts.tagNum + "个标签，每个标签不超过" + opts.maxWords + "个汉字</div>";
        } else if (opts.tagNum != 0 && opts.maxWords == 0) {
            strHtml += "<div class=\"layer-tags-foot clearfix \">最多可添加" + opts.tagNum + "个标签</div>";
        } else if (opts.tagNum == 0 && opts.maxWords != 0) {
            strHtml += "<div class=\"layer-tags-foot clearfix \">每个标签不超过" + opts.maxWords + "个汉字</div>";
        } else {
            strHtml += "<div class=\"layer-tags-foot clearfix \">标签个数最好少于10个，每个标签最好不超过10个汉字</div>";
        }
        strHtml += "</div></div>";
        $(strHtml).insertAfter($this);
        if ($(".layer-tag-name").length > 0) {
            $(".layer-tags-foot").addClass("layer-tags-foot-top");
        }

        var inputTags = $this.val();
        arrayTags = inputTags.split('|');
        for (i = 0; i < arrayTags.length; i++) {
            addTag(arrayTags[i]);
        }
        $(".layer-tag-name").each(function() {
            $(this).click(function() {
                addTag($(this).text());
            });
        });

        $("#tagInput").keydown(function(e) {
            var keyCode = e.which || e.keyCode;
            if (keyCode == 13 || keyCode == 32 || keyCode == 9) {
                if (addTag($(this).val())) {
                    $(this).val("");
                }
                return false;
            }
        }).keyup(function(e) {
            var keyCode = e.which || e.keyCode;
            if (keyCode == 188 || keyCode == 59) {
                if (addTag($(this).val())) {
                    $(this).val("");
                }
                return false;
            }
        }).click(function() {
            $(".layer-tags-wrapper").show();
        }).blur(function() {
            if (addTag($(this).val())) {
                $(this).val("");
            }
            return false;
        });

        $(".tags-wrapper").mouseleave(function() {
            $(".layer-tags-wrapper").hide();
        });

        function addTag(obj) {
            obj = obj.replace(/[ |,|，|;|；]/g, "");
            if (obj == "") {
                return false;
            }
            //只统计汉字字数
            var num = 0;
            var arr = obj.match(/[^\x00-\xff]/g);
            if (arr != null) {
                num = arr.length;
                if (opts.maxWords > 0 && num > opts.maxWords) {
                    MessageBox("单个标签最多" + opts.maxWords + "个汉字");
                    return false;
                }
                num = 0;
            }
            var tags = $("#addTagWrap .inner-tag-name");
            var flag = true;
            var s = "";
            tags.each(function() {
                if ($(this).text() == obj) {
                    flag = false;
                    return false;
                }
                num++;
                s += $(this).text() + "|";
            });
            if (opts.tagNum > 0 && num >= opts.tagNum) {
                MessageBox("最多可添加" + opts.tagNum + "个标签");
                return false;
            }
            if (flag) {
                $(".added-tags-wrapper").append("<div class=\"inner-tag-wrapper\"><span class=\"inner-tag-name\">" + obj + "</span><a class=\"inner-tag-close\" title=\"删除\" href=\"javascript:;\">×</a></div>");
                $(".added-tags-wrapper .inner-tag-close:last").click(function() {
                    $(this).parent().remove();
					var value = $(this).parent().find(".inner-tag-name").text();
					var values = "";
					$("#addTagWrap .inner-tag-name").each(function() {
						values += $(this).text() + "|";
					});
					if (values.length > 0) {
						values = values.substring(0, values.length - 1);
					}
					$this.val(values);
                });
                s += obj + "|";
                if (s.length > 0) {
                    s = s.substring(0, s.length - 1);
                    $this.val(s);
                }
                return true;
            } else {
                MessageBox("该标签已经存在");
                return false;
            }
        }

        function MessageBox(obj) {
            $("<div class=\"message-box\">" + obj + "</div>").appendTo("body");
            $(".message-box").delay(1000).fadeOut("slow",
            function() {
                $(this).remove();
            });
        }
    };
})(jQuery);