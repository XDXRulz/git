package bg.infologica.project.core;

import bg.infologica.common.Tools;
import bg.infologica.common.util.MD5;

/**
 * Помощни функции за системата.
 *
 * @author Кальо Катеров
 * @version 2013-07-03 Първа версия.
 */
public final class BarCommons {

    public static final String ERROR_DELETE = "Грешка при изтриване на данните от базата данни на системата.";
    public static final String ERROR_SAVE = "Грешка при запис на данните в базата данни на системата.";
    public static final String ERROR_LOAD = "Грешка при четене на данните от базата данни.";


    /**
     * Изчиства зададен стринг от излишните символи.
     *
     * @param value Стринг, който да се обработи.
     * @return Обработеният стринг.
     */
    public static String fixString(String value) {
        return value == null ? null :
                value.trim().replace('„', '"').replace('“', '"').replace('”', '"')
                        .replace('‚', '\'').replace('‘', '\'').replace('’', '\'')
                        .replace("  ", " ").replace("&quot;", "\"");
    }

    /**
     * Форматира номер и дата на документ за отпечатване.
     *
     * @param num Номер на документа.
     * @param date Дата на документа.
     * @return Форматираният текст за отпечатване.
     */
    public static String fixNumDate(int num, String date) {
        StringBuilder res = new StringBuilder("");
        if (num > 0)
            res.append(num);
        if (num > 0 && !Tools.emptyString(date))
            res.append(" / ");
        if (!Tools.emptyString(date))
            res.append(date);
        return res.toString();
    }

    /**
     * Форматира номер и дата на документ за отпечатване.
     *
     * @param num Номер на документа.
     * @param date Дата на документа.
     * @return Форматираният текст за отпечатване.
     */
    public static String fixNumDate(String num, String date) {
        StringBuilder res = new StringBuilder("");
        if (!Tools.emptyString(num))
            res.append(num);
        if (!Tools.emptyString(num) && !Tools.emptyString(date))
            res.append(" / ");
        if (!Tools.emptyString(date))
            res.append(date);
        return res.toString();
    }

    /**
     * Форматира период от две дати за отпечатване.
     *
     * @param date1 Началната дата на периода.
     * @param date2 Крайната дата на периода.
     * @return Форматираният текст за отпечатване.
     */
    public static String fixDatePeriod(String date1, String date2) {
        StringBuilder res = new StringBuilder("");
        if (!Tools.emptyString(date1))
            res.append(date1);
        if (!Tools.emptyString(date1) && !Tools.emptyString(date2))
            res.append(" - ");
        if (!Tools.emptyString(date2))
            res.append(date2);
        return res.toString();
    }

    private final static String[] SIZE_UNITS = {"B", "KB", "MB", "GB", "TB", "EB", "ZB", "YB"};

    /**
     * Нормализира размер на файл от байтове в необходимата кратна единица според големината на байтовете.
     *
     * @param bytes Размер в байтове.
     * @return Нормализираният размер в подходяща мерна единица.
     */
    public static String formatSize(long bytes) {
        int index = (int) Math.min((long) (Math.floor(Math.log(bytes) / Math.log(1024))), SIZE_UNITS.length - 1);
        return String.format("%1.2f %s", bytes / Math.pow(1024, index), SIZE_UNITS[index]);
    }

    /**
     * Събира зададените стрингове като използва зададен слепващ низ.
     *
     * @param glue Слепваш низ, който да се постави между отделните стрингове.
     * @param values Стрингове, които да се слепят.
     * @return Стринг, съдържащ всички зададени стрингове, съединени със зададения слепващ низ.
     */
    public static String join (String glue, String... values) {
        StringBuilder res = new StringBuilder("");
        for (String s : values) {
            if (!Tools.emptyString(s)) {
                if (res.length() > 0)
                    res.append(glue);
                res.append(s);
            }
        }
        return res.toString();
    }

    /**
     * Кодира паролата за запис в базата данни на системата.
     *
     * @param password Паролата, която да се кодира.
     * @return Кодираната парола.
     */
    public static String passwordEncode(String password) {
        return MD5.get("bg.infologica.project.user_password." + password);
    }

    private BarCommons() {}
}
