package bg.infologica.water.core;

import bg.infologica.common.Tools;

/**
 * Заявки към базата данни.
 *
 * @author Кальо Катеров
 * @version 2013-06-20 Първа версия.
 */
public final class SQL {
// todo add sql queries here

    public static String USER_ROLES = "SELECT * FROM user_roles";
    public static String LOAD_CATEGORIES = "SELECT * FROM categories";
    public static String DELETE_CATEGORY(int id) {return "Delete FROM categories WHERE category_id = "+id ;}
    public static String LOAD_CATEGORY(int id) {return "SELECT category_name FROM categories WHERE category_id = "+id ;}
    public static String INSERT_CATEGORY = "INSERT INTO categories(category_name) VALUES (?)\n";
    public static String UPDATE_CATEGORY = "UPDATE categories SET category_name=? WHERE category_id=?";
    private SQL() {}
}
