package bg.infologica.water.core;

import bg.infologica.common.SessionTools;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;

/**
 * Управление на съобщения до потребителя, предаване през текущата HTTP сесия.
 * Съобщенията се записват в текущата HTTP сесия и се показват при извикване
 * на метода get, което става в началото на всяка страница или изкачащ прозорец.
 *
 * @author <a href="mailto:zhivko.zheliazkov@info-logica.com">Живко Желязков</a>
 * @version 2010-12-21 Първа версия на класа. Функциите са извадени от класа Tools и се капсулирани в отделен клас.
 * @version 2011-03-08 Функциите са коментирани и поставени на правилното местоположение в йерархията на класовете.
 * @version 2012-01-29 Класът е преместен в модула InfologicaCommonAir.jar
 */
public final class SessionMessages {

    private static final String MSG_ERRORS = "bg.infologica.water.errors";
    private static final String MSG_SUCCESS = "bg.infologica.water.messages";

    /**
     * Добавя ново съобщение за грешка в зададената HTTP сесия.
     *
     * @param session HTTP сесия, в която да се добави съобщението.
     * @param message Съобщение за грешка, което да се добави в списъка.
     */
    public static void error(HttpSession session, String message) {
        SessionTools.addToArray(session, MSG_ERRORS, message);
    }

    /**
     * Проверява дали в зададената HTTP сесия има записани съобщения за грешка.
     *
     * @param session HTTP сесия, в която да се провери за съобщения за грешка.
     * @return Стойност true, ако в зададената сесия има записани съобщения за грешка.
     */
    public static boolean exists(HttpSession session) {
        return SessionTools.getArraySize(session, MSG_ERRORS) > 0;
    }

    /**
     * Генерира HTML код, съдържащ съобщенията от зададената сесия.
     *
     * @param session HTTP сесия, в която са записани съобщенията.
     * @return Съобщенията към потребителя, подготвени за отпечатване на страницата.
     */
    public static String get(HttpSession session) {
        StringBuilder res = new StringBuilder("");
        res.append(prepare(session, MSG_ERRORS, "error", "отказана"));
        res.append(prepare(session, MSG_SUCCESS, "success", "изпълнена"));
        return res.toString();
    }

    /**
     * Изтрива съобщенията, записани в зададената сесия.
     *
     * @param session HTTP сесия.
     */
    public static void reset(HttpSession session) {
        SessionTools.deleteKey(session, MSG_ERRORS);
        SessionTools.deleteKey(session, MSG_SUCCESS);
    }

    /**
     * Добавя ново съобщение за успешно завършена операция в зададената HTTP сесия.
     *
     * @param session HTTP сесия, в която да се добави съобщението.
     * @param message Съобщение за успешно завършена операция, което да се добави в списъка.
     */
    public static void success(HttpSession session, String message) {
        SessionTools.addToArray(session, MSG_SUCCESS, message);
    }

    /**
     * Подготвя съобщенията от зададен ключ на зададена сесия за отпечатване и ги изтрива от сесията.
     *
     * @param session HTTP сесия, от която да се прочетат съобщенията.
     * @param key_name Наименование на ключа, в който са записани съобщенията.
     * @param class_name Клас, който да се добави към блока със съобщения.
     * @param action Статус на операцията, който да се добави в заглавието на блока.
     * @return Подготвените съобщения за отпечатване на страницата.
     */
    private static String prepare(HttpSession session, String key_name, String class_name, String action) {
        ArrayList<String> arr = SessionTools.getArrayProperty(session, key_name);
        if (arr != null && arr.size() > 0) {
            StringBuilder res = new StringBuilder();
            res.append("<div class=\"message ").append(class_name).append("\">");
            res.append("<strong>Операцията е ").append(action).append(".</strong>");
            res.append("<ul>");
            for (String msg : arr) {
                res.append("<li>»&nbsp;&nbsp;").append(msg).append("</li>");
            }
            res.append("</ul>");
            res.append("</div>\n");
            SessionTools.deleteKey(session, key_name);
            return res.toString();
        }
        return "";
    }
}
