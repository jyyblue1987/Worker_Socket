"use strict";
$(document).ready(function() {
  
    // xx search
    $("#search-action").on("keyup", function() {
        var g = $(this).val().toLowerCase();
        $(".header-options-list .optionslist-box .media-body .action-header").each(function() {
            var s = $(this).text().toLowerCase();
            $(this).closest('.optionslist-box')[s.indexOf(g) !== -1 ? 'show' : 'hide']();
        });
    });
    $("#m-search").on("keyup", function() {
        var g = $(this).val().toLowerCase();
        var ln = $(this).val().length;

        $(".pcoded-inner-navbar > li").each(function() {
            var t = $(this).attr('data-optionsname');
            if (t) {
                var s = t.toLowerCase();
            }
            if (s) {
                var n = s.indexOf(g);
                if (n !== -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
                if (ln > 0) {
                    $('.pcoded-menu-caption').hide();
                } else {
                    $('.pcoded-menu-caption').show();
                }
            }
        });
    });
    // open options list
    $('.displayActionbox').on('click', function() {
        $('.header-options-list').toggleClass('open');
    });
    // xx open messages
    $('.header-options-list .optionslist-box').on('click', function() {
        $('.header-action').addClass('open');
        $('.header-options-list').toggleClass('msg-open');
    });
    // xx close options list
    $('.h-back-options-list').on('click', function() {
        $('.header-action').removeClass('open');
        $('.header-options-list').removeClass('msg-open');
    });
    //   xx full action
    $('.h-close-text').on('click', function() {
        $('.header-action').removeClass('open');
        $('.header-options-list').removeClass('open');
        $('.header-options-list').removeClass('msg-open');
    });
    $('.btn-attach').click(function() {
        $('.action-attach').trigger('click');
    });
    $('.h-send-action').on('keyup', function(e) {
        fc(e);
    });
    $('.btn-send').on('click', function(e) {
        cfc(e);
    });
    // xx Friend scroll
    $(".main-friend-cont").slimScroll({
        setTop: "1px",
        size: '5px',
        wheelStep: 10,
        alwaysVisible: false,
        allowPageScroll: true,
        color: 'rgba(0,0,0,0.5)',
        height: "calc(100vh - 92px)",
        width: "100%",
    });
    $(".main-action-cont").slimScroll({
        setTop: "1px",
        size: '5px',
        wheelStep: 10,
        alwaysVisible: false,
        allowPageScroll: true,
        color: 'rgba(0,0,0,0.5)',
        height: "calc(100vh - 155px)",
        width: "100%",
    });

    function fc(e) {
        if (e.which == 13) {
            cfc(e)
        }
    };
	// xx
    function cfc(e) {
        $('.header-action .main-friend-action').append('' +
            '<div class="media action-messages">' +
            '<div class="media-body action-menu-reply">' +
            '<div class="">' +
            '<p class="action-cont">' + $('.h-send-action').val() + '</p>' +
            '</div>' +
            '<p class="action-time">now</p>' +
            '</div>' +
            '</div>' +
            '');
        frc($('.h-send-action').val());
        fsc();
        $('.h-send-action').val(null);
    };
	// xx
    function frc(wrmsg) {
        setTimeout(function() {
            $('.header-action .main-friend-action').append('' +
                '<div class="media action-messages typing">' +
                '<a class="media-left photo-table" href="javascript:"><img class="media-object img-radius img-radius m-t-5" src="assets/images/user/avatar-2.jpg" alt="Generic placeholder image"></a>' +
                '<div class="media-body action-menu-content">' +
                '<div class="rem-msg">' +
                '<p class="action-cont">Typing . . .</p>' +
                '</div>' +
                '<p class="action-time">now</p>' +
                '</div>' +
                '</div>' +
                '');
            fsc();
        }, 1500);
        setTimeout(function() {
            document.getElementsByClassName("rem-msg")[0].innerHTML = "<p class='action-cont'>hello superior personality you write</p> <p class='action-cont'>" + wrmsg + "</p>";
            $('.rem-msg').removeClass("rem-msg");
            $('.typing').removeClass("typing");
            fsc();
        }, 3000);
    };
	// xx
    function fsc() {
        var tmph = $('.header-action .main-friend-action');
        $(".main-action-cont.scroll-div").slimScroll({
            scrollBy: tmph.outerHeight(),
            animate: true,
        });
    }

   
});


