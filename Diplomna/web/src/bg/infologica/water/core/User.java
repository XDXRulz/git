package bg.infologica.water.core;

import bg.infologica.common.Debug;
import bg.infologica.common.SessionTools;
import bg.infologica.common.Tools;

import javax.servlet.http.HttpSession;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Клас за управление на влезлия в системата потребител.
 *
 * @author Кальо Катеров
 * @version 2013-06-17 Първа версия.
 */
public final class User {

    protected static final String CURRENT_USER_ID = "bg.infologica.water.current_user_id";

    private int user_id = 0;
    private String user_name = null;
    private boolean active = false;
    private int role_id = 0;
    private String names = null;

    /**
     * Конструктор на класа.
     *
     * @param user_id Код на потребител, чиито данни да се заредят от базата данни.
     */
    private User(int user_id) {
        ResultSet rs = null;
        Database db = null;
        try {
            db = new Database();
            rs = db.select("select active,user_name,role_id,names " +
                    "from users where user_id=" + user_id);
            if (rs != null && rs.next()) {
                if (rs.getBoolean("active")) {
                    this.user_id = user_id;
                    user_name = rs.getString("user_name");
                    active = true;
                    role_id = rs.getInt("role_id");
                    names = rs.getString("names");
               }
            }
        }
        catch (SQLException e) {
            Debug.trace(e, "User()");
        }
        finally {
            Database.RELEASE(rs);
            Database.RELEASE(db);
        }
    }

    /**
     * @return Вътрешния код на влезлия в системата потребител.
     */
    public int getId() {
        return user_id;
    }

    /**
     * @return Името на потребителя.
     */
    public String getName() {
        return (user_id > 0) ? user_name : "";
    }

    /**
     * @return Стойността на флага, показващ дали потребителят е с временна парола.
     */


    /**
     * @return Ролята на потребителя.
     */
    public int getRoleId() {
        return (user_id > 0) ? role_id : 0;
    }

    /**
     * @return Код на РИОСВ, на която е представител потребителя.
     */

    /**
     * @return Кода на лаборатория, на която е представител потребителя.
     */


    /**
     * Проверява дали потребителят има зададена роля.
     *
     * @param roles Списък роли, които се проверяват.
     * @return Стойност <code>true</code>, ако потребителят някоя от зададените роли.
     */
    public boolean hasRole(int... roles) {
        if (user_id > 0) {
            for(int role : roles) {
                if (role_id == role)
                    return true;
            }
        }
        return false;
    }

    // СТАТИЧНИ МЕТОДИ

    /**
     * Създава клас за управление на влезлия в системата потребител с данните от текущата HTTP сесия.
     *
     * @param session Текущ1ата HTTP сесия, в която се проверява дали в системата има влязъл потребител.
     * @return Клас за управление на влезлия в системата потребител или null, ако в системата не е влязъл потребител.
     */
    public static User create(HttpSession session) {
        int id = SessionTools.getIntProperty(session, CURRENT_USER_ID);
        return (id > 0 ? new User(id) : null);
    }

    /**
     * Връща началната страница според типа и правата за достъп на зададен потребител.
     *
     * @param user Потребител, чиято начална страница да се върне.
     * @return Началната страница за зададения потребител.
     */
    public static String home(User user) {
        if (valid(user)) {
            return "home.jsp";
        }
        return "index.jsp";
    }

    /**
     * Осъществява вход в системата на потребител със зададените потребителско име и парола.
     *
     * @param session Текущата HTTP сесия.
     * @param username Потребителско име.
     * @param password Парола за достъп.
     * @return Клас за управление на текущия потребител или null,
     * ако са въведени невалидно потребителско име или парола.
     */
    public static User login(HttpSession session, String username, String password) {
        Database db = null;
        try {
            db = new Database();

            ResultSet rs = null;
            try {
                StringBuilder sql = new StringBuilder("select user_id,active from users ")
                        .append("where user_name=").append(Tools.singleQuote(username))
                        .append(" and user_pass=").append(Tools.singleQuote(BarCommons.passwordEncode(password)));
                Debug.log(sql.toString());
                rs = db.select(sql);
                if (rs != null && rs.next()) {
                    Debug.log("user_id" +rs.getInt("user_id")+" active="+ rs.getBoolean("active"));
                    if (rs.getBoolean("active")) {
                        db.execute("update users set last_login=localtimestamp::DATE where user_id=" + rs.getInt("user_id"));
                        SessionTools.setIntProperty(session, CURRENT_USER_ID, rs.getInt("user_id"));
                        return new User(rs.getInt("user_id"));
                    }
                }
            }
            catch (SQLException e) {
                Debug.trace(e, "User.login()");
            }
            finally {
                Database.RELEASE(rs);
            }

            SessionMessages.error(session, "Невалидно потребителско име или парола.");
        }
        finally {
            Database.RELEASE(db);
        }
        return null;
    }

    /**
     * Осъществява изход на влезлия потребител от системата.
     * @param session Текущата HTTP сесия.
     */
    public static void logout(HttpSession session) {
        SessionTools.setLongProperty(session, CURRENT_USER_ID, 0);
    }

    /**
     * Проверява дали зададения клас съдържа валидни данни за управление на влезлия в системата потребител.
     *
     * @param user Клас за управление на влезлия в системата потребител.
     * @return Стойност true, ако зададеният клас съдържа валидни данни за управление на влезлия в системата потребител.
     */
    public static boolean valid(User user) {
        return (user != null && user.getId() > 0);
    }
}
