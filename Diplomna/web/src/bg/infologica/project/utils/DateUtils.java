package bg.infologica.project.utils;

import bg.infologica.common.Tools;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.text.DateFormat;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Клас за работа с дати.
 *
 * @author <a href="mailto:zhivko.zheliazkov@info-logica.com">Живко Желязков</a>
 * @version 2012-09-23 Първа версия.
 */
public final class DateUtils {

    public static final String DD_MM_YYYY = "dd.MM.yyyy";
    public static final String YYYY_MM_DD = "yyyy-MM-dd";
    public static final String YYYYMMDD = "yyyyMMdd";
    public static final String YYYYMMDDHHMM = "yyyyMMddHHmm";
    public static final String HHMM = "HH:mm";

    /**
     * Проверява дали зададен стринг съдържа валидна дата и я форматира във формат "ДД.ММ.ГГГГ".
     *
     * @param value Стринг, който се проверява.
     * @return Форматираният стринг или <code>null</code>.
     */
    public static String fix(String value) {
        return format(parse(value));
    }

    /**
     * Форматира зададена дата в зададен формат.
     *
     * @param date   Дата, която да се форматира.
     * @param format Формат на датата.
     * @return Зададената дата, форматирана в зададения формат.
     */
    public static String format(Date date, String format) {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        try {
            return sdf.format(date);
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * Форматира зададена дата във формат 'dd.MM.yyyy'.
     *
     * @param date Дата, която да се форматира.
     * @return Зададената дата, форматирана в зададения формат.
     */
    public static String format(Date date) {
        return format(date, DD_MM_YYYY);
    }

    /**
     * Форматира зададена дата в зададен формат.
     *
     * @param date   Дата, която да се форматира.
     * @param format Формат на датата.
     * @return Зададената дата, форматирана в зададения формат.
     */
    public static String format(Calendar date, String format) {
        return date != null ? format(date.getTime(), format) : null;
    }

    /**
     * Форматира зададена дата във формат 'dd.MM.yyyy'.
     *
     * @param date Дата, която да се форматира.
     * @return Зададената дата, форматирана в зададения формат.
     */
    public static String format(Calendar date) {
        return date != null ? format(date.getTime(), DD_MM_YYYY) : null;
    }

    /**
     * Определя последния ден от зададен месец.
     *
     * @param year Година.
     * @param month Месец.
     * @return Последният ден от зададения месец.
     */
    public static int getLastMonthDay(int year, int month) {
        Calendar cal = Calendar.getInstance();
        cal.set(year, month - 1, 1);
        return cal.getActualMaximum(Calendar.DAY_OF_MONTH);
    }

    /**
     * Връща текущата дата в зададен формат.
     *
     * @param format Формат на датата.
     * @return Текущата дата в зададения формат.
     */
    public static String getToday(String format) {
        return format(Calendar.getInstance(), format);
    }

    /**
     * @return Текущата дата във формат 'dd.MM.yyyy'.
     */
    public static String getToday() {
        return format(Calendar.getInstance());
    }

    /**
     * Прочита зададена дата във формат 'ДД.ММ.ГГГГ'.
     *
     * @param date Дата, с която да се инициализира класа.
     * @return Calendar, ако зададената дата е валидна, или null.
     */
    public static Calendar parse(String date) {
        short d = 0, m = 0, y = 0;
        if (date != null && !"".equals(date.trim())) {
            date = date.replace('-', '.').replace('/', '.');
            int p1 = date.indexOf('.');
            if (p1 > 0) {
                d = Tools.parseShort(date.substring(0, p1));
                int p2 = date.indexOf('.', p1 + 1);
                if (p2 > 0) {
                    m = Tools.parseShort(date.substring(p1 + 1, p2));
                    y = Tools.parseShort(date.substring(p2 + 1));
                } else {
                    m = Tools.parseShort(date.substring(p1 + 1));
                }
            } else {
                d = Tools.parseShort(date);
            }
        }
        if (d > 0 && m > 0 && y > 0) {
            Calendar dt = Calendar.getInstance();
            dt.set(y, m - 1, d);
            return dt;
        }
        return null;
    }

    /**
     * Прочита дата във формат ГГГГММДД.
     *
     * @param date Стринг, съдържащ датата, която да се прочете.
     * @return Прочетената дата или стойност <code>null</code>, ако зададената дата е невалидна.
     */
    public static Calendar parseYYYYMMDD(String date) {
        short d, m, y;
        if (date != null && !"".equals(date.trim())) {
            y = Tools.parseShort(date.substring(0, 4));
            m = Tools.parseShort(date.substring(4, 6));
            d = Tools.parseShort(date.substring(6, 8));
            if (d > 0 && m > 0 && y > 0) {
                Calendar dt = Calendar.getInstance();
                dt.set(y, m - 1, d);
                return dt;
            }
        }
        return null;
    }

    /**
     * Прочита дата във формат ГГГГММДДЧЧММ.
     *
     * @param date Стринг, съдържащ датата, която да се прочете.
     * @return Прочетената дата или стойност <code>null</code>, ако зададената дата е невалидна.
     */
    public static Calendar parseYYYYMMDDHHMM(String date) {
        short d, m, y, h, n;
        if (date != null && !"".equals(date.trim())) {
            y = Tools.parseShort(date.substring(0, 4));
            m = Tools.parseShort(date.substring(4, 6));
            d = Tools.parseShort(date.substring(6, 8));
            h = Tools.parseShort(date.substring(8, 10));
            n = Tools.parseShort(date.substring(10, 12));
            if (d > 0 && m > 0 && y > 0) {
                Calendar dt = Calendar.getInstance();
                dt.set(y, m - 1, d, h, n);
                return dt;
            }
        }
        return null;
    }

    /**
     * Връща true/false, респективно, ако текста е успешно или неуспешно парснат според формата 'ДД.ММ.ГГГГ'.
     *
     * @param date Дата като текст, която да се тества.
     * @return false, ако date е null или date не може да бъде парсната успешно
     */
    public static boolean checkParse(String date) {
        if (date != null) {
            ParsePosition pp = new ParsePosition(0);
            DateFormat df = new SimpleDateFormat(DD_MM_YYYY);
            df.setLenient(false);

            return df.parse(date, pp) != null && pp.getErrorIndex() == -1 && pp.getIndex() == 10;
        }

        return false;
    }

    /**
     * Проверява дали зададена дата е след друга.
     *
     * @param date1 Първата дата, която се проверява във формат 'ДД.ММ.ГГГГ'.
     * @param date2 Втората дата, която се проверява във формат 'ДД.ММ.ГГГГ'.
     * @return Стойност <code>true</code>, ако първата дата е преди или равна на втората.
     */
    public static boolean checkDateOrder(String date1, String date2) {
        DateFormat df = new SimpleDateFormat(DD_MM_YYYY);
        Date d1 = df.parse(date1, new ParsePosition(0));
        Date d2 = df.parse(date2, new ParsePosition(0));
        return d1 != null && d2 != null && !d1.after(d2);
    }

    /**
     * Проверява дали зададена дата е в зададен интервал от време.
     *
     * @param date Дата, която се проверява във формат 'ДД.ММ.ГГГГ'.
     * @param date1 Начална дата на периода във формат 'ДД.ММ.ГГГГ'.
     * @param date2 Крайна дата на периода във формат 'ДД.ММ.ГГГГ'.
     * @return Стойност <code>true</code>, ако зададената дата е в зададения период от време.
     */
    public static boolean checkDateBetween(String date, String date1, String date2) {
        DateFormat df = new SimpleDateFormat(DD_MM_YYYY);
        Date dt = df.parse(date, new ParsePosition(0));
        Date d1 = df.parse(date1, new ParsePosition(0));
        Date d2 = df.parse(date2, new ParsePosition(0));
        return dt != null && d1 != null && d2 != null && !dt.before(d1) && !dt.after(d2);
    }

    /**
     * @return Текущата година като число
     */
    public static int currentYear() {
        return Tools.parseInt(new SimpleDateFormat("yyyy").format(new Date()));
    }

    /**
     * Проверява дали две дати показват валиден период от време.
     *
     * @param date1 Първата дата.
     * @param date2 Втората дата.
     * @return Стойност <code>true</code>, ако двете дати са валидни, но първата дата е след втората.
     */
    public static boolean invalidOrder(String date1, String date2) {
        Calendar d1 = parse(date1);
        Calendar d2 = parse(date2);
        return d1 != null && d2 != null && d1.after(d2);
    }

    /**
     * Връща датата на понеделника от зададена седмица.
     *
     * @param date Дата, от която да се определи седмицата.
     * @return Датата на понеделника от зададената седмица.
     */
    public static String getMonday(String date) {
        Calendar res = parse(date);
        if (res != null) {
            int dow = res.get(Calendar.DAY_OF_WEEK);
            res.add(Calendar.DAY_OF_YEAR, (dow * -1) + 1);
            return format(res);
        }
        return null;
    }

    /**
     * Връща датата на неделята от зададена седмица.
     *
     * @param date Дата, от която да се определи седмицата.
     * @return Датата на неделята от зададената седмица.
     */
    public static String getSunday(String date) {
        Calendar res = parse(date);
        if (res != null) {
            int dow = res.get(Calendar.DAY_OF_WEEK);
            res.add(Calendar.DAY_OF_YEAR, (dow * -1) + 7);
            return format(res);
        }
        return null;
    }

    /**
     * Преобразува дата в грегориански формат за XML.
     *
     * @param dt Дата, която да се преобразува.
     * @return Преобразуваната дата или стойност <code>null</code>, ако зададената дата е невалидна.
     */
    public static XMLGregorianCalendar toXMLGregorianCalendar(String dt) {
        try {
            if (dt != null && !dt.isEmpty()) {
                SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
                Date d = sdf.parse(dt);
                GregorianCalendar g = new GregorianCalendar();
                g.setTime(d);
                return DatatypeFactory.newInstance().newXMLGregorianCalendar(g);
            }
        }
        catch (Exception e) {
            // do nothing
        }
        return null;
    }

    /**
     * Преобразува дата в грегориански формат за XML.
     *
     * @param dt Дата, която да се преобразува.
     * @return Преобразуваната дата или стойност <code>null</code>, ако зададената дата е невалидна.
     */
    public static XMLGregorianCalendar toXMLGregorianCalendar(Date dt) {
        GregorianCalendar c = new GregorianCalendar();
        c.setTime(dt);
        try {
            return DatatypeFactory.newInstance().newXMLGregorianCalendar(c);
        }
        catch (DatatypeConfigurationException e) {
            return null;
        }
    }

    private DateUtils() {}
}
