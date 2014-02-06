package bg.infologica.project.utils;

import java.util.regex.Pattern;

/**
 * Функции за работа с електронни адресио.
 *
 * @author Кальо Катеров
 * @version 2013-07-17
 */
public class EmailUtils {

    private static final Pattern EMAIL_PATTERN =  Pattern.compile(
            "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");

    /**
     * Проверява дали зададен електронен адрес изглежда валиден.
     *
     * @param email Електронен адрес, който се проверява.
     * @return Стойност <code>true</code>, ако зададеният електронен адрес изглежда влаиден.
     */
    public static boolean valid(String email) {
        return EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Проверява дали зададен списък съдържа валидни електронни адреси.
     *
     * @param emails Списък електронни адреси, който се проверява.
     * @return Стойност <code>true</code>, ако зададеният списък съдържа валидни електронни адреси.
     */
    public static boolean valid(String[] emails) {
        if (emails != null) {
            for (String s : emails) {
                if (!EMAIL_PATTERN.matcher(s).matches())
                    return false;
            }
            return true;
        }
        return false;
    }

    // dummy constructor
    private EmailUtils() {}
}
