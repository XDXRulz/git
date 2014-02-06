package bg.infologica.project.dao;

import bg.infologica.common.Debug;
import bg.infologica.project.core.BarCommons;
import bg.infologica.project.core.Database;
import bg.infologica.project.orm.UserOrm;

import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * Работа с таблицата за потребители.
 *
 * @author Кальо Катеров
 * @version 2013-07-01 Първа версия.
 */
public final class UsersDao {

    /**
     * Изтрива зададен потребител от базата данни на системата.
     *
     * @param db Клас за работа с базата данни на системата.
     * @param user_id Код на потребителя, който да се изтрие.
     * @param admin_id Код на администратора.
     * @return Стойност <code>true</code>, ако потребителят е изтрит успешно.
     */
    public static boolean delete(Database db, int user_id, int admin_id) {
            db.execute("delete from users where user_id=" + user_id);
            return true;
    }


    /**
     * Прочита кодираната парола на зададен потребител от базата данни.
     *
     * @param db Клас за работа с базата данни на системата.
     * @param user_id Код на потребителя, чиято парола да се прочете от базата данни.
     * @return Кодираната парола на зададения потребител.
     */
    public static String getPassword(Database db, int user_id) {
        return db.fetchString("select user_pass from users where user_id=" + user_id);
    }

    /**
     * Записва нова парола на зададен потребител.
     *
     * @param db Клас за работа с базата данни на системата.
     * @param user_id Код на потребителя, чиято парола се променя.
     * @param password Новата парола на потребителя.
     * @param admin_id Код на администратора.
     * @return Стойност <code>true</code>, ако паролата е записана успешно в базата данни.
     */
    public static boolean setPassword(Database db, int user_id, String password, int admin_id) {
        PreparedStatement stmt = null;
        try {
            stmt = db.prepareStatement("update users set user_pass=? where user_id=?");
            stmt.setString(1, BarCommons.passwordEncode(password));
            stmt.setInt(2, user_id);
            stmt.execute();
            return true;
        }
        catch (SQLException e) {
            Debug.trace(e, "UsersDao.setPassword()");
            return false;
        }
        finally {
            Database.RELEASE(stmt);
        }
    }

    /**
     * Записва данните за потребител в базата данни на системата.
     *
     * @param db Клас за работа с базата данни на системата.
     * @param data Данни за потребителя.
     * @param admin_id Код на администратора.
     * @return Стойност <code>true</code>, ако данните са записани успешно в базата данни.
     */
    public static boolean save(Database db, UserOrm data, int admin_id) {
        if (db.exists("users", "user_id", data.getUserId()))
            return update(db, data);
        return insert(db, data);
    }

    /**
     * Добавя данните за потребител в базата данни на системата.
     *
     * @param db Клас за работа с базата данни на системата.
     * @param data Данни за потребителя.
     * @return Стойност <code>true</code>, ако данните са записани успешно в базата данни.
     */
    private static boolean insert(Database db, UserOrm data) {
        PreparedStatement stmt = null;
        try {
            stmt = db.prepareStatement("insert into users (user_name,user_pass," +
                    "names,active,role_id) " +
                    "values (?,?,?,?,?)");
            stmt.setString(1, data.getLoginName());
            stmt.setString(2, BarCommons.passwordEncode(data.getLoginPass()));
            stmt.setString(3, data.getUserName());
            stmt.setBoolean(4, data.getActive());
            stmt.setInt(5, data.getRoleId());
            stmt.execute();
            return true;
        }
        catch (SQLException e) {
            Debug.trace(e, "UsersDao.insert()");
            return false;
        }
        finally {
            Database.RELEASE(stmt);
        }
    }

    /**
     * Обновява данните за потребител в базата данни на системата.
     *
     * @param db Клас за работа с базата данни на системата.
     * @param data Данни за потребителя.
     * @return Стойност <code>true</code>, ако данните са записани успешно в базата данни.
     */
    private static boolean update(Database db, UserOrm data) {
        PreparedStatement stmt = null;
        try {
            stmt = db.prepareStatement("UPDATE users\n" +
                    "   SET user_name=?, names=?, active=?, role_id=?, user_pass=?\n" +
                    "       \n" +
                    " WHERE user_id = ?;\n");
            stmt.setString(1, data.getLoginName());
            stmt.setString(2, data.getUserName());
            stmt.setBoolean( 3, data.getActive());
            stmt.setInt(4, data.getRoleId());
            stmt.setString(5, BarCommons.passwordEncode(data.getLoginPass()));
            stmt.setInt(6, data.getUserId());
            stmt.execute();
            return true;
        }
        catch (SQLException e) {
            Debug.trace(e, "UsersDao.update()");
            return false;
        }
        finally {
            Database.RELEASE(stmt);
        }
    }

    private UsersDao() {}
}
