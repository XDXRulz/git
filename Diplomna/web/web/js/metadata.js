/**
 * Created with IntelliJ IDEA.
 * User: new
 * Date: 5/31/13
 * Time: 2:06 PM
 * To change this template use File | Settings | File Templates.
 */
ErrorTitle = 'Грешка';
emailValidator = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/;
urlValidatior = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
//DP_DEFAULT ={startDate:'01.01.1980', endDate:'31.12.2040'};
/*{
 dateFormat: 'dd.mm.yy',
 showOn: 'both',
 buttonImage: '../images/calendar.gif',
 buttonImageOnly: true,
 buttonText: "Изберете дата",
 changeMonth: true,
 changeYear: true,
 firstDay: 1,
 dayNames: ['Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота'],
 dayNamesMin: ['Н', 'П', 'В', 'С', 'Ч', 'П', 'С'],
 monthNames: ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'],
 monthNamesShort: ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'],
 zIndex: 10
 };*/

/*function parseDate (s) {
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
 return isNaN(d.getTime()) ? false : d;
 }*/
function errorMessagePrefixNamed(name,className,id)
{
    return '<div class="form-error-message" forId="'+id+'" forName="'+name+'" forClass="'+className+'"><div class="ui-widget">' +
        '<div class="ui-state-error ui-corner-all" style="font-size: 1em;">'+
        '<p style="padding: 5px;">' +
        '<span class="ui-icon ui-icon-alert" style="float: left; margin: -2px 5px 0 0;"></span>' +
        '<strong>'+ErrorTitle +':</strong> ';
}
var errorMessagePrefix =
    '<div class="form-error-message"><div class="ui-widget">' +
        '<div class="ui-state-error ui-corner-all" style="font-size: 90%;">'+
        '<p style="padding: 0.5em;">' +
        '<span class="ui-icon ui-icon-alert" style="float: left; margin: -2px 5px 0 0;"></span>' +
        '<strong>Грешка:</strong> ';
var successMessagePrefix =
    '<div class="form-error-message"><div class="ui-widget">' +
        '<div class="ui-state-check ui-corner-all" style="font-size: 90%;">'+
        '<p style="padding: 0.5em;">' +
        '<span class="ui-icon ui-icon-check" style="float: left; margin: -2px 5px 0 0;"></span>' +
        '<strong>Успешна операция:</strong> ';
var errorMessageSuffix = '</p></div></div></div>';
function inlineSuccess(name,message)
{
    $("#" + name).after(successMessagePrefix + message + errorMessageSuffix);
}
function inlineError(name, message) {
    $("#" + name).after(errorMessagePrefix + message + errorMessageSuffix);
}
function inlineErrorNamed(selector,message,  name, className, id)
{
    $(selector).after(errorMessagePrefixNamed(name,className,id)+ message + errorMessageSuffix);
}
function inlineErrorClear(key,value)
{
    $('.form-error-message[for'+key+'="'+value+'"]').empty().remove();
}
function inlineErrorClass(name, message) {
    $("." + name).after(errorMessagePrefix + message + errorMessageSuffix);
}

function inlineErrorsClear() {
    $('.form-error-message').empty().remove();
}

function checkInputKey (tp, obj, e) {
    var str = typeof obj.value == 'undefined' ? '' : obj.value;
    if (tp == 'D')
        str = str.replace(/-/, '.').replace(/\//, '.');
    if (tp == 'F')
        str = str.replace(/,/, '.');

    var key = e.charCode ? e.charCode : (e.keyCode ? e.keyCode : (e.which ? e.which : 0));
    if (key == 13)
        return (obj.name.toLowerCase() == "input"); // ????????? Enter ???? ??? ? ? input ???????
    if ((e.ctrlKey && key == 97 /* firefox */) || (e.ctrlKey && key == 65) /* opera */) return true; // ????????? Ctrl+A
    if ((e.ctrlKey && key == 120 /* firefox */) || (e.ctrlKey && key == 88) /* opera */) return true; // ????????? Ctrl+X (cut)
    if ((e.ctrlKey && key == 99 /* firefox */) || (e.ctrlKey && key == 67) /* opera */) return true; // ????????? Ctrl+C (copy)
    if ((e.ctrlKey && key == 122 /* firefox */) || (e.ctrlKey && key == 90) /* opera */) return true; // ????????? Ctrl+Z (undo)
    if ((e.ctrlKey && key == 118 /* firefox */) || (e.ctrlKey && key == 86 /* opera */ ) || (e.shiftKey && key == 45)) return true; // ????????? Ctrl+V (paste), Shift+Ins
    if (key < 48 || key > 57) {
        if (key == 45 && (tp == 'I' || tp == 'F') && !($(obj).hasClass('int-positive') || $(obj).hasClass('float-positive'))) {
            if (str.length == 0 || (str.length > 0 && str.charAt(0) != '-' && selectionStart(obj) == 0))
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

function initInputElements ()
{
//    initInputDates ( );
    $(".int,.int-positive").bind('keypress', function (e) {
        return checkInputKey('I', this, e);
    });
    $(".float,.float-positive").bind('keypress', function (e) {
        return checkInputKey('F', this, e);
    });
}

/*function initInputDates ( )
 {
 $(".dates").datepicker(DP_DEFAULT);
 $(".dates").bind('blur', function () {
 var dt = parseDate(this.value);
 if (dt)
 {
 this.value = dt.asString();
 $(this).trigger('change');
 }
 });
 $(".dates").bind('keypress', function (e) {
 return checkInputKey('D', this, e);
 });
 }*/
function keyBetween(start, end,event)
{
    return (event.keyCode>=start && event.keyCode<=end) || (event.charCode>=start && event.charCode<=end)
}
function keyIs(value,event)
{
    return event.keyCode==value||event.charCode==value;
}
function isCharacter(event)
{
    return keyBetween(97,122,event)||keyBetween(1040,1103,event)||keyBetween(65,90,event);
}
function isDigit(event)
{
    return keyBetween(48, 57,event);
}
function isNumberSeparator(event)
{
    return keyIs(44,event) || keyIs(46,event);
}
function isSlash(event)
{
    return keyIs(45,event) || keyIs(95,event);
}
function isSemiColon(event)
{
    return keyIs(59,event);
}
function isSpace(event)
{
    return keyIs(32,event);
}

function validateEmailKey(event)
{
    return isCharacter(event) || isDigit(event) || isNumberSeparator(event) || isSlash(event) || keyIs(64,event);
}

function validateNameKey(event)
{
    return isCharacter(event) || isDigit(event) || isNumberSeparator(event) || isSlash(event) || isSemiColon(event)||isSpace(event);
}
function emptyString(value) {
    if(value == undefined) return true;
    else if(value == null) return true;
    else if(value.trim().length==0) return true;
    else return false;
}
function isNegative(value) {
    value = parseFloat(value);
    if(value!=NaN)
    {
        if(value<0)
            return true;
    }
    return false;
}
function isPositive(value) {
    value = parseFloat(value);
    if(value!=NaN)
    {
        if(value>0)
            return true;
    }
    return false;
}
function isInt(value) {
    value = parseInt(value,10);
    return value != NaN;
}
function isFloat(value){
    value = parseFloat(value.replace(',','.'));
    return value != NaN;
}
function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}
function removeUniqueEntry(classValue,content)
{
    $("span."+classValue+"[content='"+content+"']").remove();
    return false;
    /* if(classValue=='constr')
     {
     if($('span.constr').length==0)
     {
     $('#constraintList_1').removeAttr('disabled');
     $('#constraintList_0').removeAttr('disabled');
     }
     }*/
}
function checkForDuplicates (input,target)
{
    var error = false;
    if(input.toString().trim()==-1)
        return false;
    if(input.toString().trim().length==0)
        return false;
    $.each($("#"+target+" span"),function(key,value)
        {
            var newValue = value.textContent;
            if(newValue.toString().trim() == input.toString().trim())
            {
                error = true;
                return false;
            }
        }
    );
    return !error;
}
function validateEmail(email)
{
    return emailValidator.test(email);
}
function validateAllEmails()
{
    $.each($(".email"),function(key,value)
    {
        inlineErrorClear('Id',value.id);
        if(!emptyString(value.value)&&!emailValidator.test(value.value))
            inlineErrorNamed('#'+value.id,"Невалиден адрес на електронна поща",'','',value.id+'');
    });
}
function  addUniqueEntry(input,target,name,value)
{
    /*  if(paired!=undefined && paired==true)
     {
     if($("#"+$("#"+input).attr("pair_table")+" span").length==0)
     {
     if(checkForDuplicates(input,target))
     $("#"+target).append('<span class="lang" content="'+input+'">'+input+'<input type="hidden" name="'+name+'" value="'+input+'"><img src="images/niuniu/delete.png" alt="Премахни" onclick="removeUniqueEntry(\'lang\',\''+input+'\');"/> <br/></span>');
     }
     else
     {
     inlineErrorNamed("#"+input,"Полето "+$("#"+input).attr("pair_name")+" съдържа стойности","",+$("#"+input).attr("pair_class"));
     }
     }
     else
     {*/
    if(checkForDuplicates(input,target))
        if(value!=undefined)
            $("#"+target).append('<span class="lang" content="'+input+'">'+input+'<input type="hidden" name="'+name+'" value="'+value+'">&nbsp;<a href=\'#\' onclick=\"return removeUniqueEntry(\'lang\',\''+input+'\');\"><img src="images/niuniu/delete.png" alt="Премахни"/></a> <br/></span>');
        else
            $("#"+target).append('<span class="lang" content="'+input+'">'+input+'<input type="hidden" name="'+name+'" value="'+input+'">&nbsp;<a href=\'#\' onclick=\"return removeUniqueEntry(\'lang\',\''+input+'\');\"><img src="images/niuniu/delete.png" alt="Премахни"/></a> <br/></span>');
//    }
}

function addIndexedUniqueEntry(target, input,index, name)
{
    if(validateEmail($("#"+input+index).val()))
    {
        if(checkForDuplicates($("#"+input+index).val(),target+index))
        {
            inlineErrorClear('Id',input+index);
            $("#"+target+index).append('<span class="org_email" content="'+$("#"+input+index).val()+'">'+$("#"+input+index).val()+'<input type="hidden" name="'+name+'_'+index+'" value="'+$("#"+input+index).val()+'">&nbsp;<a href=\'#\' onclick=\"return removeUniqueEntry(\'org_email\',\''+$("#"+input+index).val()+'\');\"><img src="images/niuniu/delete.png" alt="Премахни"/></a><br/></span>');
        }
        else
        {
            inlineErrorClear('Id',input+index);
//            inlineErrorNamed('#'+input+index,"Повтарящ се адрес на електронна поща",'','',input+index);
        }
    }
    else
    {
        inlineErrorClear('Id',input+index);
        inlineErrorNamed('#'+input+index,"Невалиден адрес на електронна поща",'','',input+index);
    }
}

function removeInput(id,index)
{
    $("#"+id+index).remove();
}
function getAppendix(type, newIndex,specifications)
{
    if(type=="res")
        return " <fieldset class=\"grid-1 holder500\" id=\"res_div_"+newIndex+"\">\n"+
            "                        <legend>Отговорна страна</legend>\n"+
            "                        <table class=\"formTable\">\n"+
            "                            <tr>\n"+
            "                                <th><label for=\"res_name_"+newIndex+"\">Име на организацията</label><span class=\"red-italic-text\">(*)</span></th><td><input type=\"button\" index=\""+newIndex+"\" class=\"btn cancel btnRemove ui-corner-all org_remove\" onclick=\"removeInput('res_div_',"+newIndex+")\" title=\"Премахни\"/></td>\n"+
            "                               <input type='hidden' name='res_index' value='"+newIndex+"'/></tr>\n"+
            "                            <tr>\n"+
            "                                <td><input type=\"text\" maxlength=\"255\" name=\"res_name\" id=\"res_name_"+newIndex+"\" class=\"org_name\"/></td>\n"+
            "                            </tr>\n"+
            "                            <tr>\n"+
            "                                <th><label for=\"org_email_"+newIndex+"\">Адрес на електронна поща</label><span class=\"red-italic-text\">(*)</span></th>\n"+
            "                            </tr>\n"+
            "                            <tr id=\"res_emails_"+newIndex+"\"></tr>\n"+
            "                            <tr>\n"+
            "                                <td><input type=\"text\" maxlength=\"255\" id=\"res_email_"+newIndex+"\" class=\"email res_email\" index = \""+newIndex+"\" title=\"Натиснете Enter за въвеждане\"/></td>\n"+
            "                                <td><input type=\"button\" class=\"btn add btnApply emailAdd ui-corner-all\" id = \"addResEmailBtn_"+newIndex+"\" onclick=\"addIndexedUniqueEntry('res_emails_','res_email_',$('#'+this.id).attr('index'),'res_emails');\" title=\"Приложи\" index=\"0\"/></td>\n"+
            "                            </tr>\n"+
            "                            <tr>\n"+
            "                                <th><label for=\"res_role_"+newIndex+"\">Роля на отговорната страна</label><span class=\"red-italic-text\">(*)</span></th>\n"+
            "                            </tr>\n"+
            "                            <tr>\n"+
            "                                <td>\n"+
            "                                    <select id=\"res_role_"+newIndex+"\" name=\"res_role\">\n"+
            "                                        <option value=\"\">--Избиране на стойност</option>\n"+
            "                                        <option value=\"author\">Автор</option>\n"+
            "                                        <option value=\"resourceProvider\">Доставчик на ресурси</option>\n"+
            "                                        <option value=\"publisher\">Издател</option>\n"+
            "                                        <option value=\"principalInvestigator\">Основен изследовател</option>\n"+
            "                                        <option value=\"user\">Потребител</option>\n"+
            "                                        <option value=\"processor\">Преработчик</option>\n"+
            "                                        <option value=\"distributor\">Разпространител</option>\n"+
            "                                        <option value=\"owner\">Собственик</option>\n"+
            "                                        <option value=\"originator\">Създател</option>\n"+
            "                                        <option value=\"pointOfContact\">Точка за контакт</option>\n"+
            "                                        <option value=\"custodian\">Управител</option>\n"+
            "                                    </select>\n"+
            "                                </td>\n"+
            "                            </tr>\n"+
            "                        </table>\n"+
            "                    </fieldset>" ;
    if(type=="org")
        return   "  <fieldset class=\"grid-1 holder500\" id=\"org_div_"+newIndex+"\">\n"+
            "               <legend>Точка за контакт</legend>" +
            "                <table class='formTable'>\n"+
            "                    <tr>\n"+
            "                        <th><label for=\"org_name_"+newIndex+"\">Име на организацията</label><span class=\"red-italic-text\">(*)</span></th><td><input type=\"button\" index=\""+newIndex+"\" class=\"btn cancel btnRemove ui-corner-all org_remove\" onclick=\"removeInput('org_div_',"+newIndex+")\" title=\"Премахни\"/></td>\n"+
            "                    <input type='hidden' name='org_index' value='"+newIndex+"'>\n"+
            "                    </tr>\n"+
            "                    <tr>\n"+
            "                        <td><input type=\"text\" maxlength=\"255\" name=\"org_name\" id=\"org_name_"+newIndex+"\" class=\"org_name\"/></td>\n"+
            "                    </tr>\n"+
            "                    <tr>\n"+
            "                        <th><label for=\"org_email_"+newIndex+"\">Адрес на електронна поща</label><span class=\"red-italic-text\">(*)</span></th>\n"+
            "                        </tr>\n"+
            "                    <tr id=\"org_emails_"+newIndex+"\"></tr>\n"+
            "                    <tr>\n"+
            "                        <td><input type=\"text\" maxlength=\"255\" id=\"org_email_"+newIndex+"\" class=\"email org_email\" index = \""+newIndex+"\"/></td><td><input type=\"button\" id=\"addOrgEmailBtn_"+newIndex+"\" index=\""+newIndex+"\" class=\"btn add btnApply emailAdd ui-corner-all\" onclick=\"addEmail(\'org_emails_\','org_email_',"+newIndex+");\" title=\"Приложи\"/></td>\n"+
            "                    </tr>\n"+
            "                </table>\n"+
            "            </div>";
    else if(type=='ident')
        return  " <div class=\"grid-1 placeholder\" id=\"ident_"+newIndex+"\">\n"+
            "                <table class=\"formTable\">\n"+
            "                    <tr>\n"+
            "                        <th><label for=\"ident_code_"+newIndex+"\">Код</label><span class=\"red-italic-text\">(*)</span></th><td><input type=\"button\" index=\""+newIndex+"\" class=\"btn btnRemove ui-corner-all cancel ident_remove\" onclick=\"removeInput('ident_',"+newIndex+")\" title=\"Премахни\"/></td>\n"+
            "                    </tr>\n"+
            "                    <tr>\n"+
            "                        <td><input disabled=\"disabled\" value='' type=\"text\" maxlength=\"255\" name=\"ident_code\" id=\"ident_code_"+newIndex+"\" class=\"ident_code\"/></td>\n"+
            "                    </tr>\n"+
            "                    <tr>\n"+
            "                        <th><label for=\"ident_codespace_"+newIndex+"\">Пространство от имена</label></th>\n"+
            "                    </tr>\n"+
            "                    <tr>\n"+
            "                        <td><input type=\"text\" maxlength=\"255\" name=\"ident_codespace\" id=\"ident_codespace_"+newIndex+"\" class=\"ident_code\"/></td>\n"+
            "                    </tr>\n"+
            "                </table>\n"+
            "            </div>";
    else if(type == 'resLoc')
        return " <div class=\"grid-1 placeholder\" id=\"res_loc_"+newIndex+"\">\n"+
            "                    <table class=\"formTable\">\n"+
            "                        <tr>\n"+
            "                            <th><label for=\"linkage_"+newIndex+"\">Връзка</label><span class=\"red-italic-text\">(*)</span></th><td><input type=\"button\" index=\""+newIndex+"\" class=\"btn cancel btnRemove ui-corner-all res_loc_remove\" onclick=\"removeInput('res_loc_',"+newIndex+")\" title=\"Премахни\"/></td>\n"+
            "                        </tr>\n"+
            "                        <tr>\n"+
            "                            <td><input type=\"text\" maxlength=\"255\" name=\"linkage\" id=\"linkage_"+newIndex+"\" class=\"linkage\"/></td>\n"+
            "                        </tr>\n"+
            "                    </table>\n"+
            "                </div>";
    else if(type == 'temp_ext')
        return " <div class=\"grid-1 placeholder\" id=\"tem_ext_"+newIndex+"\">\n" +
            "            <table class=\"formTable\">\n" +
            "                <tr>\n" +
            "                    <th><label for=\"start_date_"+newIndex+"\">Начална дата</label><span class=\"red-italic-text\">(*)</span></th><td><input type=\"button\" index=\""+newIndex+"\" class=\"btn cancel btnRemove ui-corner-all temp_ext_remove\" onclick=\"removeInput('tem_ext_',"+newIndex+")\" title=\"Премахни\"/></td>\n" +
            "                </tr>\n" +
            "                <tr>\n" +
            "                    <th><input type=\"text\" maxlength=\"255\" name=\"start_date\" id=\"start_date_"+newIndex+"\" class=\"inp date\"/></th>\n" +
            "                </tr>\n" +
            "                <tr>\n" +
            "                    <th><label for=\"end_date_"+newIndex+"\">Крайна дата</label><span class=\"red-italic-text\">(*)</span></th>\n" +
            "                </tr>\n" +
            "                <tr>\n" +
            "                    <th><input type=\"text\" maxlength=\"255\" name=\"end_date\" id=\"end_date_"+newIndex+"\" class=\"inp date\"/></th>\n" +
            "                </tr>\n" +
            "            </table>\n" +
            "        </div>";
    else if(type == 'spat_res')
        return "<div class=\"grid-1 placeholder\" id=\"spat_res_"+newIndex+"\">\n" +
            "            <table class=\"formTable\">\n" +
            "                <tr>\n" +
            "                    <th><label for=\"equiv_scale_"+newIndex+"\">Еквивалентен мащаб</label><span class=\"red-italic-text\">(*)</span></th><td><input type=\"button\" index=\""+newIndex+"\" class=\"btn cancel btnRemove ui-corner-all spat_res_remove\" onclick=\"removeInput('spat_res_',"+newIndex+")\" title=\"Премахни\"/></td>\n" +
            "                </tr>\n" +
            "                <tr>\n" +
            "                    <td><input index=\""+newIndex+"\" type=\"text\" maxlength=\"255\" name=\"equiv_scale\" id=\"equiv_scale_"+newIndex+"\" class=\"spat_res int-positive\"/></td>\n" +
            "                </tr>\n" +
            "                <tr>\n" +
            "                    <th><label for=\"res_dist_"+newIndex+"\">Разделително разстояние</label><span class=\"red-italic-text\">(*)</span></th>\n" +
            "                </tr>\n" +
            "                <tr>\n" +
            "                    <td><input index=\""+newIndex+"\" type=\"text\" maxlength=\"255\" name=\"res_dist\" id=\"res_dist_"+newIndex+"\" class=\"spat_res int-positive\"/></td>\n" +
            "                </tr>\n" +
            "                <tr>\n" +
            "                    <th><label for=\"unit_measure_"+newIndex+"\">Единица за дължина</label><span class=\"red-italic-text\">(*)</span></th>\n" +
            "                </tr>\n" +
            "                <tr>\n" +
            "                    <td><input index=\""+newIndex+"\" type=\"text\" maxlength=\"255\" name=\"unit_measure\" id=\"unit_measure_"+newIndex+"\" class=\"spat_res\"/></td>\n" +
            "                </tr>\n" +
            "            </table>\n" +
            "        </div>";
    else if(type == 'conformity')
    {
       var output =  " <fieldset class=\"holder500\" id=\"conformity_"+newIndex+"\">\n"+
            "            <legend>Conformity "+newIndex+"</legend>\n"+
            "            <table class=\"formTable\">\n"+
            "                <tr>\n"+
            "                    <th><label for=\"conf_specification_"+newIndex+"\">Спецификация</label><span class=\"red-italic-text\">(*)</span></th><td><input type=\"button\" index=\""+newIndex+"\" class=\"btn cancel btnRemove ui-corner-all conformity_remove\" onclick=\"removeInput('conformity_',"+newIndex+")\" title=\"Премахни\"/></td>\n"+
            "                </tr>\n"+
            "                <tr>\n"+
            "                <td><select index=\"<%=i%>\"  name=\"conf_specification\" id=\"conf_specification_<%=i%>\" " +
            "                   class=\"suggestStuff conformity validator-not-empty\" style=\"width: 450px\">    " +
           "                    <option value=\"-1\"></option>        ";
        $.each(specifications,function(idx,value){
           output+='<option value="'+value.id+'">'+value.value+'</option>';
        });
        output +="                </td></tr>\n"+
            "                <tr>\n"+
            "                    <th><label for=\"conf_date_"+newIndex+"\">Дата</label><span class=\"red-italic-text\">(*)</span></th>\n"+
            "                </tr>\n"+
            "                <tr>\n"+
            "                    <td><input index=\""+newIndex+"\" type=\"text\" maxlength=\"255\" name=\"conf_date\" id=\"conf_date_"+newIndex+"\" class=\"inp date conformity\"/></td>\n"+
            "                </tr>\n"+
            "                <tr>\n"+
            "                    <th><label for=\"conf_date_type_"+newIndex+"\">Тип дата</label><span class=\"red-italic-text\">(*)</span></th>\n"+
            "                </tr>\n"+
            "                <tr>\n"+
            "                    <td>\n"+
            "                        <select index=\""+newIndex+"\" name=\"conf_date_type\" id=\"conf_date_type_"+newIndex+"\" class=\"conformity\">\n"+
            "                           <option value=\"-1\">--Избиране на стойност</option>" +
            "                           <option value=\"revision\">Дата на последния преглед</option>" +
            "                           <option value=\"publication\">Дата на публикуване</option>" +
            "                           <option value=\"creation\">Дата на създаване</option>\n"+
            "                        </select>\n"+
            "                    </td>\n"+
            "                </tr>" +
            "                <tr>\n"+
            "                    <th><label for=\"conf_date_type_"+newIndex+"\">Степен</label><span class=\"red-italic-text\">(*)</span></th>\n"+
            "                </tr>\n"+
            "                <tr>\n"+
            "                    <td>\n"+
            "                        <select  index=\""+newIndex+"\" class=\"conformity\" name=\"conformity_grade\" id=\"conformity_grade_"+newIndex+"\">\n"+
            "                            <option value=\"\">Не е оценен</option>\n"+
            "                            <option value=\"false\">Несъответстващ</option>\n"+
            "                            <option value=\"true\">Съответстващ</option>\n"+
            "                        </select>\n"+
            "                    </td>\n"+
            "                </tr>"+
            "            </table>\n"+
        "        </fieldset>";
        return output;
    }
    return '';
}
function addInput (origin,target, type,specifications)
{
    var id = origin.id;
//    console.log(origin);
//    console.log(origin.id);
    var newIndex = parseInt($("#"+origin.id).attr('index'),10)+1;
//    console.log(newIndex);
    $("#"+origin.id).attr('index',newIndex);
//    console.log(target);
//    console.log(getAppendix(type,newIndex));
    console.log(specifications);
    $("#"+target).append(getAppendix(type,newIndex,specifications));
    initOrgInputs();
    if(type=='temp_ext')
    {
        //initInputDates();
//        initInputDates2('start_date_','end_date_',newIndex);
        inputDateInit("start_date_"+newIndex);
        inputDateInit("end_date_"+newIndex);
    }
    if(type=='spat_res')
    {
        initInputElements();
    }
    if(type=='conformity')
    {
//        initInputDates();
        inputDateInit("conf_date_"+newIndex);

    }
    if(type=='ident')
    {
//        initInputDates();
        $('#ident_code_'+newIndex).val(GenerateUUID());
    }
}
function addKeyWordRep(value)
{
    var date = $("#keyword_thesauruses option:selected").attr("date");
    var thesaurus = $("#keyword_thesauruses option:selected").attr("content");
    var dateType = "publication";
    var dateTypeId = 1;
    var valueString = "("+thesaurus+", "+dateType+", "+date+") "+value;
    /*console.log(value);
     console.log(date);
     console.log(thesaurus);
     console.log(valueString);*/
    if(checkForDuplicates(valueString, 'keywords'))
    {
        $("#keywords").append("<span class=\"keyword\" content=\"" + valueString + '">' + valueString +
            "<input type=\"hidden\" name=\"keyword_title\" value=\"" + thesaurus + '">' +
            "<input type=\"hidden\" name=\"keyword_date\" value=\"" + date + '">' +
            "<input type=\"hidden\" name=\"keyword_dateType\" value=\"" + dateTypeId + '">' +
            "<input type=\"hidden\" name=\"keyword_value\" value=\"" + value + '">' +
            "&nbsp;<a href='#' onclick=\"return removeUniqueEntry('keyword','"+valueString+'\');"><img src=\"images/niuniu/delete.png\" alt=\"Премахни\" /></a><br/></span>');
    }
}
function initOrgInputs ()
{

    $(".org_email").bind('keypress', function (e) {
        if(e.keyCode==13)
        {
            addIndexedUniqueEntry('org_emails_','org_email_',$('#'+this.id).attr('index'), 'org_emails');
        }
        return validateEmailKey(e);
    });
    $(".res_email").bind('keypress', function (e) {
        if(e.keyCode==13)
        {
            addIndexedUniqueEntry('res_emails_','res_email_',$('#'+this.id).attr('index'), 'res_emails');
        }
        return validateEmailKey(e);
    });
    $(".res_email").bind('blur', function (e) {
        addIndexedUniqueEntry('res_emails_','res_email_',$('#'+this.id).attr('index'), 'res_emails');
        });
    $(".keyword_rep").bind('click',function(e){
        addKeyWordRep(e.srcElement.attributes[1].nodeValue);
    });
    $("#addKeyWord").bind('click',function(e){
        addKeyWord('keywords');
    });
    /*$(".metadataLanguage").bind('change', function (e) {
     return addLanguage($("#"+this.id).val(),'languages');
     });*/
    $(".clasification").bind('change', function (e) {
        return addUniqueEntry($("#"+this.id).val(),'clasifications', 'clasifications');
    });
    $(".addMDLang").bind('click',function(e)
    {
        addUniqueEntry($('#metadataLanguage').val(),'languages', 'metadata_languages');
    });
    $(".addClass").bind('click',function(e)
    {
        addUniqueEntry($('#clasification').val(),'clasifications', 'classes');
    });
    $(".org_email").bind('blur', function (e) {
        addIndexedUniqueEntry('org_emails_','org_email_',$('#'+this.id).attr('index'), 'org_emails');
        validateAllEmails();
    });
    $(".org_name").bind('keypress', function (e) {
        return validateNameKey(e);
    });
    $(".spat_res").bind('blur',function(e){
        var index = $('#'+e.srcElement.id).attr('index');
        validateSpatRes(index);
    });
}

function addKeyWord(target)
{
    var key_value = $("#key_value").val();
    var title = $("#key_title").val();
    var ref_date = $("#key_ref_date").val();
    var date_type = $("#key_date_type").val();
    var date_typeText = $("#key_date_type option:selected").text();
    inlineErrorClear('Id','key_value');
    inlineErrorClear('Id','key_title');
    inlineErrorClear('Id','key_ref_date_td');
    inlineErrorClear('Id','key_date_type');
    var error = false;
    if(emptyString(key_value )){inlineErrorNamed('#key_value','Задължително поле','','','key_value'); error = true;}
    if(emptyString(title)){title="";/*inlineErrorNamed('#key_title','Задължително поле','','','key_title'); error = true;*/}
    if(emptyString(ref_date)){ref_date="";/*inlineErrorNamed('#key_ref_date_td','Задължително поле','','','key_ref_date_td'); error = true;*/}
    if(emptyString(date_type) || date_type==-1){date_type="-1"/*inlineErrorNamed('#key_date_type','Задължително поле','','','key_date_type'); error = true;*/}
    if(error) return false;
    var value = "("+title+", "+date_typeText+", "+ref_date+") "+key_value ;
    if(checkForDuplicates(value, target))
    {
        $("#"+target).append('<span class="keyword" content="'+value+'">'+value+
            '<input type="hidden" name="keyword_title" value="'+title+'">'+
            '<input type="hidden" name="keyword_date" value="'+ref_date+'">'+
            '<input type="hidden" name="keyword_dateType" value="'+date_type+'">'+
            '<input type="hidden" name="keyword_value" value="'+key_value+'">'+
            '&nbsp;<a href=\'#\' onclick=\"return removeUniqueEntry(\'keyword\',\''+value+'\');\"><img src="images/niuniu/delete.png" alt="Премахни"/></a><br/></span>');
    }
    return true;
}

function validateSpatRes(index)
{
    var scale = $("#equiv_scale_"+index).val();
    var distance = $("#res_dist_"+index).val();
    var unit = $("#unit_measure_"+index).val();
    var error = false;
    inlineErrorClear('Id',"res_dist_"+index);
    if(emptyString(scale))
    {
        if(emptyString(distance))
        {
            inlineErrorNamed("#res_dist_"+index,"Въведете еквивалентен мащаб или разделително разстояние",'','',"res_dist_"+index);
            error = true;
        }
    }
    else if(!emptyString(distance))
    {
        inlineErrorNamed("# res_dist_"+index,"Въведете еквивалентен мащаб или разделително разстояние",'','',"res_dist_"+index);
        error = true;
    }
    return !error;
}

function initSpecialTags()
{
    $(".not-empty").bind('blur',function(e)
    {
        inlineErrorClear('Class','not-empty');
        $.each($('.not-empty'),function(key,value){
            if(!emptyString(value.value))
                inlineErrorNamed('#'+value.id,"Полето е задължително",'','not-empty','');
        })
    });
    $(".int").bind('blur',function(e){
        inlineErrorClear('Class','int');
        $.each($('.int'),function(key,value){
            if(isNegative(value.value))
                inlineErrorNamed('#'+value.id,"Полето трябва да съдържа цяло число",'','int','');
        })
    });
    $(".float").bind('blur',function(e){
        inlineErrorClear('Class','float');
        $.each($('.float'),function(key,value){
            if(isNegative(value.value))
                inlineErrorNamed('#'+value.id,"Полето трябва да съдържа реално число",'','float','');
        })
    });
    $(".not-negative").bind('blur',function(e)
    {
        inlineErrorClear('Class','not-negative');
        $.each($('.not-negative'),function(key,value){
            if(isNegative(value.value))
                inlineErrorNamed('#'+value.id,"Стойността в полето не може да е отрицателна",'','not-negative','');
        })
    });
    $(".not-positive").bind('blur',function(e)
    {
        inlineErrorClear('Class','not-positive');
        $.each($('.not-positive'),function(key,value){
            if(isPositive(value.value))
                inlineErrorNamed('#'+value.id,"Стойността в полето не може да е положителна",'','not-positive','');
        })
    });
    $(".positive").bind('blur',function(e)
    {
        inlineErrorClear('Class','positive');
        $.each($('.positive'),function(key,value){
            if(!isPositive(value.value))
                inlineErrorNamed('#'+value.id,"Стойността в полето трябва да е положителна",'','positive','');
        })
    });
    $(".negative").bind('blur',function(e)
    {
        inlineErrorClear('Class','negative');
        $.each($('.negative'),function(key,value){
            if(!isNegative(value.value))
                inlineErrorNamed('#'+value.id,"Стойността в полето трябва да е отрицателна",'','negative','');
        })
    })

}
function addConstraint(value,id, disable_id)
{
    inlineErrorClear('Id',id);
    if(emptyString(value))
    {
        inlineErrorNamed('#'+id,'Полето е задължително','','',id);
    }
    else if(value==-1)
    {
        inlineErrorNamed('#'+id,"Стойността в полето не може да е отрицателна",'','','id');
    }
    else if(checkForDuplicates(value,'constraints'))
    {
        $('#constraints').append('<span class="constr" content="'+value+'">'+value+'<input type="hidden" name="constraint" value="'+value+'">&nbsp;<a href=\'#\' onclick=\"return removeUniqueEntry(\'constr\',\''+value+'\');\"><img src="images/niuniu/delete.png" alt="Премахни"/></a> <br/></span>');
        $('#'+disable_id).attr('disabled','disabled');
    }
}
function initializeMap()
{
    // setTimeout(function(){alert(1000);}, 1000);
    setTimeout(function(){initialize()},10);
}
function initialize() {

    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng( $("#SW_lat").val(), $("#SW_lon").val()),
        new google.maps.LatLng($("#NE_lat").val(), $("#NE_lon").val())
    );
    console.log('initializing map service');
    /*console.log(bounds);*/
    /* $("#SW_lat").val(integerDivision(this.bounds.$.b,6 ));
     $("#SW_lon").val(bounds.fa.b);
     $("#NE_lat").val(bounds.$.d);
     $("#NE_lon").val(bounds.fa.d);*/
    map.fitBounds(bounds);
    var rectangle = new google.maps.Rectangle({
        bounds: bounds,
        editable: true,
        draggable: true,
        bounds_changed: function()
        {
            $("#SW_lat").val(integerDivision(this.bounds.$.b,4 ));
            $("#SW_lon").val(integerDivision(this.bounds.fa.b,4 ));
            $("#NE_lat").val(integerDivision(this.bounds.$.d,4 ));
            $("#NE_lon").val(integerDivision(this.bounds.fa.d,4 ));
            //console.log(this.bounds);
            map.fitBounds(this.bounds);
        }
    });

    rectangle.setMap(map);
}

function coordinatesAdd(st,sn,nt,nn)
{
    if(checkForDuplicates(st+", "+sn+", "+nt+", "+nn,'coordinates'))
    {
        $('#coordinates').append("<span class=\"coordinates\" content=\"" + st + ', ' + sn + ', ' + nt + ', ' + nn + '">' + st + ', ' + sn + ', ' + nt + ', ' + nn + "<input type=\"hidden\" name=\"st\" value=\"" + st + "\"><input type=\"hidden\" name=\"sn\" value=\"" + sn + "\"><input type=\"hidden\" name=\"nt\" value=\"" + nt + "\"><input type=\"hidden\" name=\"nn\" value=\"" + nn + "\">&nbsp;<a href='#' onclick=\"return removeUniqueEntry('coordinates','" + st + ', ' + sn + ', ' + nt + ', ' + nn + "');\"><img src=\"images/niuniu/delete.png\" alt=\"Премахни\"/></a> <br/></span>");
    }

}
function coordinatesApply(id)
{
    var coordinates = $("#"+id).val().split(';');
    if(coordinates[0]==-1 && coordinates[1]==undefined)
        return;
    $("#SW_lat").val(coordinates[0]);
    $("#SW_lon").val(coordinates[1]);
    $("#NE_lat").val(coordinates[2]);
    $("#NE_lon").val(coordinates[3]);
    coordinatesAdd(coordinates[0],coordinates[1],coordinates[2],coordinates[3]);
    initialize();
}
function integerDivision(input,divider)
{
    return input.toFixed(divider);
}
/*function pairInputs(input1, input2, span_table1, span_table2)
 {
 if(("#"+span_table1+" span").length!=0);
 }*/

/*// Accepts a url and a callback function to run.
 function requestCrossDomain( site, callback ) {

 // If no url was passed, exit.
 if ( !site ) {
 alert('No site was passed.');
 return false;
 }

 // Take the provided url, and add it to a YQL query. Make sure you encode it!
 var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=xml&callback=cbFunc';

 // Request that YSQL string, and run a callback function.
 // Pass a defined function to prevent cache-busting.
 console.log("1");
 $.getJSON( yql, cbFunc );
 console.log("2");
 function cbFunc(data) {
 // If we have something to work with...
 console.log(data);
 if ( data.results[0] ) {
 // Strip out all script tags, for security reasons.
 // BE VERY CAREFUL. This helps, but we should do more.
 data = data.results[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

 // If the user passed a callback, and it
 // is a function, call it, and send through the data var.
 $('#nodelist').html(data.results[0]);
 if ( typeof callback === 'function') {
 callback(data);
 }
 }
 // Else, Maybe we requested a site that doesn't exist, and nothing returned.
 else throw new Error('Nothing returned from getJSON.');
 }
 }*/
function validateUrl(url)
{
    return urlValidatior.test(url);
}
function addUrl(input,target,name)
{
    var value = $('#'+input).val();
    inlineErrorClear('Id',input);
    if(validateUrl(value)) addUniqueEntry(value, target, name,value);
    else
        inlineErrorNamed('#'+input,"Невалиден URI адрес на свързан ресурс",'','',input+'');
}
function SubmitMetadata(action){
    $('input[name=ident_code]').prop('disabled',false);
    $('#metadata_form').ajaxSubmit(
        {
            url: 'md_metadata_editor.jsp',
            type: 'post',
            success:function(data)
            {
                inlineErrorsClear();
                if(data.trim().length!=0)
                    inlineError('errors',data.trim());
                else
                if(action)
                    inlineSuccess('errors','Редакция на метаданни');
                else
                    inlineSuccess('errors','Добавяне на метаданни');
                $('input[name=ident_code]').prop('disabled',true);
            }
        }
    );


}
function setupThesauruses(data)
{
//    console.log(data);
    /* data = [{
     "version": "GEMET - Concepts, version 3.1, 2012-07-20",
     "uri": "http://www.eionet.europa.eu/gemet/concept/",
     "name": "Concepts"
     }, {
     "version": "GEMET - Super groups, version 2.4, 2010-01-13",
     "uri": "http://www.eionet.europa.eu/gemet/supergroup/",
     "name": "Super groups"
     }, {
     "version": "GEMET - Groups, version 2.4, 2010-01-13",
     "uri": "http://www.eionet.europa.eu/gemet/group/",
     "name": "Groups"
     }, {
     "version": "GEMET - Themes, version 2.4, 2010-01-13",
     "uri": "http://www.eionet.europa.eu/gemet/theme/",
     "name": "Themes"
     }, {
     "version": "GEMET - INSPIRE themes, version 1.0, 2008-06-01",
     "uri": "http://inspire-registry.jrc.ec.europa.eu/registers/FCD/items/",
     "name": "Inspire Themes"
     }];*/
    $("#keyword_thesauruses").html('<option value="-1">--Избиране на стойност</option>');
    $.each(data,function(idx,value){
        var date = new Date(value.version.substring(value.version.length - 10));
        var curr_date = date.getDate();
        var curr_month = date.getMonth();
        curr_month++;
        var curr_year = date.getFullYear();
        var dateValue = (curr_date<10?"0"+curr_date:curr_date) + "." + (curr_month<10?"0"+curr_month:curr_month) + "." + curr_year;
        $("#keyword_thesauruses").append('<option content="'+value.version.substring(0, value.version.length - 12)+'" ' +
            'date="'+dateValue+'" value="'+value.uri+'" title="'+value.name+'">' +
            ''+value.version.substring(0, value.version.length - 12)+'</option>')
    });
}
function getThesauruses()
{
    var url = 'http://www.eionet.europa.eu/gemet/getAvailableThesauri';
    $.ajax({
        type: 'GET',
        url: "curl.jsp?url="+ encodeURIComponent(url)+"&contentType=text/json;charset=UTF-8",
        processData: true,
        data: {},
        dataType: "json",
        success: function(data){setupThesauruses(data)},
        crossDomain: true
    });
}
function getConcepts(innerUrl,language)
{
    var url = 'http://www.eionet.europa.eu/gemet/getTopmostConcepts?thesaurus_uri='+encodeURIComponent(innerUrl)+'&language='+language;
    $.ajax({
        type: 'GET',
        url: "curl.jsp?url="+ encodeURIComponent(url)+"&contentType=text/json;charset=UTF-8",
        processData: true,
        data: {},
        dataType: "json",
        success: function(data){setupConcepts(data);},
        crossDomain: true
    });
}
function setupConcepts(data)
{
//    console.log(data);
    /*data = [{
     "preferredLabel": {
     "string": "administration",
     "language": "en"
     },
     "uri": "http://www.eionet.europa.eu/gemet/theme/1",
     "thesaurus": "http://www.eionet.europa.eu/gemet/theme/"
     }, {
     "preferredLabel": {
     "string": "agriculture",
     "language": "en"
     },
     "uri": "http://www.eionet.europa.eu/gemet/theme/2",
     "thesaurus": "http://www.eionet.europa.eu/gemet/theme/"
     }];*/
    $("#concepts").html("");
    $.each(data,function(idx,value){
        $("#concepts").append('<a onclick="addKeyWordRep(\''+value.preferredLabel.string+'\')" href="JavaScript:void(0);" title="'+value.uri+'">'+value.preferredLabel.string+'</a><br/>');
    });
}

function GenerateUUID()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}