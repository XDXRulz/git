(function($){
    
	$.fn.extend({

        /**
         * Създава прозорче за въвеждане на градуси-минути-секунди,
         * асоциирано към всеки от отговарящите елементи.
         */
        decimalDegrees : function() {
            if (!$.event._ddCache)
                $.event._ddCache = [];

            return this.each(function() {
                var $this = $(this);
                var already_exists = true;
                if (!this._ddID) {
                    this._ddID = $.guid++;
                    $.event._ddCache[this._ddID] = new DecimalDegrees(this);
                    already_exists = false;
                }
                var controller = $.event._ddCache[this._ddID];
                if (!already_exists) {
                    controller.button = $('<a href="#" class="dd-dms" title="' + $.ddText.TEXT_BUTTON_TITLE + '">'
                            + $.ddText.TEXT_BUTTON_VALUE + '</a>')
                        .bind('click', function() {
                            $this.ddDisplay(this);
                            this.blur();
                            return false;
                        });
                    $this.after(controller.button);
                }
                if (!already_exists && $this.is(':text')) {
                    $this.bind('change', function() {
                        controller.setValue(this.value);
                    });
                    if (this.value != '') {
                        controller.setValue(this.value);
                    }
                }
                $this.addClass('dd-applied');
            })
        },

        /**
         * Забранява или разрешава прозореца за въвеждане на градуси-минути-секунди.
         * @param s Булева стойност, която показва дали да се забрани (true) или разреши (false) прозореца за въвеждане.
         *
         * @example $('.dms').decimalDegrees();
         * $('.dms').ddSetDisabled(true);
         * @desc Забранява показване на прозореца. Ако асоциираният елемент е поле за въвеждане,
         * то също се забранява, за да не може да се въвеждат данни в него.
         */
        ddSetDisabled : function(s) {
            return _ddw.call(this, 'setDisabled', s);
        },

        /**
         * Връща въведената в прозореца стойност като десетични градуси или <code>null</code>, ако към зададения
         * елемент няма асоцииран прозорец за въвеждане на градуси-минути-секунди.
         *
         * @example $('.dms').decimalDegrees();
         * alert($('.dms').ddGetValue());
         * @desc Ще върне 0.00000000, защото все още нищо не е въведено.
         */
        ddGetValue : function() {
            var c = _getController(this[0]);
            return c ? c.getValue() : null;
        },

        /**
         * Задава стойност на всички отговарящи прозорци за въвеждане на градуси-минути-секунди.
         * @param v Десетичните градуси, които да се зададат.
         *
         * @example $('.dms').decimalDegrees();
         * $('.dms').ddSetValue(11.375925);
         * @desc Създава прозорците за въвеждане на градуси-минути-секунди за всички отговарящи елементи,
         * след което задава стойността им на 11 градуса, 22 минути и 33.33 секунди.
         */
        ddSetValue : function(v) {
            return _ddw.call(this, 'setValue', v);
        },

        /**
         * Показва прозореца за въвеждане на градуси-минути-секунди на всички отговарящи елементи.
         * Тъй като само един прозорец за въвеждане може да е показан по едно и също време, 
         * ще се покаже прозореца на последния отговарящ елемент.
         * @param e Елемент, към когото да се подравни позицията на прозореца.
         * Незадължителен параметър - по подразбиране прозореца се подравнява към елемента, към който е асоцииран.
         *
         * @example $('#dms').decimalDegrees();
         * $('#dms').ddDisplay();
         * @desc Създава прозорец за въвеждане към елемента със зададения идентификатор и след това го показва.
         */
        ddDisplay : function(e) {
            return _ddw.call(this, 'display', e);
        },

        /**
         * Затваря отворения прозорец асоцииран със зададения елемент.
         *
         * @example $('.dms').decimalDegrees()
         *              .bind('focus', function() { $(this).ddDisplay(); })
         *              .bind('blur', function() { $(this).ddClose(); });
         * @desc Създава прозорец за въвеждане и го показва, когато елементът, към който е асоцииран получи
         * фокуса, и го затваря след излизане от елемента.
         */
        ddClose : function() {
            return _ddw.call(this, '_closeDMS', this[0]);
        }
    });

    // функция за вътрешно ползване, to cut down on the amount of code needed where we forward
    // dp* methods on the jQuery object on to the relevant DatePicker controllers...
    var _ddw = function(f, a) {
        return this.each(function() {
            var c = _getController(this);
            if (c) c[f](a);
        });
    };
	
    function DecimalDegrees(ele) {
        this.ele = ele;
        this.button = null;
    }

    $.extend(
        DecimalDegrees.prototype, {
            setDisabled: function(s) {
                var e = $(this.ele);
                e[s ? 'addClass' : 'removeClass']('dd-disabled');
                if (this.button) {
                    var b = $(this.button);
                    b[s ? 'addClass' : 'removeClass']('dd-disabled');
                    b.attr('title', s ? '' : $.ddText.TEXT_BUTTON_TITLE);
                }
                if (e.is(':text')) {
                    e.prop('disabled', s);
                }
            },
            setValue: function(v) {
                var _set = function(n, v) {
                    $('#' + n, '#dd-popup').val(v);
                };
                var a = parseFloat(v);
                if (!isNaN(a)) {
                    var k = 1000000;
                    var sgn = a < 0 ? -1 : 1;
                    a = Math.abs(Math.round(a * k));
                    while (a > 180. * k) {
                        a -= 360. * k;
                    }
                    sgn = a * sgn < 0 ? -1 : 1;
                    a = Math.abs(a);
                    if (a > 0) {
                        _set('deg', Math.floor(a / k) * sgn);
                        _set('min', Math.floor(((a / k) - Math.floor(a / k)) * 60));
                        _set('sec', (Math.floor(((((a / k) - Math.floor(a / k)) * 60)
                            - Math.floor(((a / k) - Math.floor(a / k)) * 60)) * k) * 60 / k).toFixed(2));
                        return;
                    }
                }
                _set('deg', '');
                _set('min', '');
                _set('sec', '');
            },
            getValue: function() {
                var _get = function(n) {
                    var e = $('#' + n, '#dd-popup');
                    if (e) {
                        var a = parseFloat(e.val());
                        if (!isNaN(a)) return a;
                    }
                    return 0.;
                };
                return _get('deg') + _get('min') / 60. + _get('sec') / 3600.;
            },

            display: function(eleAlignTo) {
                if ($(this.ele).is('.dd-disabled')) return;

                eleAlignTo = eleAlignTo || this.ele;
                var c = this;
                var $ele = $(eleAlignTo);
                var eleOffset = $ele.offset();

                this._checkMouse = function(e) {
                    var el = e.target;
                    var cal = $('#dd-popup')[0];
                    while (true){
                        if (el == cal) {
                            return true;
                        } else if (el == document) {
                            c._closeDMS();
                            return false;
                        } else {
                            el = $(el).parent()[0];
                        }
                    }
                };
                this._closeDMS();
                /*
                 $('body').append($('<div id="dd-popup" class="dd-popup"></div>')
                 .css({'top': eleOffset.top, 'left': eleOffset.left})
                 .append($('<table></table>').attr('class', 'jDecimalDegrees')
                 .append(
                 $('<tr></tr>').append("<td></td>").append(
                 $('<input/>').attr({'type':'text', 'id':'deg', 'maxlength':3}),
                 $.ddText.TEXT_DEGREES,
                 $('<input/>').attr({'type':'text', 'id':'min', 'maxlength':2}),
                 $.ddText.TEXT_MINUTES,
                 $('<input/>').attr({'type':'text', 'id':'sec'}),
                 $.ddText.TEXT_SECONDS),
                 $('<tr></tr>').append('<td class="foot"></td>').append(
                 $('<br/>'),
                 $('<input/>').attr({'type':'button', 'className':'dd-btn', 'id':'ruchSave', 'value':$.ddText.TEXT_BUTTON_SELECT})
                 .bind("click", function() {
                 var f = parseFloat(c.getValue());
                 $(c.ele).val(isNaN(f) ? "" : f.toFixed(8));
                 c._closeDMS();}),
                 $('<input/>').attr({'type':'button', 'className':'dd-btn', 'id':'ruchCancel', 'value':$.ddText.TEXT_BUTTON_CANCEL})
                 .bind("click", function() { c._closeDMS(); })))).bgIframe());
                 */
                var $btn_save = $('<input/>')
                    .attr({
                        'type': 'button',
                        'class': 'dd-btn',
                        'id': 'RuchSave',
                        'value': $.ddText.TEXT_BUTTON_SELECT
                    })
                    .bind('click', function () {
                        var f = parseFloat(c.getValue());
                        $(c.ele).val(isNaN(f) ? "" : f.toFixed(8));
                        c._closeDMS();
                    });
                var $btn_cancel = $('<input/>')
                    .attr({
                        'type': 'button',
                        'class': 'dd-btn',
                        'id': 'RuchCancel',
                        'value': $.ddText.TEXT_BUTTON_CANCEL
                    })
                    .bind('click', function () { c._closeDMS(); });
                $('body').append(
                    $('<div></div>')
                        .attr({ 'id':'dd-popup', 'class':'dd-popup' })
                        .css({ 'top':eleOffset.top, 'left':eleOffset.left })
                        .append($('<table></table>')
                            .attr({ 'class':'jDecimalDegrees' })
                            .append('<tr><td>' +
                                '<input type="text" id="deg" maxlength="3"/>' + $.ddText.TEXT_DEGREES +
                                '<input type="text" id="min" maxlength="2"/>' + $.ddText.TEXT_MINUTES +
                                '<input type="text" id="sec"/>' + $.ddText.TEXT_SECONDS +
                                '</td></tr>')
                            .append($('<tr></tr>')
                                .append($('<td></td>').attr({ 'class':'foot' })
                                    .append($btn_save)
                                    .append($btn_cancel)))
                        )
                        .bgIframe()
                );
                $(document).bind('mousedown', this._checkMouse);
                /*
                $(document).bind(
                    'keydown.datepicker',
                    function(event)
                    {
                        if (event.keyCode == 27) {
                            c._closeCalendar();
                        }
                    }
                );
                */
                c.setValue($(c.ele).val());
                if (fixedPopup()) {
                    $('div#dd-popup').css('position', 'fixed');
                }
            },

        _closeDMS : function(ele) {
            if (!ele || ele == this.ele) {
                $(document).unbind('mousedown', this._checkMouse);
                $('#dd-popup .dd-btn').unbind();
                $('#dd-popup').empty().remove();
            }
        }
	});
	
    $.ddText = {
        TEXT_BUTTON_TITLE: 'Въвеждане като градуси-минути-секунди',
        TEXT_BUTTON_VALUE: 'ГМС',
        TEXT_DEGREES: '&deg;&nbsp;',
        TEXT_MINUTES: '\'&nbsp;',
        TEXT_SECONDS: '"',
        TEXT_BUTTON_SELECT: 'Запиши',
        TEXT_BUTTON_CANCEL: 'Откажи'
    };

    function _getController(ele) {
        return ele._ddID ? $.event._ddCache[ele._ddID] : false;
	}
	
    // make it so that no error is thrown if bgIframe plugin isn't included (allows you to use conditional
    // comments to only include bgIframe where it is needed in IE without breaking this plugin).
    if ($.fn.bgIframe == undefined) {
        $.fn.bgIframe = function() { return this; };
    }

})(jQuery);