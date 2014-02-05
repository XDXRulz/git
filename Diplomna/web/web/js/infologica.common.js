
// превеждане съобщенията на datePicker
$.dpText.TEXT_PREV_YEAR	= 'Година назад';
$.dpText.TEXT_PREV_MONTH = 'Месец назад';
$.dpText.TEXT_NEXT_YEAR = 'Година напред';
$.dpText.TEXT_NEXT_MONTH = 'Месец напред';
$.dpText.TEXT_CLOSE = 'Затваряне';
$.dpText.TEXT_CHOOSE_DATE = 'Избор на датата от календар';

/**
 * Определя символа, с който да се добави параметър към зададения интернет адрес.
 * 
 * @param {String} url Интернет адрес, към който ще се добавят параметри.
 * @return {String} Символ '?', ако в зададения адрес няма нито един параметър,
 *     или символ '&', ако в зададения адрес вече има зададени параметри. 
 */
function conjunction (url) {
    return (url.indexOf("?") !== -1 ? "&" : "?");
}

/**
 * Добавя текущите дата и час към зададения URL, за да го направи уникален.
 *
 * @param {String} url Адрес, който да се коригира.
 * @return {String} Зададеният адрес с добавени текущи дата и час.
 */
function uniqueURL (url) {
    return url + conjunction(url) + "random=" + (new Date().getTime());
}

/**
 * Проверява дали зададен елемент съществува и ако не, то той се създава.
 *
 * @param element_id Идентификатор на елемента.
 */
function createHiddentElement (element_id) {
    if ($('#' + element_id).length == 0) {
        $('body').append('<div id="' + element_id + '" style="display:none;"></div>');
    }
}

/**
 * Добавя един невидим блок на страницата, в който се зарежда зададен адрес.
 *
 * @param {String} address Адрес, който да се зареди.
 * @param {String=} element_id Име на елемента, в който да се заредят данните.
 *                      Ако не се зададе, се използва 'action_div'.
 */
function loadScript (address, element_id) {
    if (typeof element_id == 'undefined') {
        element_id = 'script_loader';
    }
    createHiddentElement(element_id);
    $('#' + element_id).load(uniqueURL(address));
    return false;
}
function execHidden(address, element_id) {
    return loadScript(address, element_id);
}

function downloadHidden (url) {
    if ($('#download-ifr').get(0) == null) {
        $("body").append('<iframe id="download-ifr" src="" style="display:none; visibility:hidden;"></iframe>');
    }
    $("#download-ifr").attr('src', url);
    return false;
}


/**
 * Показва съобщение за потвърждение на потребителя и ако се потвърди,
 * зарежда зададения адрес в един невидим блок на страницата.
 *
 * @param {String} message Текст на съобщението за потвърждаване на операцията.
 * @param {String} address Адрес, който да се зареди.
 * @param {String=} element_id Име на елемента, в който да се заредят данните.
 */
function execConfirm (message, address, element_id) {
    if (confirm(message)) {
        loadScript(address, element_id);
    }
    return false;
}

/**
 * Зарежда елементите на зададен ComboBox от базата данни.
 * Използва се като манипулатор на събитието <code>onchange</code> на свързани елементи, т.е.
 * при избиране на стойност от първия елемент, се зареждат съответните стойности във втория и т.н.
 *
 * @param {String} type Показва какво да се зареди от базата данни.
 * @param {String} element Идентификатор на елемента (ComnoBox), в който да се заредят данните
 * @param {String} key Ключ, по който да се филтрират данните от списъка.
 * @param {String} value Стойност, която да се зададе след зареждане стойностите на елемента.
 */
function comboLoad (type, element, key, value) {
    if (typeof key == "undefined") key = '';
    if (typeof value == "undefined") value = '';
    var url = "ComboLoad?t=" + type + "&e=" + element + "&k=" + key + "&v=" + value;
    loadScript(url);
}

function comboLoadWaterRes (element, basin_code, res_type, value) {
    var url = "ComboLoad?t=9&e=" + element + "&b=" + basin_code + "&k=" + res_type + "&v=" + value;
    loadScript(url);
}

function comboLoadMethods (type, element, lab_id, key, value) {
    if (typeof key == "undefined") key = '';
    if (typeof value == "undefined") value = '';
    var url = "ComboLoad?t=" + type + "&e=" + element + "&lab_id=" + lab_id + "&k=" + key + "&v=" + value;
    loadScript(url);
}

function methodUpdate (lab_id, deter_code, num) {
    var url = "ComboLoad?t=10&lab_id=" + lab_id + "&deter_code=" + deter_code + "&num=" + num;
    loadScript(url);
}

/**
 * Изтрива елементите на зададен ComboBox. Ако първият елемент има стойност "" или "0", то той се запазва.
 *
 * @param obj ComboBox, чиито елементи да се изтрият.
 */
function comboReset (obj) {
    var last = 0;
    if (obj && obj.options) {
        if (obj.options.length > 0) {
            if (obj.options[0].value == "" || obj.options[0].value == "0")
                last = 1;
        }
        obj.options.length = last;
    }
}

/**
 * Връща координатите на горния ляв ъгъл на зададения елемент от страницата.
 * Тази функция се използва от функцията <code>gotoName</code>,
 * за да определи координатите, на които да премести страницата.
 * 
 * @param element Елемент, чиито координати да се върнат.
 */
function getPageXY (element) {
    var res = {x:0, y:0};
    for (var node = element; node; node = node.offsetParent) {
        res.x += node.offsetLeft;
        res.y += node.offsetTop;
    }
    return res;
}

/**
 * Премества страницата до зададения елемент.
 * Функцията първо търси името на елемента в списъка "котви" (anchors) в документа.
 * Ако не е намерен, търси елемент със същия идентификатор.
 * 
 * @param name Наименование на "котвата" или елемента, до който да се премести страницата.
 */
function gotoName (name) {
    var anchors = document.anchors;
    var anchor = anchors[name];
    if (!anchor) { // IE sucks
        for (var i = 0; i < anchors.length; ++i) {
            if (anchors[i].name == name) {
                anchor = anchors[i];
                break;
            }
        }
    }
    anchor = anchor ? anchor : $('#' + name)[0];
    if (anchor) {
        var XY = getPageXY(anchor);
        window.scrollTo(XY.x, XY.y);
    }
}

/**
 * Премества фокуса върху зададения елемент от страницата.
 * @param element Име на елемента, който да се фокусира, или обекта на самия елемент.
 */
function focusElement(element) {
    var obj = $('#' + element).get(0);
    if (obj) {
        $(obj).focus();
        if ($(obj).val() != '')
            $(obj).select();
    } else {
        $(element).focus();
        if ($(element).val() != '')
            $(element).select();
    }
}

function fixedPopup() {
    var $popup = $('#WI_window');
    return ($popup && $popup.css("position").toLowerCase() == "absolute");
}
