
/**
 * Връща позицията на маркираната част от текста в зададеното поле за въвеждане.
 *
 * @param element Поле за въвеждане.
 */
function getSelectionStart (element) {
    if (element.createTextRange) {
        var r = document.selection.createRange().duplicate();
        var s = element.value;
        if (s) {
            r.moveEnd('character', s.length);
            if (r.text == '')
                return s.length;
            return s.lastIndexOf(r.text);
        }
		return 0;
    }
    return element.selectionStart;
}

/**
 * Проверява стойността в поле за въвеждане на реално число.
 * @param o Поле за въвеждане.
 */
function checkElement(o) {
    var w = parseInt(o.getAttribute('whole'));
    if (isNaN(w)) w = 0;
    var p = parseInt(o.getAttribute('precision'));
    if (isNaN(p)) p = 2;
    var c = getElementNumericClass(o);
    if (c) {
        if (c == "float" && o.value != '') {
            var v = getAsFloat(o);
            if (w > 0 && v >= Math.pow(10, w-p)) {
                focusElement(o);
                alert("Стойността в това поле е прекалено голяма за базата данни.");
                return false;
            }
            if (v.toFixed) {
                var s = v.toFixed(p);
                o.value = s.replace(/(0)+$/g, '').replace(/(\.)+$/g, '');
                /*if (o.value == '0') {
                    o.value = '';
                }*/
            }
        }
    }
    return true;
}

/**
 * Проверява дали натиснатият клавиш е валиден и връща стойност true или false.
 *
 * @param tp Тип на данните в елемента за въвеждане: D=дата, F=реално число, I=цяло число.
 * @param obj Елемента за въвеждане, от който са взети данните.
 * @param e Събитието onkeypress.
 */
function checkKeyValid (tp, obj, e) {
    var str = typeof obj.value == 'undefined' ? '' : obj.value;
    if (tp == 'D')
        str = str.replace(/-/, '.').replace(/\//, '.');
    if (tp == 'F')
        str = str.replace(/,/, '.');

    var key = e.charCode ? e.charCode : (e.keyCode ? e.keyCode : (e.which ? e.which : 0));
    if (key == 13)
        return (obj.name.toLowerCase() == "input"); // позволява Enter само ако е в input елемент
    if ((e.ctrlKey && key == 97 /* firefox */) || (e.ctrlKey && key == 65) /* opera */) return true; // позволява Ctrl+A
    if ((e.ctrlKey && key == 120 /* firefox */) || (e.ctrlKey && key == 88) /* opera */) return true; // позволява Ctrl+X (cut)
    if ((e.ctrlKey && key == 99 /* firefox */) || (e.ctrlKey && key == 67) /* opera */) return true; // позволява Ctrl+C (copy)
    if ((e.ctrlKey && key == 122 /* firefox */) || (e.ctrlKey && key == 90) /* opera */) return true; // позволява Ctrl+Z (undo)
    if ((e.ctrlKey && key == 118 /* firefox */) || (e.ctrlKey && key == 86 /* opera */ ) || (e.shiftKey && key == 45)) return true; // позволява Ctrl+V (paste), Shift+Ins
    if (key < 48 || key > 57) {
        if (key == 45 && (tp == 'I' || tp == 'F') && !($(obj).hasClass('int-positive') || $(obj).hasClass('float-positive'))) {
            if (str.length == 0 || (str.length > 0 && str.charAt(0) != '-' && getSelectionStart(obj) == 0))
                return true;
        }
        if ((key == 44 || key == 46) && tp == 'F') {
            if (typeof obj.value == 'undefined' || obj.value == '')
                obj.value = '0';
            if (str.length == 0 || (str.length > 0 && str.indexOf('.') < 0 && str.indexOf(',') < 0))
                return true;
        }
        if ((key == 45 || key == 46 || key == 47) && tp == 'D') {
            if (e.charCode) e.charCode = 46;
            if (e.keyCode) e.keyCode = 46;
            if (str.length == 0 || (str.length > 0 && (str.indexOf('.') >= 0 ? str.indexOf('.',str.indexOf('.') + 1) : -1) < 0))
                return true;
        }
        if (key == 8 || key == 9 || key == 13 || (e.ctrlKey && (key == 35 || key == 36 || key == 37 || key == 39 || key == 46))) {
            if (typeof e.charCode != "undefined") {
                if ((e.keyCode == e.which && e.which != 0) || (e.keyCode != 0 && e.charCode == 0 && e.which == 0))
                    return true;
            }
        }
        return false;
    }
    return true;
}

/**
 * Инициализира зададения елемент за въвеждане на дата.
 * @param element_name Идентификатор на елемента, който да се инициализира.
 */
function inputDateInit (element_name) {
    var $o = $('#' + element_name);
    if ($o) {
        $o.datePicker({startDate:'01.01.1980', endDate:'31.12.2040'});
        $o.bind('keypress', function(e) {
            return checkKeyValid('D', this, e);
        });
        $o.bind('blur', function () {
            var tmp = $(this).val().replace(/-/, ".").replace(/\//, ".");
            $(this).val(tmp);
            var dt = parseDate(tmp);
            //alert('Date: ' + dt + " (" + tmp + ")");
            if (dt) {
                $(this).val(dt);
                $(this).dpSetSelected(dt);
            }
        });
    }
}

/**
 * Проверява дали зададеният стринг съдържа валидна дата във формат "ДД.ММ.ГГГГ".
 * За разделител може да се използва точка ('.'), тире ('-') или наклонена черта ('/').
 * Ако датата е непълна, функцията добавя липсващите части от системата дата,
 * например '1.2' ще стане 1-ви февруари текущата година, а '1' ще стане 1-ви текущите месец и година.
 * Функцията връща обект от тип <code>Date</code>, съдържащ получената дата или <code>null</code>,
 * ако зададената дата е невалидна.
 *
 * @param s Стринг, който да се преобразува в дата.
 */
function parseDate(s) {
    if (s == "") return false;
    s = s.replace(/-/, ".").replace(/\//, ".");
    var yy = -1;
    var mm = -1;
    var dd = -1;
    var a = s.indexOf('.');
    var b = s.indexOf('.', a + 1);
    if (a >= 0) {
        dd = Number(s.substr(0, a));
        if (b > 0) {
            mm = Number(s.substr(a + 1, b - a - 1));
            yy = Number(s.substr(b + 1));
            if (!isNaN(yy) && yy < 100)
                yy += (yy > 30) ? 1900 : 2000;
        } else
            mm = Number(s.substr(a + 1));
    } else
        dd = Number(s);
    var d = new Date();
    if (!isNaN(yy) && yy > 0) d.setFullYear(yy);
    if (!isNaN(mm) && mm > 0) d.setMonth(mm - 1, 1);
    if (!isNaN(dd) && dd > 0) d.setDate(dd);
    //alert('YY=' + yy + ', MM=' + mm + ', DD=' + dd + ', ---> ' + d.asString());
    return isNaN(d.getTime()) ? false : d.asString();
}







/**
 * Връща стойността на зададено поле за въвеждане като реално число.
 * @param o Поле за въвеждане.
 */
function getAsFloat(o) {
    if (o) {
        var v = o.value.replace(/,/, '.');
        if (v) {
            var r = parseFloat(v);
            if (!isNaN(r))
                return r;
        }
    }
    return 0.00;
}

/**
 * Връща типа на зададено поле за въвеждане ('int' или 'float') според неговия клас.
 * Ако не е зададен цифров клас функцията връща стойност <code>null</code>.
 * @param o Поле за въвеждане.
 */
function getElementNumericClass(o) {
    var c;
    var ca = o.className.split(' ');
    if (ca) {
        for (var i = 0; i < ca.length; i++) {
            c = ca[i];
            if (c == "int") return "int";
            if (c == "float") return "float";
        }
    }
    return null;
}

/**
 * Инициализира зададения елемент за въвеждане на градуси-минути-секунди.
 * @param id Идентификатор на елемента, който да се инициализира.
 */
function init_dms_input(id) {
    $('#' + id)
        .bind('keypress', function (e) {
            return checkKeyValid('F', this, e);
        })
        .decimalDegrees();
}
