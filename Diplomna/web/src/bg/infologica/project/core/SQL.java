package bg.infologica.project.core;

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
    public static String LOAD_ITEMTYPES = "SELECT it.*,category_name FROM item_types it LEFT JOIN categories c ON c.category_id = it.category_id";
    public static String DELETE_ITEMTYPES(int id) {return "Delete FROM item_types WHERE type_id = "+id ;}
    public static String LOAD_ITEMTYPE(int id) {return "SELECT type_name FROM item_types WHERE type_id = "+id ;}
    public static String LOAD_ITEMTYPES(int id) {return "SELECT type_id, type_name FROM item_types WHERE category_id ="+id ;}
    public static String INSERT_ITEMTYPES = "INSERT INTO item_types(type_name,category_id) VALUES (?,?)\n";
    public static String UPDATE_ITEMTYPES = "UPDATE item_types SET type_name=?,category_id=? WHERE type_id=?";
    public static String LOAD_ITEMS = "SELECT i.*,it.type_name, c.* FROM items i LEFT JOIN item_types it ON it.type_id = i.type_id LEFT JOIN categories c ON c.category_id = it.category_id";
    public static String LOAD_ITEMS (int type_id){return "SELECT item_id,item_name FROM items WHERE type_id = "+type_id;}
    public static String DELETE_ITEMS(int id) {return "Delete FROM items WHERE item_id = "+id ;}
    public static String LOAD_ITEM(int id) {return "SELECT i.*,it.type_name, c.*  FROM items i LEFT JOIN item_types it ON it.type_id = i.type_id LEFT JOIN categories c ON c.category_id = it.category_id WHERE item_id = "+id ;}
    public static String INSERT_ITEMS = "INSERT INTO items(item_name,price,type_id) VALUES (?,?,?)\n";
    public static String UPDATE_ITEMS = "UPDATE items SET item_name=?,price=?,type_id=? WHERE item_id=?";
    public static String LOAD_ORDERS = "SELECT o.order_id, w.names w_names,w.user_id w_id,b.user_id b_id, b.names b_names,status_code,last_update\n" +
            "FROM orders o "+
            "  LEFT JOIN users w ON w.user_id = o.waiter_id\n" +
            "  LEFT JOIN users b ON b.user_id = o.bartender_id";
    public static String LOAD_ORDERS_BARTENDER =
            "SELECT o.order_id, w.names w_names,w.user_id w_id,b.user_id b_id, b.names b_names,status_code,last_update\n" +
                    "FROM orders o "+
                    "  LEFT JOIN users w ON w.user_id = o.waiter_id\n" +
                    "  LEFT JOIN users b ON b.user_id = o.bartender_id WHERE status_code IN (1,2,99)";

    public static String LOAD_ORDER(int id){
        return "SELECT o.order_id, w.names w_names, b.names b_names,w.user_id w_id,b.user_id b_id,status_code,last_update\n" +
                "FROM orders o "+
                "  LEFT JOIN users w ON w.user_id = o.waiter_id\n" +
                "  LEFT JOIN users b ON b.user_id = o.bartender_id WHERE order_id = "+id;
    }
    public static String ADD_ORDER = "INSERT INTO orders(\n" +
            "             order_id, waiter_id, status_code, last_update)\n" +
            "    VALUES (?, ?, ?, now())\n";
    public static String UPDATE_ORDER = "UPDATE orders\n" +
            "   SET  bartender_id=?, status_code=?,  waiter_id=?,last_update=now()\n" +
            " WHERE order_id=?\n";
    public static String LOAD_ORDER_ITEMS(int id) {return  "SELECT * FROM order_items WHERE order_id ="+id;}
    public static String LOAD_ORDER_ITEM(int id) {return  "SELECT * FROM order_items WHERE order_item_id ="+id;}
    public static String DELETE_ORDER_ITEM(int id) {return  "DELETE FROM order_items WHERE order_item_id ="+id;}
    public static String DELETE_ORDER(int id) {return  "DELETE FROM orders WHERE order_id="+id;}
    public static String ADD_ORDER_ITEM = "INSERT INTO order_items(\n" +
            "             order_id, item_id, order_item_timestamp, quantity, \n" +
            "            remark)\n" +
            "    VALUES ( ?, ?, now() , ?, \n" +
            "            ?)\n";
    public static String UPDATE_ORDER_ITEM = "UPDATE order_items\n" +
            "             SET item_id = ?, quantity=?, order_item_timestamp=now(),remark=? WHERE order_item_id =?\n";
    public static String CHECK_FOR_NEW_ORDERS= "SELECT COUNT(*) FROM orders WHERE last_update>=? ";
    public static String CHECK_FOR_NEW_ITEMS= "SELECT COUNT(*) FROM order_items WHERE order_item_timestamp>=? ";
    private SQL() {}
}
