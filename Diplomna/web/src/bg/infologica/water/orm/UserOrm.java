package bg.infologica.water.orm;

import bg.infologica.common.Debug;
import bg.infologica.common.SmartMap;
import bg.infologica.common.Tools;
import bg.infologica.water.core.BarCommons;
import bg.infologica.water.core.Database;
import bg.infologica.water.core.SessionMessages;

import javax.servlet.http.HttpSession;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Клас за управление данните на потребител.
 *
 * @author Кальо Катеров
 * @version 2013-07-03 Първа версия.
 */
public final class UserOrm {

    private int user_id = 0;
    private String login_name = null;
    private String pass1 = null;
    private String pass2 = null;
    private String user_name = null;
    private int role_id = 0;
    private boolean active = false;


    /**
     * Конструктор на класа.
     *
     * @param get Клас с данните за заявката.
     */
    public UserOrm(SmartMap get) {
        setUserId(get.getInt("user_id"));
        setLoginName(get.getString("login_name"));
        setPass1(get.getString("pass1"));
        setPass2(get.getString("pass2"));
        setUserName(get.getString("user_name"));
        setRoleId(get.getInt("role_id"));
        setActive(get.getBoolean("active"));
    }

    /**
     * Конструктор на класа.
     *
     * @param db Клас за работа с базата данни на системата.
     * @param user_id Код на потребителя, чиито данни да се заредят.
     */
    public UserOrm(Database db, int user_id) {
        ResultSet rs = null;
        try {
            rs = db.select("select * from users where user_id=" + user_id);
            if (rs != null && rs.next()) {
                setUserId(rs.getInt("user_id"));
                setLoginName(rs.getString("user_name"));
                setUserName(rs.getString("names"));
                setRoleId(rs.getInt("role_id"));
                setActive(rs.getBoolean("active"));
            }
        }
        catch (SQLException e) {
            Debug.trace(e, "UserOrm()");
        }
        finally {
            Database.RELEASE(rs);
        }
    }

    /**
     * Проверява дали данните в класа са валидни.
     *
     * @param session Клас за управление на текущата HTTP сесия на потребителя.
     * @param db Клас за работа с базата данни на системата.
     * @return Стойност <code>true</code>, ако данните в класа са валидни.
     */
    public boolean valid(HttpSession session, Database db) {
        if (Tools.emptyString(login_name)) {
            SessionMessages.error(session, "Не е въведено потребителско име.");
        } else {
            int name_min = 5;
            if (name_min > 0 && login_name.length() < name_min)
                SessionMessages.error(session, "Потребителското име е твърде късо - трябва да съдържа поне " + name_min + " символа.");
            if (db.fetchInt("select count(*) from users where user_name=" +
                    Tools.singleQuote(login_name) + " and user_id<>" + user_id) > 0) {
                SessionMessages.error(session, "Потребителското име вече се използва в системата.");
            }
        }
        if (user_id <= 0) {
            if (Tools.emptyString(pass1)) {
                SessionMessages.error(session, "Не е въведена парола за достъп.");
            } else {
                int pass_min = 6;
                if (pass_min > 0 && pass1.length() < pass_min)
                    SessionMessages.error(session, "Паролата е твърде къса - трябва да съдържа поне " + pass_min + " символа.");
                if (!pass1.equals(pass2))
                    SessionMessages.error(session, "Паролата не е повторена вярно.");
            }
        }
        if (Tools.emptyString(user_name))
            SessionMessages.error(session, "Не е въведено името на потребителя.");
        if (!db.exists("user_roles", "role_id", role_id)) {
            SessionMessages.error(session, "Не е избрана ролята на потребителя.");
        }
        return !SessionMessages.exists(session);
    }

    // GETTERS & SETTERS

    public int getUserId() {
        return user_id;
    }

    public void setUserId(int user_id) {
        this.user_id = user_id;
    }

    public String getLoginName() {
        return login_name;
    }

    public void setLoginName(String login_name) {
        this.login_name = login_name;
    }

    public String getLoginPass() {
        return pass1;
    }

    public void setPass1(String pass1) {
        this.pass1 = pass1;
    }

    public void setPass2(String pass2) {
        this.pass2 = pass2;
    }

    public String getUserName() {
        return user_name;
    }

    public void setUserName(String user_name) {
        this.user_name = BarCommons.fixString(user_name);
    }

    public int getRoleId() {
        return role_id;
    }

    public void setRoleId(int role_id) {
        this.role_id = role_id;
    }

    public boolean getActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }


}
