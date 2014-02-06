package bg.infologica.project.utils;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;

/**
 * Клас с помощни методи за работа с низове.
 *
 * @author Василен Дончев
 * @version 2011-08-01 Първа версия.
 * @version 2013-08-25 Добавена са функциите join ... и са оправени описанията на функциите.
 */
public final class StringUtils {

    /**
     * Проверява дали зададен стринг е празен.
     *
     * @param string Стринг, който се проверява.
     * @return Стойност <code>true</code>, ако зададеният стринг е <code>null</code> или празен.
     */
    public static boolean empty(String string) {
        return string == null || string.trim().isEmpty();
    }

    /**
     * Проверява дали два стринга са еднакви, използвайки метода <code>equals</code> от класа <code>String</code>.
     *
     * @param s1 Първи стринг.
     * @param s2 Втори стринг.
     * @return Стойност <code>true</code>, ако първият низ няма стойност <code>null</code>
     *  и е лексикографски еднакъв с втория.
     */
    public static boolean equal(String s1, String s2) {
        return s1 != null && s1.equals(s2);
    }

    /**
     * Конвентира UTF-8 към ASCII с escape символи (&#92;uXXXX).
     * Използва се в properties файлове, тъй като <em>The Java compiler and other
     * Java tools can only process files which contain Latin-1 and/or Unicode-encoded
     * (&#92;uXXXX notation) characters.</em>
     * Originally by <a href="http://www.xinotes.org/notes/note/812/">Dr. Xi</a>.
     *
     * @param str Низ за конвентиране.
     * @return Конвентирания низ.
     */
    public static String escapeUTF8(String str) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < str.length(); ++i) {
            char c = str.charAt(i);
            if ((c >> 7) > 0) {
                sb.append("\\u");
                sb.append(Hex.HEX[(c >> 12) & 0xF]); // append the hex character for the left-most 4-bits
                sb.append(Hex.HEX[(c >> 8) & 0xF]);  // hex for the second group of 4-bits from the left
                sb.append(Hex.HEX[(c >> 4) & 0xF]);  // hex for the third group
                sb.append(Hex.HEX[c & 0xF]);         // hex for the last group, e.g., the right most 4-bits
            } else {
                sb.append(c);
            }
        }

        return sb.toString();
    }

    /**
     * Проверева дали стойността на зададен стринг е измежду някоя от следващите стойности.
     *
     * @param value Стринг, който се проверява.
     * @param pieces Стрингове, за които се проверява.
     * @return Стойност <code>true</code>, ако стойността на първия стринг съвпада с някой следващите стрингове.
     */
    public static boolean in(String value, String... pieces) {
        if (value != null || pieces != null) {
            for (String s : pieces) {
                if (equal(value, s))
                    return true;
            }
        }
        return false;
    }

    /**
     * Свързва зададените стрингове в един като използва зададен слепващ низ.
     *
     * @param glue Слепващ низ, който да се постави между всеки два стринга.
     * @param pieces Масив от стрингове, чиито елементи да се свързжат.
     * @return Стринг, съдържащ всички елементи на масива в реда, в който са дефинирани,
     *  със зададения слепващ низ между елементите.
     */
    public static String implode(String glue, String[] pieces) {
        StringBuilder res = new StringBuilder();
        if (pieces != null) {
            for (String s : pieces) {
                if (!empty(s)) {
                    if (res.length() > 0 && !empty(glue))
                        res.append(glue);
                    res.append(s);
                }
            }
        }
        return res.length() > 0 ? res.toString() : null;
    }

    /**
     * Свързва зададените стрингове в един като използва зададен слепващ низ.
     *
     * @param glue Слепващ низ, който да се постави между всеки два стринга.
     * @param pieces Масив от стрингове, чиито елементи да се свързжат.
     * @return Стринг, съдържащ всички елементи на масива в реда, в който са дефинирани,
     *  със зададения слепващ низ между елементите.
     */
    public static String implode(String glue, List<String> pieces) {
        StringBuilder res = new StringBuilder();
        if (pieces != null) {
            for (String s : pieces) {
                if (!empty(s)) {
                    if (res.length() > 0 && !empty(glue))
                        res.append(glue);
                    res.append(s);
                }
            }
        }
        return res.length() > 0 ? res.toString() : null;
    }

    /**
     * Свързва зададените стрингове в един като използва зададен слепващ низ.
     *
     * @param glue Слепващ низ, който да се постави между всеки два стринга.
     * @param pieces Масив от стрингове, чиито елементи да се свързжат.
     * @return Стринг, съдържащ всички елементи на масива в реда, в който са дефинирани,
     *  със зададения слепващ низ между елементите.
     */
    public static String join(String glue, String... pieces) {
        StringBuilder res = new StringBuilder();
        if (pieces != null) {
            for (String s : pieces) {
                if (!empty(s)) {
                    if (res.length() > 0 && !empty(glue))
                        res.append(glue);
                    res.append(s);
                }
            }
        }
        return res.length() > 0 ? res.toString() : null;
    }

    /**
     * Повтаря зададен стринг, зададен брой пъти.
     *
     * @param value Стринг.
     * @param times Колко пъти да се повтори стринга.
     * @return Стринг, съдържащ зададения брой повторения на зададения стринг.
     */
    public static String repeat(String value, int times) {
        if (!empty(value) && times > 0) {
            StringBuilder res = new StringBuilder();
            for (int i = 0; i < times; i++) {
                res.append(value);
            }
            return res.toString();
        }
        return null;
    }









    /**
     * @param str входящия низ
     * @return 0 ако не може да се parse или integer ако може
     */
    public static int getInteger(String str) {
        try {
            return Integer.parseInt(str);
        } catch (Exception e) {
            return 0;
        }
    }

    public static Integer getIntegerOrNull(String str) {
        if (str != null) {
            try {
                return Integer.parseInt(str);
            } catch (Exception e) {
                // do nothing
            }
        }
        return null;
    }

    public static Long getLongOrNull(String str) {
        if (str != null) {
            try {
                return Long.parseLong(str);
            } catch (Exception e) {
                // do nothing
            }
        }
        return null;
    }

    /**
     * @param str входящия низ
     * @return 0 ако не може да се parse или double ако може
     */
    public static double getDouble(String str) {

        try {
            return Double.parseDouble(str);
        } catch (Exception e) {
            return 0;
        }

    }

    /**
     * <p>Checks if a CharSequence is whitespace, empty ("") or null.</p>
     * <p/>
     * <pre>
     * StringUtils.isNullOrWhitespace(null)      = true
     * StringUtils.isNullOrWhitespace("")        = true
     * StringUtils.isNullOrWhitespace(" ")       = true
     * StringUtils.isNullOrWhitespace("bob")     = false
     * StringUtils.isNullOrWhitespace("  bob  ") = false
     * </pre>
     *
     * @param cs the CharSequence to check, may be null
     * @return {@code true} if the CharSequence is null, empty or whitespace
     * @since 3.0 Changed signature from isNullOrWhitespace(String) to isNullOrWhitespace(CharSequence)
     */
    public static boolean isNullOrWhitespace(CharSequence cs) {
        int strLen;
        if (cs == null || (strLen = cs.length()) == 0) {
            return true;
        }
        for (int i = 0; i < strLen; i++) {
            if (!Character.isWhitespace(cs.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    /**
     * <p>Checks if a CharSequence is empty ("") or null.</p>
     *
     * @param cs The CharSequence to check, may be null
     * @return {@code true} if the CharSequence is null or empty
     */
    public static boolean isNullOrEmpty(CharSequence cs) {
        return cs == null || cs.length() == 0;
    }

    private final static HashMap<String, String> htmlEntities;
    static {
        htmlEntities = new HashMap<String, String>();
        htmlEntities.put("&lt;", "<");
        htmlEntities.put("&gt;", ">");
        htmlEntities.put("&amp;", "&");
        htmlEntities.put("&quot;", "\"");
        htmlEntities.put("&apos;", "'");
    }

    /**
     * <strong>Конвентира HTML съответствия в съответстващите им символи.</strong><br/>
     * Действа като обратна функция на @see#htmlSpecialCharsEncode<br/>
     * Извършват се следните промени:<br/>
     * <ul>
     * <li>&amp;lt; става &lt; (по-малко) </li>
     * <li>&amp;gt; става &gt; (по-голямо)</li>
     * <li>&amp;amp; става &amp; (амперсанд)</li>
     * <li>&amp;quot; става &quot; (двойни кавички)</li>
     * <li>&amp;apos; става &apos; (апостроф)</li>
     * </ul>
     *
     * @param str Низ за конвентиране
     * @return Конвентирания низ
     */
    public static String htmlSpecialCharsDecode(String str) {
        if (str == null) {
            return null;
        }
        int i, j;
        boolean continueLoop;
        int skip = 0;
        do {
            continueLoop = false;
            i = str.indexOf("&", skip);
            if (i > -1) {
                j = str.indexOf(";", i);
                if (j > i) {
                    String entityToLookFor = str.substring(i, j + 1);
                    String value = htmlEntities.get(entityToLookFor);
                    if (value != null) {
                        str = str.substring(0, i) + value + str.substring(j + 1);
                        continueLoop = true;
                    } else {
                        skip = i + 1;
                        continueLoop = true;
                    }
                }
            }
        }
        while (continueLoop);

        return str;
    }

    /**
     * Escape-ва низ за JSON.
     * Escape quotes, \, /, \r, \n, \b, \f, \t and other control characters (U+0000 through U+001F).
     * <em>Originally by <a href="https://code.google.com/p/json-simple/">JSON Simple 1.1.1</a></em>
     *
     * @param s           низ за escape
     * @param nullIsEmpty флаг дали, ако s е null, да се върне празен низ (true) или null
     * @return escape
     */
    public static String jsonEscape(String s, boolean nullIsEmpty) {
        if (s == null) {
            return nullIsEmpty ? "" : null;
        }
        if (s.isEmpty()) {
            return "";
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); ++i) {
            char ch = s.charAt(i);
            switch (ch) {
                case '"':
                    sb.append("\\\"");
                    break;
                case '\\':
                    sb.append("\\\\");
                    break;
                case '\b':
                    sb.append("\\b");
                    break;
                case '\f':
                    sb.append("\\f");
                    break;
                case '\n':
                    sb.append("\\n");
                    break;
                case '\r':
                    sb.append("\\r");
                    break;
                case '\t':
                    sb.append("\\t");
                    break;
                case '/':
                    sb.append("\\/");
                    break;
                default:
                    //Reference: http://www.unicode.org/versions/Unicode5.1.0/
                    if ((ch >= '\u0000' && ch <= '\u001F') || (ch >= '\u007F' && ch <= '\u009F') || (ch >= '\u2000' && ch <= '\u20FF')) {
                        String ss = Integer.toHexString(ch);
                        sb.append("\\u");
                        for (int k = 0; k < 4 - ss.length(); ++k) {
                            sb.append('0');
                        }
                        sb.append(ss.toUpperCase());
                    } else {
                        sb.append(ch);
                    }
            }
        }

        return sb.toString();
    }

    public static String jsonEscape(String s) {
        return jsonEscape(s, false);
    }

    public static String toJson(Collection<? extends JsonSupport> col) {
        if (col == null) {
            return "[]";
        }

        StringBuilder sb = new StringBuilder("[");
        for (JsonSupport o : col) {
            sb.append(o.toJson())
                    .append(",");
        }
        if (sb.length() > 1) {
            sb.delete(sb.length() - 1, sb.length());
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * Връща подаденият стринг, като параметрите указват дали да сложи интервали преди и/или след него.
     * Ако стрингът е whitespace/null, връща празен стринг.
     *
     * @param test      Стрингът, който да се форматира.
     * @param putBefore Дали да слага интервали преди test.
     * @param putEnd    Дали да слага интервали след него.
     * @return Никога null
     */
    public static String getString(String test, boolean putBefore, boolean putEnd) {
        return getString(test, putBefore, putEnd, " ", " ");
    }

    /**
     * Връща подаденият стринг, като параметрите указват дали да слага символи и какви да бъдат те
     * пред и/или след него.
     * <p/>
     * Ако стрингът е whitespace/null, връща празен стринг.
     *
     * @param test        Стрингът, който да се форматира.
     * @param putBefore   Дали да слага символи преди test.
     * @param putEnd      Дали да слага символи след него.
     * @param beforeChars какви символи да сложи преди него.
     * @param endChars    какви символи да сложи след него.
     * @return Никога null
     */
    public static String getString(String test, boolean putBefore, boolean putEnd, String beforeChars, String endChars) {
        if (!isNullOrWhitespace(test))
            return (putBefore ? beforeChars : "") +
                    test.trim() +
                    (putEnd ? endChars : "");

        return "";
    }

    // dummy constructor
    private StringUtils() {}
}
