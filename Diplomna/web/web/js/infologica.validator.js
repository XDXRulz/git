/**
 * Клас за валидиране на протребителски вход от форми на браузъра (JS client validation).
 * Поддържа проверка на полета от форма за:
 *  - празна стойност (дали е подадена такава)
 *  - дължина на стойност
 *  - разширение на файл
 * @constructor
 * @requires jQuery (http://jquery.com/)
 * @requires sprintf (https://github.com/alexei/sprintf.js)
 * @author Живко Желязков, Василен Дончев
 * @version 2013-05-30
 */
InfoLogicaJsValidatorClass = function ( )
{
    /**
     * Настройки на валидатора. Изнесени са в този метод за лесно конфигуриране.
     * @return {Object}
     */
    this.getSettings = function ( )
    {
        return {
            /**
             * Регулярен израз за валидна дата (български формат: ДД.ММ.ГГГГ, годината е от вида 19xx или 20xx)
             */
            "regExDate" : /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d$/,
            /**
             * Код, указващ, че очакваният тип данни от поле, е дата.
             */
            "typeDate" : "D",
            /**
             * Код, указващ, че очакваният тип данни от поле, е цяло число.
             */
            "typeInt" : "I",
            /**
             * Код, указващ, че очакваният тип данни от поле, е десетична дроб.
             */
            "typeFloat" : "F",
            /**
             * Tип на форма за валидиране "таблица" (form-grid).
             */
            "formTypeTable" : "table",
            /**
             * Тип на форма за валидиране "не в таблица" (inline)
             */
            "formTypeInline" : "inline",
            /**
             * CSS клас, който да се задава на поле, което се очаква да е положително цяло число.
             */
            "intPositiveClass" : "int-positive",
            /**
             * CSS клас, който да се задава на поле, което се очаква да е положителна десетична дроб.
             */
            "floatPositiveClass" : "float-positive",

            "spanTableNotEmpty" : "span-table-not-empty",
            /**
             * CSS клас, който да се задава на всички полета от форма, които не трябва да са празни.
             */
            "notEmptyValidatorClass" : "validator-not-empty",
            /**
             * CSS клас, който да се задава на всички полета от форма, които трябва да се проверяват за
             * дължина на стойността.
             */
            "lengthValidatorClass" : "validator-length",
            /**
             * CSS клас, който да се задава на всички полета за качване на файл от форма, които да се
             * проверяват за разширение на файла.
             */
            "fileValidatorClass" : "validator-file",
            /**
             * CSS клас(-ове), който се прилага към контейнера, съдържащ съобщение за грешно попълнено поле.
             */
            "errorMessageContainerClass" : "validator-error",
            /**
             * CSS клас(-ове), който се прилага към полето, което е попълнено грешно.
             */
            "errorFieldClass" : "validator-error-field",
            /**
             * CSS клас(-ове), който се прилага към съобщението за грешно попълнено поле.
             */
            "errorMessageClass" : "validator-error-message ui-corner-all",
            /**
             * Име на атрибут, в който да се зададе максимално допустимата дължина (вкл.) за поле, което се валидира.
             * Атрибутът се задава на полето за валидиране. То трябва да e със зададен CSS клас за валидиране на
             * дължина (lengthValidatorClass)
             */
            "maxLengthAttribute" : "data-validator-maxlen",
            /**
             * Име на атрибут, в който да се зададе минимално допустимата дължина (вкл.) за поле, което се валидира.
             * Атрибутът се задава на полето за валидиране. То трябва да e със зададен CSS клас за валидиране на
             * дължина (lengthValidatorClass)
             */
            "minLengthAttribute" : "data-validator-minlen",
            /**
             * Име на атрибут, в който да се зададе съобщението за грешка, което да се покаже, ако стойността не се
             * валидира. Атрибутът се задава на полето за валидиране. Ако не е зададен този атрибут, се използва
             * съобщението за грешка по подразбиране.
             */
            "errorTextAttribute" : "data-validator-error",
            /**
             * Име на атрибут, в който да се зададат допустимите разширения за файл, разделени със запетая. Атрибутът
             * се задава на полето за валидиране. То трябва да e със зададен CSS клас за валидиране на разширение на
             * файл (lengthValidatorClass)
             */
            "fileTypesAttribute" : "data-validator-filetypes",
            /**
             * Шаблон за sprintf за съобщение за поле, което не се валидира, когато формата е в таблица (form-grid).
             * Шаблонът се използва за тип на формата formTypeTable.
             */
            "errorMessageTable" : '<tr class="%s">' +
                                        '<td colspan="2">' +
                                            '<div class="%s">' +
                                                '%s' +
                                            '</div>' +
                                        '</td>' +
                                   '</tr>',
            /**
             * Шаблон за sprintf за съобщение за поле, което не се валидира, когато формата не е в таблица.
             * Шаблонът се използва за тип на формата formTypeInline.
             */
            "errorMessageInline" : '<div class="%s %s">%s</div>',
            /**
             * Асоциативен масив с текстови съобщения.
             */
            "messages" : {
                /**
                 * Съобщение за грешка по подразбиране, когато е стойност е празна.
                 */
                "notEmpty" : "Полето е задължително.",
                /**
                 * Начало на съобщението за грешка по подразбиране, когато стойността на поле няма зададена дължина.
                 */
                "notInLength" : "Дължината на полето ",
                /**
                 * Продължение на съобщението за грешка по подразбиране, когато стойността на поле няма дължина в даден интервал.
                 */
                "notInLengthInterval" : "трябва да е между %d и %d.",
                /**
                 * Продължение на съобщението за грешка по подразбиране, когато дължината на стойността на поле надхвърля
                 * максимална стойност.
                 */
                "notInLengthMax" : "не трябва да превишава %d.",
                /**
                 * Продължение на съобщението за грешка по подразбиране, когато дължината на стойността на поле е под
                 * минимална стойност.
                 */
                "notInLengthMin" : "трябва да е поне %d.",
                /**
                 * Съобщение за грешка по подразбиране, когато разширението на файл не се допуска.
                 */
                "disallowedFileType" : "Форматът на файла не е позволен за качване."
            }
        };
    };



    // начало: PUBLIC методи
    /**
     * Проверява дали cookies са позволени на браузъра. Използва JS променливата navigator.
     * @return <code>true</code>, ако cookies може да се четат и записват
     */
    this.cookiesAreEnabled = function ( )
    {
        return navigator.cookieEnabled;
    };

    /**
     * Проверява дали стойност е празна.
     * @param {Object} value
     * @return {Boolean} <code>true</code>, ако е празна (undefined, null или нулева дължина след премахване на whitespace в
     * началото и края); <code>false</code> - в противен случай
     */
    this.isEmpty = function ( value )
    {
        return value == undefined || value == null || value.toString().trim().length == 0;
    };

    /**
     * Проверява дали низ e число. Връща стойността от isValidFloat
     * @param n низ за проверка
     * @return {Boolean} <code>true</code>, ако низът съдържа десетична дроб (реално) с десетична точка или запетая,
     * научен запис (с мантиса и порядък) или 16-/8-десетично представяне.
     * Между знака минус и първата цифра (ако числото е отрицателно) не трябва да има white space.
     * <code>false</code> в останалите случаи (вкл. undefined и null)
     * Връщани стойности:
     * <blockquote><pre>
     * undefined    =>      false,
     * null         =>      false,
     * ''           =>      false,
     * '  '         =>      false,
     * 0            =>      true,
     * 0.1          =>      true,
     * 1            =>      true,
     * "2.0"        =>      true,
     * 2.1          =>      true,
     * "2.3"        =>      true,
     * "2,4"        =>      true,
     * -0.1         =>      true,
     * "-0,2"       =>      true,
     * "-1"         =>      true,
     * "- 0,1"      =>      false,
     * " - 2"       =>      false,
     * "- 1"        =>      false,
     * "foo"        =>      false,
     * "a3"         =>      false,
     * "3a"         =>      false,
     * "3 a"        =>      false,
     * "4e-2"       =>      true,
     * "4E+3"       =>      true,
     * 4e-5         =>      true,
     * 4e+2         =>      true,
     * 0xaf6        =>      true,
     * 0777         =>      true,
     * "0xaf6"      =>      true,
     * "0777"       =>      true,
     * "0b110"      =>      false,
     * "Inf"        =>      false,
     * "Infinity"   =>      false,
     * 1/0          =>      false,
     * -1/0         =>      false,
     * NaN          =>      false,
     * "NaN"        =>      false,
     * "1/2"        =>      false,
     * "0/0"        =>      false
     * </pre></blockquote>
     * @see validator.isValidFloat
     */
    this.isNumber = function ( n )
    {
        return validator.isValidFloat ( n );
    };

    /**
     * Проверява дали стойност е валидна българска дата (ДД.ММ.ГГГГ -> годината е между 1900 и 2099).
     * Внимание: проверката е с регулярен израз и няма как да "хване" изпозване на 29.02 за невисокосна година
     * или 31.04 (за месец, имащ 30 дни). За това е по-добре да се използва parseDate, която при такива несъществуващи
     * дата връща следващата валидна дата (примерно за 29.02.2013 ще даде 01.03.2013). На стойността от parseDate може
     * да се приложи asString за форматиране в ДД.ММ.ГГГГ
     * @param value
     * @return {Boolean} <code>true</code>, ако датата изглежда валидна според регулярен израз
     * @see parseDate
     */
    this.isValidDate = function ( value )
    {
        return validator.getSettings().regExDate.test ( value );
    };

    /**
     * Проверява дали низ представлява валидна десетична дроб (реално число).
     * @param value низ за проверка
     * @return {Boolean} <code>true</code>, ако низът съдържа десетична дроб (реално) с десетична точка или запетая,
     * научен запис (с мантиса и порядък) или 16-/8-десетично представяне.
     * Между знака минус и първата цифра (ако числото е отрицателно) не трябва да има white space.
     * <code>false</code> в останалите случаи (вкл. undefined и null)
     * Връщани стойности:
     * <blockquote><pre>
     * undefined    =>      false,
     * null         =>      false,
     * ''           =>      false,
     * '  '         =>      false,
     * 0            =>      true,
     * 0.1          =>      true,
     * 1            =>      true,
     * "2.0"        =>      true,
     * 2.1          =>      true,
     * "2.3"        =>      true,
     * "2,4"        =>      true,
     * -0.1         =>      true,
     * "-0,2"       =>      true,
     * "-1"         =>      true,
     * "- 0,1"      =>      false,
     * " - 2"       =>      false,
     * "- 1"        =>      false,
     * "foo"        =>      false,
     * "a3"         =>      false,
     * "3a"         =>      false,
     * "3 a"        =>      false,
     * "4e-2"       =>      true,
     * "4E+3"       =>      true,
     * 4e-5         =>      true,
     * 4e+2         =>      true,
     * 0xaf6        =>      true,
     * 0777         =>      true,
     * "0xaf6"      =>      true,
     * "0777"       =>      true,
     * "0b110"      =>      false,
     * "Inf"        =>      false,
     * "Infinity"   =>      false,
     * 1/0          =>      false,
     * -1/0         =>      false,
     * NaN          =>      false,
     * "NaN"        =>      false,
     * "1/2"        =>      false,
     * "0/0"        =>      false
     * </pre></blockquote>
     */
    this.isValidFloat = function ( value )
    {
        if ( value == undefined || value == null )
        {
            return false;
        }
        var v = value.toString().replace ( ',', '.' );
        return !isNaN ( parseFloat ( v ) ) && isFinite ( v );
    };

    /**
     * Проверява дали низ представлява валидно цяло число. Не приема празен низ, низ, съставен от whitespace или десетични дроби.
     * @param value низ за проверка
     * @return {Boolean} <code>true</code>, ако низът съдържа цяло число (0, положително, отрицателно или десетична дроб с дробна част 0)
     * в 8-/10-/16-десетичен или научен (мантиса и порядък) запис.
     * Между знака минус и първата цифра (ако числото е отрицателно) не трябва да има white space.
     * <code>false</code> в останалите случаи (вкл. десетична дроб с дробна част != 0, празен низ, низ от whitespace, undefined и null).
     * Връщани стойности:
     * <blockquote><pre>
     * undefined    =>      false,
     * null         =>      false,
     * ''           =>      false,
     * '  '         =>      false,
     * 0            =>      true,
     * 0.1          =>      false,
     * 1            =>      true,
     * "2.0"        =>      true,
     * 2.1          =>      false,
     * "2.3"        =>      false,
     * "2,4"        =>      false,
     * -0.1         =>      false,
     * "-0,2"       =>      false,
     * "-1"         =>      true,
     * "- 0,1"      =>      false,
     * " - 2"       =>      false,
     * "- 1"        =>      false,
     * "foo"        =>      false,
     * "a3"         =>      false,
     * "3a"         =>      false,
     * "3 a"        =>      false,
     * "4e-2"       =>      false,
     * "4E+3"       =>      true,
     * 4e-5         =>      false,
     * 4e+2         =>      true,
     * 0xaf6        =>      true,
     * 0777         =>      true,
     * "0xaf6"      =>      true,
     * "0777"       =>      true,
     * "0b110"      =>      false,
     * "Inf"        =>      false,
     * "Infinity"   =>      false,
     * 1/0          =>      false,
     * -1/0         =>      false,
     * NaN          =>      false,
     * "NaN"        =>      false,
     * "1/2"        =>      false,
     * "0/0"        =>      false
     * </pre></blockquote>
     */
    this.isValidInteger = function ( value )
    {
        return !isNaN ( parseInt ( value, 10 ) ) && isFinite ( value ) && value % 1 === 0;
    };

    /**
     * Метод, който да се вика при натискане на бутон от клавиатурата, за да допуска само
     * позволени символи в поле от даден тип. Поддържаните типове са дата (typeDate), цяло число
     * (typeInt) и десетична дроб (typeFloat). Позволени клавиши за полетата по типове:
     *  - DATA (дата):
     *  - INT (цяло число):
     *  - FLOAT (десетична дроб):
     * @param {String} tp тип: (typeDate|typeFloat|typeInt)
     * @param {HTMLBRElement} obj обект на полето
     * @param {KeyboardEvent} e обект на събитието
     * @return {Boolean} true, за да позволи символа; false - за да го забрани.
     */
    this.checkInputKey = function ( tp, obj, e )
    {
        var str = typeof obj.value == 'undefined' ? '' : obj.value;
        if ( tp == validator.getSettings().typeDate )
        {
            str = str.replace ( /-/, '.' ).replace ( /\//, '.' );
        }
        if ( tp == validator.getSettings().typeFloat )
        {
            str = str.replace ( /,/, '.' );
        }

        var key = e.charCode ? e.charCode : ( e.keyCode ? e.keyCode : ( e.which ? e.which : 0 ) );
        if ( key == 13 )
        {
            return obj.name.toLowerCase ( ) == "input"; // позволява Enter само ако е в input елемент
        }
        if ( ( e.ctrlKey && key == 97 /* firefox */ ) || ( e.ctrlKey && key == 65 ) /* opera */ )
        {
            return true; // позволява Ctrl+A
        }
        if ( ( e.ctrlKey && key == 120 /* firefox */ ) || ( e.ctrlKey && key == 88 ) /* opera */ )
        {
            return true; // позволява Ctrl+X (cut)
        }
        if ( ( e.ctrlKey && key == 99 /* firefox */ ) || ( e.ctrlKey && key == 67 ) /* opera */ )
        {
            return true; // позволява Ctrl+C (copy)
        }
        if ( ( e.ctrlKey && key == 122 /* firefox */ ) || ( e.ctrlKey && key == 90 ) /* opera */ )
        {
            return true; // позволява Ctrl+Z (undo)
        }
        if ( ( e.ctrlKey && key == 118 /* firefox */ ) || ( e.ctrlKey && key == 86 /* opera */ ) || ( e.shiftKey && key == 45 ) )
        {
            return true; // позволява Ctrl+V (paste) и Shift+Ins
        }

        if ( key < 48 || key > 57 ) // ако не е цифра
        {
            if ( key == 45 && ( tp == validator.getSettings().typeInt || tp == validator.getSettings().typeFloat ) && !( $( obj ).hasClass ( validator.getSettings().intPositiveClass ) || $( obj ).hasClass( validator.getSettings().floatPositiveClass ) ) ) // Insert
            {
                if ( str.length == 0 || ( str.length > 0 && str.charAt ( 0 ) != '-' && this.selectionStart ( obj ) == 0 ) )
                {
                    return true;
                }
            }
            if ( ( key == 44 || key == 46 ) && tp == validator.getSettings().typeFloat ) // Delete
            {
                if ( typeof obj.value == 'undefined' || obj.value == '' )
                {
                    obj.value = '0';
                }
                if ( str.length == 0 || ( str.length > 0 && str.indexOf ( '.' ) < 0 && str.indexOf ( ',' ) < 0 ) )
                {
                    return true;
                }
            }
            if ( ( key == 45 || key == 46 || key == 47 ) && tp == validator.getSettings().typeDate )  // Insert, Delete
            {
                if ( e.charCode )
                {
                    e.charCode = 46;
                }
                if ( e.keyCode )
                {
                    e.keyCode = 46;
                }
                if ( str.length == 0 || ( str.length > 0 && ( str.indexOf ( '.' ) >= 0 ? str.indexOf ( '.', str.indexOf ( '.' ) + 1 ) : -1 ) < 0 ) )
                {
                    return true;
                }
            }
            if ( key == 8 || key == 9 || key == 13 || ( e.ctrlKey && ( key == 35 || key == 36 || key == 37 || key == 39 || key == 46 ) ) ) // backspace, tab, enter; Ctrl+ (end|home|left arrow|right arrow|delete)
            {
                if ( typeof e.charCode != "undefined" )
                {
                    if ( ( e.keyCode == e.which && e.which != 0 ) || ( e.keyCode != 0 && e.charCode == 0 && e.which == 0 ) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }
        return true;
    };

    /**
     * Скрива всички съобщения за грешки от валидация и премахва CSS класа за грешка от невалидираните полета.
     */
    this.hideErrorMessages = function ( )
    {
        $( "." + validator.getSettings().errorMessageContainerClass ).remove ( );
        $( "input, select, textarea" ).removeClass ( validator.getSettings().errorFieldClass );
    };

    /**
     * Валидира поле за празна стойност. Ако стойността му е празна, показва съобщение за грешка.
     * @param {jQuery} $obj jQuery обект на полето за валидиране
     * @param {String} message [optional] текст на съобщението за грешка. Ако не е подаден текст или е празен, се
     * използва съобщението за грешка от празен текст по подразбиране (messages.notEmpty)
     * @param {String} type тип на формата, съдържаща полето
     * @return {Boolean} true, ако полето НЕ се валидира (т.е. има празна стойност); false, ако полето СЕ валидира
     */
    this.validateNotEmpty = function ( $obj, message, type )
    {
        if ( validator.isEmpty ( $obj.val ( ) ) )
        {

            console.log ( sprintf ( "%s is empty, value='%s'", $obj.attr('id'), $obj.val() ) );

            if ( validator.isEmpty ( message ) )
            {
                message = validator.getSettings().messages.notEmpty;
            }
            generateErrorMessage ( $obj, message, type );
            return true;
        }
        return false;
    };

    /**
     * Валидира поле за дължина на стойност в даден интервал. Ако стойността не е в дадения интервал, се показва
     * съобщение за грешка. Стойностите за минимална и максимална дължина се задават като атрибути на полето за
     * валидиране (minLengthAttribute за минимална дължина и maxLengthAttribute за максимална).
     * @param {jQuery} $obj jQuery обект на полето за валидиране
     * @param {String} message [optional] текст на съобщението за грешка. Ако не е подаден текст или е празен, се
     * генерира съобщението за грешка на база съобщенията по подразбиране (messages.notInLength,
     * messages.notInLengthInterval, messages.notInLengthMin, messages.notInLengthMax) и това дали са
     * подадени минимална/максимална стойност.
     * @param {String} type тип на формата, съдържаща полето
     * @return {Boolean} true, ако полето НЕ се валидира (т.е. няма желаната дължина); false, ако полето СЕ валидира
     */
    this.validateLength = function ( $obj, message, type )
    {
        var min = parseInt ( $obj.attr ( validator.getSettings().minLengthAttribute ), 10 );
        var max = parseInt ( $obj.attr ( validator.getSettings().maxLengthAttribute ), 10 );
        var len = $obj.val ( ).length || 0;

        if ( !isNaN ( min ) )
        {
            if ( len < min )
            {
                if ( validator.isEmpty ( message ) )
                {
                    message = validator.getSettings().messages.notInLength;
                    if ( !isNaN ( max ) )
                    {
                        message += sprintf ( validator.getSettings().messages.notInLengthInterval, min, max )
                    }
                    else
                    {
                        message += sprintf ( validator.getSettings().messages.notInLengthMin, min );
                    }
                }

                generateErrorMessage ( $obj, message, type );
                return true;
            }
        }
        if ( !isNaN ( max ) )
        {
            if ( len > max )
            {
                if ( validator.isEmpty ( message ) )
                {
                    message = validator.getSettings().messages.notInLength;
                    if ( !isNaN ( min ) )
                    {
                        message += sprintf ( validator.getSettings().messages.notInLengthInterval, min, max )
                    }
                    else
                    {
                        message += sprintf ( validator.getSettings().messages.notInLengthMax, max );
                    }
                }

                generateErrorMessage ( $obj, message, type );
                return true;
            }
        }

        return false;
    };

    /**
     * Валидира разширението на файл, подаден във форма за качване. Допустимите разширения се подават като низ в
     * атрибута fileTypesAttribute на полето за валидиране, като всяко разширение е разделено със запетая.
     * @param {jQuery} $obj jQuery обект на полето за валидиране
     * @param {String} message [optional] текст на съобщението за грешка. Ако не е подаден текст или е празен, се
     * използва съобщението за грешно разширение на файл по подразбиране (messages.disallowedFileType)
     * @param {String} type тип на формата, съдържаща полето
     * @return {Boolean} true, ако полето НЕ се валидира (т.е. има празна стойност); false, ако полето СЕ валидира
     */
    this.validateFileType = function ( $obj, message, type )
    {
        var acceptedFileTypes = $obj.attr ( validator.getSettings().fileTypesAttribute );
        if ( !validator.isEmpty ( acceptedFileTypes ) )
        {
            acceptedFileTypes = acceptedFileTypes.split ( ',' );
            var value = $obj.val ( );
            if ( !validator.isEmpty ( value ) )
            {
                var dots = value.split ( "." );
                var extension = dots [ dots.length - 1 ].toLowerCase ( );
                if ( acceptedFileTypes.indexOf ( extension ) >= 0 )
                {
                    return false;
                }

                if ( validator.isEmpty ( message ) )
                {
                    message = validator.getSettings().messages.disallowedFileType;
                }
                generateErrorMessage ( $obj, message, type );
                return true;
            }
            return false;
        }
        return false;
    };


    /**
     * Инициализира валидатора с полета за валидиране.
     * @param {String} type тип на формата, съдържаща полето: validator.getSettings().formTypeTable - ако полетата са в таблица с 2 колони (form-grid)
     * или validator.getSettings().formTypeInline - ако полетата не са в таблица
     */

    this.initFieldsValidators = function ( type )
    {
        $( '.' + validator.getSettings().notEmptyValidatorClass ).each ( function ( idx, data )
        {
            var $obj = $( data );
            fields.push ( { "validate": function ( )
            {
                return validator.validateNotEmpty ( $obj, $obj.attr ( validator.getSettings().errorTextAttribute ), type );
            }});
        });

        $( '.' + validator.getSettings().lengthValidatorClass ).each ( function ( idx, data )
        {
            var $obj = $( data );
            fields.push ( { "validate": function ( )
            {
                return validator.validateLength ( $obj, $obj.attr ( validator.getSettings().errorTextAttribute ), type );
            }});
        });

        $( '.' + validator.getSettings().fileValidatorClass ).each ( function ( idx, data )
        {
            var $obj = $( data );
            fields.push ( { "validate": function ( )
            {
                return validator.validateFileType ( $obj, $obj.attr ( validator.getSettings().errorTextAttribute ), type );
            }});
        });
    };

    /**
     * Валидира полетата от форма в диалогов прозорец и ако всички данни са коректни, изпраща формата.
     * В противен случай показва съобщения за грешка за полетата, които не се валидират и центрира
     * наново диалоговия прозорец.
     * @requires InfoLogicaPopupsClass инстанция в променлива <code>popup</code>
     * @return {Boolean} true, ако полетата се валидират и формата се изпраща; false - в противен случай
     */
    this.validateAndSubmitPopup = function ( )
    {
        validator.hideErrorMessages ( );
        $( '#popup-response-error' ).remove ( );

        var hasError = false;

        $( fields ).each ( function ( idx, data )
        {
            hasError |= data.validate ( );
        });

        if ( hasError )
        {
            popup.reposition ( );
            return false;
        }

        popup.submit ( );
        return true;
    };
    this.validateAndSubmit = function ( )
    {
        validator.hideErrorMessages ( );
        $( '#popup-response-error' ).remove ( );

        var hasError = false;

        $( fields ).each ( function ( idx, data )
        {
            hasError |= data.validate ( );
        });

        if ( hasError )
        {
//            popup.reposition ( );
            return false;
        }

//        popup.submit ( );
        return true;
    };

    /**
     * Валидира полетата от форма. Ако има некоректни данни, извежда съобщения за грешка за тях.
     * @return {Boolean} true, ако полетата се валидират; false - в противен случай
     */
    this.validate = function ( )
    {
        validator.hideErrorMessages ( );

        var hasError = false;

        $( fields ).each ( function ( idx, data )
        {
            hasError |= data.validate ( );
        });

        return !hasError;
    };
    // край: PUBLIC методи



    // начало: PRIVATE методи
    /**
     * Масив с обекти за всяко поле, което трябва да се валидира по даден начин.
     * Ако едно и също поле трябва да се валидира за две различни неща, то участва
     * в масива 2 пъти.
     * @type {Array} всеки обект от масива съдърща поле validate, което е функция,
     * валидираща полето и връщаща true (ако полето НЕ се валидира) или false (ако полето СЕ валидира).
     */
    var fields = [];

    /**
     * Връща позицията на курсора след края на текст от елемент (поле, например)
     * @param {HTMLElement} element
     * @return {int}
     */
    var selectionStart = function ( element )
    {
        if ( element.createTextRange )
        {
            var r = document.selection.createRange().duplicate ( );
            var s = element.value;
            if ( s )
            {
                r.moveEnd ( 'character', s.length );
                if ( r.text == '' )
                {
                    return s.length;
                }
                return s.lastIndexOf ( r.text );
            }
            return 0;
        }
        return element.selectionStart;
    };

    /**
     * Генерира съобщение за грешка за поле с невалидни данни. Използва spritf.
     * @param {jQuery} $obj jQuery обект за полето с невалидни данни.
     * @param {String} message съобщение за грешка, което да се покаже
     * @param {String} type тип на формата, съдържаща полето (table или after)
     * @requires sprintf (https://github.com/alexei/sprintf.js)
     */
    var generateErrorMessage = function ( $obj, message, type )
    {
        if ( type == validator.getSettings().formTypeTable )
        {
            $obj.parent().parent().after ( sprintf ( validator.getSettings().errorMessageTable, validator.getSettings().errorMessageContainerClass, validator.getSettings().errorMessageClass, message ) );
            $obj.addClass ( validator.getSettings().errorFieldClass );
        }
        else if ( type == validator.getSettings().formTypeInline )
        {
            $obj.addClass ( validator.getSettings().errorFieldClass ).after ( sprintf ( validator.getSettings().errorMessageInline, validator.getSettings().errorMessageContainerClass, validator.getSettings().errorMessageClass, message ) );
        }
    };
    // край: PRIVATE методи
};

window.validator = new InfoLogicaJsValidatorClass ( );

/**
 * Функция, която се вика при инициализиране на диалогов прозорец (popup) за валидиране на полетата от формата.
 * Извиква се от popup.init().
 * @requires InfoLogicaPopupsClass инстанция в променлива <code>popup</code>
 * @requires CONTEXT_PATH променлива с context path за уеб проложението
 * @requires jQuery datepicker
 * @requires asString метод за Date обекти
 * @requires parseDate за извличане на дата
 */
initInputElements = function ( )
{
    $( ".dates" ).datepicker (
    {
        dateFormat: 'dd.mm.yy',
        showOn: 'both',
        buttonImage: '/images/icons/calendar.png',
        buttonImageOnly: true,
        buttonText: "Изберете дата",
        changeMonth: true,
        changeYear: true,
        firstDay: 1,
        dayNames: ['Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота'],
        dayNamesMin: ['Н', 'П', 'В', 'С', 'Ч', 'П', 'С'],
        monthNames: ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'],
        monthNamesShort: ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек']
    });

    $( ".dates" ).bind( 'blur', function ( )
    {
        var dt = parseDate ( this.value );
        if ( dt )
        {
            this.value = dt.asString ( );
        }
    });
    $( ".int,.int-positive" ).bind ( 'keypress', function ( e )
    {
        return validator.checkInputKey ( validator.getSettings().typeInt, this, e );
    });
    $( ".float,.float-positive" ).bind ( 'keypress', function ( e )
    {
        return validator.checkInputKey ( validator.getSettings().typeFloat, this, e );
    });

    validator.initFieldsValidators ( validator.getSettings().formTypeTable );
};