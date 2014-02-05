package bg.infologica.water.core;

import bg.infologica.common.Debug;

import java.io.FileInputStream;
import java.net.URL;
import java.util.Properties;

/**
 * Клас за управление на настройките, записани в конфигурационния файл на приложението.
 *
 * @author Кальо Катеров
 * @version 2013-06-17 Първа версия.
 */
public final class Settings {

    public static final String FOOTER_FILE = "xmod_footer.jsp";
    public static final String HEADER_FILE = "xmod_header.jsp";

    private static final String CONFIG_FN = "infologica.water2.conf";
    private static Settings instance = null;

    private Properties props;

    /**
     * Конструктор на класа.
     */
    private Settings() {
        props = new Properties();
        try {
            ClassLoader loader = getClass().getClassLoader();
            URL url = loader.getResource(CONFIG_FN);
            if (url != null) {
                props.load(new FileInputStream(url.getFile().replaceAll("%20", " ")));
            }
        }
        catch (Exception e) {
            Debug.trace(e, String.format("Settings(\"%s\")", CONFIG_FN));
        }
        Debug.setDebugEnabled("yes".equalsIgnoreCase(get("enable.debug")));
        Debug.setLogEnabled("yes".equalsIgnoreCase(get("enable.log")));
    }

    /**
     * Връща стойността на зададен ключ.
     *
     * @param key Ключ, чиято стойност да се върне.
     * @return Стойността на зададения ключ.
     */
    public String get(String key) {
        if (props.containsKey(key))
            return props.getProperty(key);
        return "";
    }

    /**
     * @return Указател към класа, за да се използва само едно копие на класа в цялата система.
     */
    public static Settings getInstance() {
        if (instance == null) {
            instance = new Settings();
        }
        return instance;
    }
}
