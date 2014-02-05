
// изображение при зареждане данните на popup
var loading_image = new Image();
loading_image.src = "css/loading.gif";

function popupHide() {
    popupStopLoading();
    $(document).unbind('keyup', popupKeyUp);
    $('.dp-applied').each( function () { $(this).dpClose(); });
    $('.dd-applied').each( function () { $(this).ddClose(); });
    $("#WI_window").fadeOut("fast", function() {
        $('#WI_window,#WI_overlay').trigger("unload").unbind().remove();
    });
    $('#WI_overlay, #WI_window').hide();
    $('#WI_window').empty();
    return false;
}

/**
 * Инициализира popup прозореца.
 * Извиква се в края на popup прозореца, за да се инициализира формата в него като Ajax form.
 */
function popupInit(a_method) {
    if (typeof a_method == 'undefined') a_method = 'get';
    $('#WI_window form').ajaxForm({
        target: '#WI_window',
        type: a_method,
        beforeSubmit: function(form_array) {
            form_array.push({name: 'ajax', value: '1'}, {name: 'fuckIE', value:(new Date().valueOf())});
        }
    });
}

/**
 * Обработва зададеното събитие OnKeyUp и ако е натиснат клавиш Esc, затваря popup прозореца.
 * @param e
 */
function popupKeyUp(e) {
    var key = e ? e.which || e.keyCode || e.charCode : 0;
    if (key == 27) {
        popupHide();
    }
}

/**
 * Показва popup прозорец и зарежда в него зададения URL.
 * @param url Адрес, от който да се заредят данните в popup прозореца.
 */
function popupShow(url) {
    // определяне височината на страницата
    var de = document.documentElement;
    var h1 = window.innerHeight || self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    var pc = document.getElementById('page_container');
    var h2 = pc.innerHeight || pc.offsetHeight || 0;
    var h3 = h2 + $('table.frame').height() + $('tr.footer_row').height();
    // ако не са създадени елементите, ги създава
    if (document.getElementById('WI_window') === null) {
        $('body').append('<div id="WI_overlay"></div><div id="WI_window"></div>');
    }

    $('#WI_overlay').show();
    $('#WI_overlay').css('height', Math.max(h1,h2,h3) + 'px');

    popupStartLoading();
    $('#WI_window').load(uniqueURL(url), '', function() {
        popupStopLoading();
        if (h1 < $(this).height()) {
            $(this).css({position:'absolute', top:'0', left:'0', width:'100%', height:'100%'});
            $("#WI_window table.container").css('margin-top', 20);
        } else {
            $(this).css('top', (h1 - $(this).height()) / 2);
        }
        $(this).show();
    });

    $(document).bind('keyup', popupKeyUp);
    return false;
}

/**
 * Показва изображение, че се зареждат данни за popup прозореца.
 */
function popupStartLoading() {
    if (document.getElementById('WI_loading') === null) {
        $('body').append('<div id="WI_loading">Зареждане ...<br/><img src="' + loading_image.src + '"/></div>');
    }
}

/**
 * Скрива съобщението, че се зареждат данни за popup прозореца.
 */
function popupStopLoading() {
    $('#WI_loading').hide().empty().remove();
}

/**
 * Изпраща данните от формата към зададения файл за обработка и запис.
 */
function popupSubmit() {
    $('#WI_window form').submit();
}

function popupUpdate () {
    var e = document.documentElement;
    var h1 = window.innerHeight || self.innerHeight || (e && e.clientHeight) || document.body.clientHeight;
    var ph = $('#WI_window').height();
    if (h1 < ph) {
        $('#WI_window').css({position:'absolute', top:'0', left:'0', width:'100%', height: '100%'});
        $('#WI_window .cnt').css({'overflow-y': 'auto', height: h1 - 73, 'margin-bottom': 10});
    } else {
        $('#WI_window').css('top', (h1 - ph) / 2);
    }
}
