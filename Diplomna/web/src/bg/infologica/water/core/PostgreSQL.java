package bg.infologica.water.core;

import bg.infologica.common.Debug;
import bg.infologica.common.SmartMap;
import bg.infologica.common.Tools;
import bg.infologica.common.db.CommonDatabase;
import bg.infologica.common.db.CommonEncoding;

import java.io.BufferedReader;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;


public class PostgreSQL implements CommonDatabase {

    private static boolean debug = false;

    private CommonEncoding encoding = null;
    private Connection conn = null;

    /**
     * Конструктор на класа.
     */
    public PostgreSQL() {

    }

    /**
     * Конструктор на класа.
     *
     * @param encoding Клас за преобразуване на данните от UTF-8 в кодирането за базата данни.
     */
    public PostgreSQL(CommonEncoding encoding) {
        this.encoding = encoding;
    }

    /**
     * Осъществява връзка със зададена база данни.
     *
     * @param server   Адрес на сървъра на базата данни.
     * @param username Потребителско име.
     * @param password Парола за достъп.
     */
    public void connect(String server, String username, String password) {
        debugLog("PostgreSQL.connect(\"" + server + "\", \"" + username + "\", \"" + password + "\")");
        try {
            Driver driver = (Driver) Class.forName("org.postgresql.Driver").newInstance();
            DriverManager.registerDriver(driver);
//            Debug.log(server + " " + username + " " + password);
            this.conn = DriverManager.getConnection("jdbc:postgresql://" + server, username, password);
        }
        catch (Exception ex) {
            Debug.trace(ex, "PostgreSQL.connect()");
        }
    }

    /**
     * Осъществява връзка с база данни, описана в ресурс със зададено име.
     *
     * @param resource_name Наименование на ресурс, описващ връзката с базата данни
     */
    public void connect(String resource_name) {
        debugLog("PostgreSQL.connect(\"" + resource_name + "\")");
        try {
            Context initial = new InitialContext();
            Context env = (Context) initial.lookup("java:/comp/env");
            DataSource ds = (DataSource) env.lookup(resource_name);
            this.conn = ds.getConnection();
            if (connected()) {
                try {
                    this.conn.setAutoCommit(true);
                }
                catch (SQLException ex) {
                    Debug.trace(ex, "PostgreSQL.connect()");
                }
            }
        }
        catch (Exception ex) {
            Debug.trace(ex, "PostgreSQL.connect()");
        }
    }

    /**
     * @return Стойност true, ако има връзка с базата данни.
     */
    public boolean connected() {
        debugLog("PostgreSQL.connected()");
        try {
            return (this.conn != null && !this.conn.isClosed());
        }
        catch (SQLException ex) {
            Debug.trace(ex, "PostgreSQL.connected()");
            return false;
        }
    }

    /**
     * Прекъсва връзката с базата данни.
     */
    public void disconnect() {
        debugLog("PostgreSQL.disconnect()");
        try {
            if (this.conn != null && !this.conn.isClosed()) {
                commit();
                this.conn.close();
                this.conn = null;
            }
        }
        catch (SQLException ex) {
            Debug.trace(ex, "PostgreSQL.disconnect()");
        }
    }

    /**
     * @return Стойност true, ако сесията е в транзакция.
     */
    public boolean inTransaction() {
        debugLog("PostgreSQL.inTransaction()");
        if (connected()) {
            try {
                return !conn.getAutoCommit();
            }
            catch (SQLException ex) {
                Debug.trace(ex, "PostgreSQL.inTransaction()");
            }
        }
        return false;
    }

    /**
     * Започва нова транзакция.
     */
    public void startTransaction() {
        debugLog("PostgreSQL.startTransaction()");
        if (connected()) {
            try {
                this.conn.setAutoCommit(false);
            }
            catch (SQLException ex) {
                Debug.trace(ex, "PostgreSQL.startTransaction()");
            }
        }
    }

    /**
     * Потвърждава направените промени в базата данни, ако сесията е в транзакция.
     */
    public void commit() {
        debugLog("PostgreSQL.commit()");
        try {
            if (inTransaction()) {
                this.conn.commit();
                this.conn.setAutoCommit(true);
            }
        }
        catch (SQLException ex) {
            Debug.trace(ex, "PostgreSQL.commit()");
        }
    }

    /**
     * Отхвърля направените промени в базата данни, ако сесията е в транзакция.
     */
    public void rollback() {
        debugLog("PostgreSQL.rollback()");
        try {
            if (inTransaction()) {
                this.conn.rollback();
                this.conn.setAutoCommit(true);
            }
        }
        catch (SQLException ex) {
            Debug.trace(ex, "PostgreSQL.rollback()");
        }
    }

    /**
     * @return Класа за пробразуване на данните от UTF-8 в кодирането на базата данни.
     */
    public CommonEncoding getEncoding() {
        return this.encoding;
    }

    /**
     * Изпълнява зададена SQL заявка към базата данни.
     * Тази функция се използва за изпълняване на INSERT, UPDATE и DELETE заявки.
     *
     * @param sql Заявка към базата данни, която да се изпълни.
     * @return Стойност true, ако заявката е изпълнена успешно.
     */
    public boolean execute(String sql) {
        debugLog("PostgreSQL.execute(\"" + sql + "\")");
        if (connected()) {
            Statement stmt = null;
            try {
                stmt = this.conn.createStatement();
                stmt.executeUpdate(prepare(sql));
                return true;
            }
            catch (SQLException ex) {
                Debug.traceSQL(ex, sql);
            }
            finally {
                RELEASE(stmt);
            }
        }
        return false;
    }

    /**
     * Изпълнява зададена SQL заявка към базата данни.
     * Тази функция се използва за изпълняване на INSERT, UPDATE и DELETE заявки.
     *
     * @param sql Заявка към базата данни, която да се изпълни.
     * @return Стойност true, ако заявката е изпълнена успешно.
     */
    public boolean execute(StringBuilder sql) {
        return execute(sql.toString());
    }

    /**
     * Изпълнява зададена SQL заявка към базата данни.
     * Тази функция се използва за изпълняване на INSERT, UPDATE и DELETE заявки.
     *
     * @param sql Заявка към базата данни, която да се изпълни.
     * @throws SQLException Ако възникне грешка при изпълнение на заявката.
     */
    public void executeEx(String sql) throws SQLException {
        debugLog("PostgreSQL.executeEx(\"" + sql + "\")");
        if (connected()) {
            Statement stmt = null;
            try {
                stmt = this.conn.createStatement();
                stmt.executeUpdate(prepare(sql));
            }
            catch (SQLException ex) {
                Debug.traceSQL(ex, sql);
                throw new SQLException(ex.getMessage());
            }
            finally {
                RELEASE(stmt);
            }
        } else
            throw new SQLException("Not connected to database.");
    }

    /**
     * Изпълнява зададена SQL заявка към базата данни.
     * Тази функция се използва за изпълняване на INSERT, UPDATE и DELETE заявки.
     *
     * @param sql Заявка към базата данни, която да се изпълни.
     * @throws SQLException Ако възникне грешка при изпълнение на заявката. 
     */
    public void executeEx(StringBuilder sql) throws SQLException {
        executeEx(sql.toString());
    }

    /**
     * Проверява дали зададената SQL заявка връща стойност по-голяма от нула.
     * Използва се за SQL заявки от вида <code>select count(*) from ...</code>, за да се провери
     * дали в базата данни съществуват някакви данни.
     *
     * @param sql Заявка към базата данни, която да се изпълни.
     * @return Стойност true, ако зададената SQL заявка върне стойност, по-голяма от нула.
     */
    public boolean exists(String sql) {
        return (fetchInt(sql) > 0);
    }

    /**
     * Проверява дали зададената SQL заявка връща стойност по-голяма от нула.
     * Използва се за SQL заявки от вида <code>select count(*) from ...</code>, за да се провери
     * дали в базата данни съществуват някакви данни.
     *
     * @param sql Заявка към базата данни, която да се изпълни.
     * @return Стойност true, ако зададената SQL заявка върне стойност, по-голяма от нула.
     */
    public boolean exists(StringBuilder sql) {
        return exists(sql.toString());
    }

    /**
     * Проверява дали зададена стойност на зададен ключ съществува в зададена таблица от базата данни.
     *
     * @param table_name Име на таблицата, в която се търси.
     * @param key_name   Име на ключа, чиято стойност се проверява.
     * @param key_value  Стойност на ключа, за която се проверява.
     * @return Стойност true, ако зададената стойност съществува в базата данни.
     */
    public boolean exists(String table_name, String key_name, long key_value) {
        return exists(new StringBuilder("select count(*) from ").append(table_name)
                .append(" where ").append(key_name).append("=").append(key_value));
    }

    /**
     * Проверява дали зададена стойност на зададен ключ съществува в зададена таблица от базата данни.
     *
     * @param table_name Име на таблицата, в която се търси.
     * @param key_name   Име на ключа, чиято стойност се проверява.
     * @param key_value  Стойност на ключа, за която се проверява.
     * @return Стойност true, ако зададената стойност съществува в базата данни.
     */
    public boolean exists(String table_name, String key_name, String key_value) {
        return exists(new StringBuilder("select count(*) from ").append(table_name)
                .append(" where ").append(key_name).append("='").append(key_value).append("'"));
    }

    /**
     * Подготвя заявка за извикване на вградена процедура.
     *
     * @param sql SQL заявка за извикване на вградена процедура.
     * @return Подготвената заявка за извикване на вградена процедура.
     * @throws SQLException Ако възникне грешка по време на генериране на заявката.
     */
    public CallableStatement prepareCall(String sql) throws SQLException {
        debugLog("PostgreSQL.prepareCall(\"" + sql + "\")");
        try {
            return this.conn.prepareCall(prepare(sql));
        }
        catch (SQLException ex) {
            Debug.traceSQL(ex, sql);
            throw new SQLException(ex.getMessage());
        }
    }

    /**
     * Подготвя заявка за извикване на вградена процедура.
     *
     * @param sql SQL заявка за извикване на вградена процедура.
     * @return Подготвената заявка за извикване на вградена процедура.
     * @throws SQLException Ако възникне грешка по време на генериране на заявката.
     */
    public CallableStatement prepareCall(StringBuilder sql) throws SQLException {
        return prepareCall(sql.toString());
    }

    /**
     * Подготвя зададена SQL заявка за изпълнение.
     *
     * @param sql SQL заявка, която да се подготви за изпълнение.
     * @return Подготвената за изпълнение SQL заявка.
     * @throws SQLException Ако възникне съобщение за грешка по преме на подготовката.
     */
    public PreparedStatement prepareStatement(String sql) throws SQLException {
        debugLog("PostgreSQL.prepareStatement(\"" + sql + "\")");
        try {
            return this.conn.prepareStatement(prepare(sql));
        }
        catch (SQLException ex) {
            Debug.traceSQL(ex, sql);
            throw new SQLException(ex.getMessage());
        }
    }

    /**
     * Подготвя зададена SQL заявка за изпълнение.
     *
     * @param sql SQL заявка, която да се подготви за изпълнение.
     * @return Подготвената за изпълнение SQL заявка.
     * @throws SQLException Ако възникне съобщение за грешка по преме на подготовката.
     */
    public PreparedStatement prepareStatement(StringBuilder sql) throws SQLException {
        return prepareStatement(sql.toString());
    }

    /**
     * Подготвя масив с резултата от зададена SQL заявка.
     *
     * @param sql Заявка от тип SELECT, резултата от която да се върне.
     * @return Резултата от заявката или null, ако възникне грешка при изпълнение на заявката.
     */
    public ResultSet select(String sql) {
        debugLog("PostgreSQL.select(\"" + sql + "\")");
        if (connected()) {
            try {
                Statement stmt = this.conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
                return stmt.executeQuery(prepare(sql));
            }
            catch (SQLException ex) {
                Debug.traceSQL(ex, sql);
            }
        }
        return null;
    }

    /**
     * Подготвя масив с резултата от зададена SQL заявка.
     *
     * @param sql Заявка от тип SELECT, резултата от която да се върне.
     * @return Резултата от заявката или null, ако възникне грешка при изпълнение на заявката.
     */
    public ResultSet select(StringBuilder sql) {
        return select(sql.toString());
    }

    /**
     * Генерира масив със стойностите на резултата от изпълнението на зададената SQL заявка.
     *
     * @param sql Заявка от тип SELECT, която да се изпълни.
     * @return Масив със стойностите на резулата от зададената SQL заявка.
     */
    public ArrayList<HashMap<String, String>> fetchArray(String sql) {
        ResultSet rs = null;
        try {
            rs = this.select(sql);
            if (rs != null) {
                ArrayList<HashMap<String, String>> res = new ArrayList<HashMap<String, String>>();
                rs.beforeFirst();
                while (rs.next()) {
                    res.add(readResultSet(rs));
                }
                return res;
            }
        }
        catch (SQLException ex) {
            Debug.traceSQL(ex, sql);
        }
        finally {
            RELEASE(rs);
        }
        return null;
    }

    /**
     * Генерира масив със стойностите на резултата от изпълнението на зададената SQL заявка.
     *
     * @param sql Заявка от тип SELECT, която да се изпълни.
     * @return Масив със стойностите на резулата от зададената SQL заявка.
     */
    public ArrayList<HashMap<String, String>> fetchArray(StringBuilder sql) {
        return fetchArray(sql.toString());
    }

    /**
     * Проверява дали зададената SQL заявка връща стойност "Y" в първата колона на първия ред от резултата.
     *
     * @param sql Заявка от тип SELECT, която да се изпълни.
     * @return Стойност true, ако резултатът от заявката е "Y".
     */
    public boolean fetchBoolean(String sql) {
        return "Y".equals(fetchString(sql).toUpperCase());
    }

    /**
     * Проверява дали зададената SQL заявка връща стойност "Y" в първата колона на първия ред от резултата.
     *
     * @param sql Заявка от тип SELECT, която да се изпълни.
     * @return Стойност true, ако резултатът от заявката е "Y".
     */
    public boolean fetchBoolean(StringBuilder sql) {
        return fetchBoolean(sql.toString());
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като текстов блок.
     *
     * @param sql Заявка от тип SELECT, която да се изпълни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или празен стринг, ако възникне грешка по време на изпълнение на SQL заявката
     *     или тя не върне резултат.
     */
    public String fetchClob(String sql) {
        debugLog("PostgreSQL.fetchClob(\"" + sql + "\")");
        ResultSet rs = null;
        try {
            rs = this.select(sql);
            if (rs != null && rs.next()) {
                BufferedReader in = new BufferedReader(rs.getCharacterStream(1));
                StringBuilder res = new StringBuilder();
                String dummy;
                while ((dummy = in.readLine()) != null) {
                    res.append(dummy).append("\n");
                }
                return res.toString();
            }
        }
        catch (Exception ex) {
            Debug.traceSQL(ex, sql);
        }
        finally {
            RELEASE(rs);
        }
        return "";
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като текстов блок.
     *
     * @param sql Заявка от тип SELECT, която да се изпълни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или празен стринг, ако възникне грешка по време на изпълнение на SQL заявката
     *     или тя не върне резултат.
     */
    public String fetchClob(StringBuilder sql) {
        return fetchClob(sql.toString());
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като реално число.
     *
     * @param sql SQL заявка, която да се изпълни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или нула, ако възникне грешка по време на изпълнение на SQL заявката или тя не върне резултат.
     */
    public double fetchDouble(String sql) {
        ResultSet rs = null;
        try {
            rs = this.select(sql);
            if (rs != null && rs.next()) {
                return rs.getDouble(1);
            }
        }
        catch (SQLException ex) {
            Debug.traceSQL(ex, sql);
        }
        finally {
            RELEASE(rs);
        }
        return 0f;
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като реално число.
     *
     * @param sql SQL заявка, която да се изпълни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или нула, ако възникне грешка по време на изпълнение на SQL заявката или тя не върне резултат.
     */
    public double fetchDouble(StringBuilder sql) {
        return fetchDouble(sql.toString());
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като реално число.
     *
     * @param sql SQL заявка, която да се изпълни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или нула, ако възникне грешка по време на изпълнение на SQL заявката или тя не върне резултат.
     */
    public float fetchFloat(String sql) {
        ResultSet rs = null;
        try {
            rs = this.select(sql);
            if (rs != null && rs.next()) {
                return rs.getFloat(1);
            }
        }
        catch (SQLException ex) {
            Debug.traceSQL(ex, sql);
        }
        finally {
            RELEASE(rs);
        }
        return 0f;
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като реално число.
     *
     * @param sql SQL заявка, която да се изпълни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или нула, ако възникне грешка по време на изпълнение на SQL заявката или тя не върне резултат.
     */
    public float fetchFloat(StringBuilder sql) {
        return fetchFloat(sql.toString());
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като цяло число.
     *
     * @param sql SQL заявка, която да се изпълни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или нула, ако възникне грешка по време на изпълнение на SQL заявката или тя не върне резултат.
     */
    public int fetchInt(String sql) {
        ResultSet rs = null;
        try {
            rs = this.select(sql);
            if (rs != null && rs.next()) {
                return rs.getInt(1);
            }
        }
        catch (SQLException ex) {
            Debug.traceSQL(ex, sql);
        }
        finally {
            RELEASE(rs);
        }
        return 0;
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като цяло число.
     *
     * @param sql SQL заявка, която да се изпълни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или нула, ако възникне грешка по време на изпълнение на SQL заявката или тя не върне резултат.
     */
    public int fetchInt(StringBuilder sql) {
        return fetchInt(sql.toString());
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като цяло число.
     *
     * @param sql SQL заявка, която да се изпълни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или нула, ако възникне грешка по време на изпълнение на SQL заявката или тя не върне резултат.
     */
    public long fetchLong(String sql) {
        ResultSet rs = null;
        try {
            rs = this.select(sql);
            if (rs != null && rs.first()) {
                return rs.getLong(1);
            }
        }
        catch (SQLException ex) {
            Debug.traceSQL(ex, sql);
        }
        finally {
            RELEASE(rs);
        }
        return 0L;
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като цяло число.
     *
     * @param sql SQL заявка, която да се изпълни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или нула, ако възникне грешка по време на изпълнение на SQL заявката или тя не върне резултат.
     */
    public long fetchLong(StringBuilder sql) {
        return fetchLong(sql.toString());
    }

    /**
     * Генерира масив със стойносите от първия ред на резултата от изпълнението на зададената SQL заявка.
     *
     * @param sql Заявка от тип SELECT, която да се изпълни.
     * @return Масив със стойностите от текущия ред на резулатата.
     */
    public HashMap<String, String> fetchRow(String sql) {
        ResultSet rs = null;
        try {
            rs = this.select(sql);
            if (rs != null && rs.first()) {
                return readResultSet(rs);
            }
        }
        catch (SQLException ex) {
            Debug.traceSQL(ex, sql);
        }
        finally {
            RELEASE(rs);
        }
        return null;
    }

    /**
     * Генерира масив със стойносите от първия ред на резултата от изпълнението на зададената SQL заявка.
     *
     * @param sql Заявка от тип SELECT, която да се изпълни.
     * @return Масив със стойностите от текущия ред на резулатата.
     */
    public HashMap<String, String> fetchRow(StringBuilder sql) {
        return fetchRow(sql.toString());
    }

    /**
     * Генерира масив със стойносите от първия ред на резултата от изпълнението на зададената SQL заявка.
     *
     * @param sql Заявка от тип SELECT, която да се изпълни.
     * @return Масив със стойностите от текущия ред на резулатата.
     */
    public SmartMap fetchMap(String sql) {
        return new SmartMap(fetchRow(sql));
    }

    /**
     * Генерира масив със стойносите от първия ред на резултата от изпълнението на зададената SQL заявка.
     *
     * @param sql Заявка от тип SELECT, която да се изпълни.
     * @return Масив със стойностите от текущия ред на резулатата.
     */
    public SmartMap fetchMap(StringBuilder sql) {
        return fetchMap(sql.toString());
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като стринг.
     *
     * @param sql SQL заявка към базата данни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или празен стринг, ако възникне грешка по време на изпълнение на SQL заявката или тя не върне резултат.
     */
    public String fetchString(String sql) {
        ResultSet rs = null;
        try {
            rs = this.select(sql);
            if (rs != null && rs.next()) {
                return rs.getString(1);
            }
        }
        catch (SQLException ex) {
            Debug.traceSQL(ex, sql);
        }
        finally {
            RELEASE(rs);
        }
        return "";
    }

    /**
     * Връща стойността на първата колона от първия ред на резултата от зададената SQL заявка като стринг.
     *
     * @param sql SQL заявка към базата данни.
     * @return Стойността на първата колона от първия ред на резултата от зададената SQL заявка
     *     или празен стринг, ако възникне грешка по време на изпълнение на SQL заявката или тя не върне резултат.
     */
    public String fetchString(StringBuilder sql) {
        return fetchString(sql.toString());
    }

    /**
     * Проверява дали зададената таблица съществува в базата данни.
     *
     * @param table_name Име на таблицата.
     * @return Стойност true, ако таблица със зададеното име съществува в базата данни.
     */
    public boolean tableExists(String table_name) {
        return table_name != null && exists(new StringBuilder()
                .append("select count(*) from ALL_TABLES where TABLE_NAME='")
                .append(table_name).append("'"));
    }

    /**
     * Генерира масив със стойностите от текущия ред на зададеното множество данни.
     *
     * @param rs Множество данни, от което да се вземат данните.
     * @return Масив със стойностите от текущия ред на резулатата.
     * @throws SQLException Ако възникне грешка по време на четете на стойностите от текущия ред на резултата.
     */
    private HashMap<String, String> readResultSet(ResultSet rs) throws SQLException {
        HashMap<String, String> res = new HashMap<String, String>();
        try {
            for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                if (rs.getMetaData().getColumnType(i) == java.sql.Types.TIMESTAMP) {
                    try {
                        res.put(rs.getMetaData().getColumnLabel(i), rs.getString(i));
                    }
                    catch (SQLException ex) {
                        res.put(rs.getMetaData().getColumnLabel(i), "0000-00-00 00:00:00");
                    }
                } else {
                    res.put(rs.getMetaData().getColumnLabel(i), rs.getString(i) != null ? rs.getString(i).trim() : "");
                }
            }
        } catch (SQLException ex) {
            throw new SQLException(ex.getMessage());
        }
        return res;
    }

    /**
     * Записва зададен параметър в зададена SQL заявка, ако е изпълнено зададено условие.
     *
     * @param stmt      SQL заявка, на която да се зададе параметъра.
     * @param index     Индекс на параметъра.
     * @param value     Стойност на параметъра.
     * @param condition Условие, което се проверява.
     * @throws SQLException Възниква, ако възникне грешка по време на задаването.
     */
    public void setDouble(PreparedStatement stmt, int index, double value, boolean condition) throws SQLException {
        if (condition)
            stmt.setDouble(index, value);
        else
            stmt.setNull(index, Types.NUMERIC);
    }

    /**
     * Записва зададен параметър в зададена SQL заявка, ако стойността е по-голяма от нула.
     *
     * @param stmt      SQL заявка, на която да се зададе параметъра.
     * @param index     Индекс на параметъра.
     * @param value     Стойност на параметъра.
     * @throws SQLException Възниква, ако възникне грешка по време на задаването.
     */
    public void setDouble(PreparedStatement stmt, int index, double value) throws SQLException {
        setDouble(stmt, index, value, value > 0f);
    }

    /**
     * Записва зададен параметър в зададена SQL заявка, ако е изпълнено зададено условие.
     *
     * @param stmt      SQL заявка, на която да се зададе параметъра.
     * @param index     Индекс на параметъра.
     * @param value     Стойност на параметъра.
     * @param condition Условие, което се проверява.
     * @throws SQLException Възниква, ако възникне грешка по време на задаването.
     */
    public void setFloat(PreparedStatement stmt, int index, float value, boolean condition) throws SQLException {
        setDouble(stmt, index, value, condition);
    }

    /**
     * Записва зададен параметър в зададена SQL заявка, ако стойността е по-голяма от нула.
     *
     * @param stmt      SQL заявка, на която да се зададе параметъра.
     * @param index     Индекс на параметъра.
     * @param value     Стойност на параметъра.
     * @throws SQLException Възниква, ако възникне грешка по време на задаването.
     */
    public void setFloat(PreparedStatement stmt, int index, float value) throws SQLException {
        setDouble(stmt, index, value, value > 0f);
    }

    /**
     * Записва зададен параметър в зададена SQL заявка, ако е изпълнено зададено условие.
     *
     * @param stmt      SQL заявка, на която да се зададе параметъра.
     * @param index     Индекс на параметъра.
     * @param value     Стойност на параметъра.
     * @param condition Условие, което се проверява.
     * @throws SQLException Възниква, ако възникне грешка по време на задаването.
     */
    public void setInt(PreparedStatement stmt, int index, int value, boolean condition) throws SQLException {
        if (condition)
            stmt.setInt(index, value);
        else
            stmt.setNull(index, Types.NUMERIC);
    }

    /**
     * Записва зададен параметър в зададена SQL заявка, ако стойността е по-голяма от нула.
     *
     * @param stmt  SQL заявка, на която да се зададе параметъра.
     * @param index Индекс на параметъра.
     * @param value Стойност на параметъра.
     * @throws SQLException Възниква, ако възникне грешка по време на задаването.
     */
    public void setInt(PreparedStatement stmt, int index, int value) throws SQLException {
        setInt(stmt, index, value, value > 0);
    }

    /**
     * Записва зададен параметър в зададена SQL заявка, ако е изпълнено зададено условие.
     *
     * @param stmt      SQL заявка, на която да се зададе параметъра.
     * @param index     Индекс на параметъра.
     * @param value     Стойност на параметъра.
     * @param condition Условие, което се проверява.
     * @throws SQLException Възниква, ако възникне грешка по време на задаването.
     */
    public void setLong(PreparedStatement stmt, int index, long value, boolean condition) throws SQLException {
        if (condition)
            stmt.setLong(index, value);
        else
            stmt.setNull(index, Types.NUMERIC);
    }

    /**
     * Записва зададен параметър в зададена SQL заявка, ако стойността е по-голяма от нула.
     *
     * @param stmt  SQL заявка, на която да се зададе параметъра.
     * @param index Индекс на параметъра.
     * @param value Стойност на параметъра.
     * @throws SQLException Възниква, ако възникне грешка по време на задаването.
     */
    public void setLong(PreparedStatement stmt, int index, long value) throws SQLException {
        setLong(stmt, index, value, value > 0);
    }

    /**
     * Записва зададен параметър в зададена SQL заявка, ако е изпълнено зададено условие.
     *
     * @param stmt      SQL заявка, на която да се зададе параметъра.
     * @param index     Индекс на параметъра.
     * @param value     Стойност на параметъра.
     * @param condition Условие, което се проверява.
     * @throws SQLException Възниква, ако възникне грешка по време на задаването.
     */
    public void setString(PreparedStatement stmt, int index, String value, boolean condition) throws SQLException {
        if (condition)
            stmt.setString(index, Tools.fix(value));
        else
            stmt.setNull(index, Types.VARCHAR);
    }

    /**
     * Записва зададен параметър в зададена SQL заявка, ако стойността не е празен стринг.
     *
     * @param stmt  SQL заявка, на която да се зададе параметъра.
     * @param index Индекс на параметъра.
     * @param value Стойност на параметъра.
     * @throws SQLException Възниква, ако възникне грешка по време на задаването.
     */
    public void setString(PreparedStatement stmt, int index, String value) throws SQLException {
        setString(stmt, index, value, !Tools.emptyString(value));
    }

    /**
     * Отпечатва зададеното съобщение за debug, ако е разрешено.
     *
     * @param message Съобщение, което да се отпечата.
     */
    private void debugLog(String message) {
        if (debug)
            Debug.log(message);
    }

    /**
     * Преобразува зададения стринг от UTF-8 в кодирането за базата данни.
     *
     * @param sql Стринг, който да се преобразува.
     * @return Преобразуваният стринг.
     */
    private String prepare(String sql) {
        return this.encoding == null ? sql : this.encoding.convert(sql);
    }

    /**
     * Освобождава заетите от зададената заявка ресурси.
     *
     * @param rs Резултат от изпълнението на заявката.
     */
    public static void RELEASE(ResultSet rs) {
        Statement stmt = null;
        if (rs != null) {
            try {
                stmt = rs.getStatement();
                rs.close();
            }
            catch (SQLException ex) {
                // do nothing
            }
        }
        RELEASE(stmt);
    }

    /**
     * Освобождава заетите от зададената заявка ресурси.
     *
     * @param stmt Заявка, която да се освободи.
     */
    public static void RELEASE(Statement stmt) {
        if (stmt != null) {
            try {
                stmt.close();
            }
            catch (SQLException ex) {
                // do nothing
            }
        }
    }

    /**
     * Прекъсва връзката с базата данни за зададения клас.
     *
     * @param connection Клас за връзка с базата данни.
     */
    public static void RELEASE(PostgreSQL connection) {
        if (connection != null) {
            connection.disconnect();
        }
    }

}
