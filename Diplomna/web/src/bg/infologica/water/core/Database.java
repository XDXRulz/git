package bg.infologica.water.core;



/**
 * Клас за работа с националната база данни на системата.
 *
 * @author Кальо Катеров
 * @version 2013-06-17 Първа версия.
 */
public class Database extends PostgreSQL {

    /**
     * Конструктор на класа.
     */
    private final static String postgresqlHost = "localhost:5432/java";
    private final static String postgresqlUser = "postgres";
    private final static String postgresqlPassword = "XDXRulz90";

    /**
     * Конструктор на класа.
     */
    public Database() {
        System.out.print(postgresqlHost+ postgresqlUser+ postgresqlPassword);
        connect(postgresqlHost, postgresqlUser, postgresqlPassword);
    }


    /**
     * Определя следващата стойност на зададено поле от зададена таблица.
     *
     * @param table_name Име на таблицата.
     * @param key_name Име на полето (ключа).
     * @return Следващата стойност на зададеното поле от зададената таблица.
     */
    public int getUnique(String table_name, String key_name) {
        return fetchInt("select max(" + key_name + ") from " + table_name) + 1;
    }

    // СТАТИЧНИ МЕТОДИ

    /**
     * Преобразува булева стойност в "Y" или "N".
     *
     * @param value Стойност, която да се преобразува.
     * @return Стойност "Y" или "N" според стойността на зададения аргумент.
     */
    public static String boolYN(boolean value) {
        return value ? "Y" : "N";
    }
}
