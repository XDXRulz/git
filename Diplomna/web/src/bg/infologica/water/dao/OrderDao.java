package bg.infologica.water.dao;

import bg.infologica.water.core.Database;
import bg.infologica.water.core.SQL;
import bg.infologica.water.orm.Category;
import bg.infologica.water.orm.OrderOrm;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Nikola on 14-2-5.
 */
public class OrderDao {
    public static OrderOrm Load(int orderid)
        {
            Database db = null;
            ResultSet rs = null;
            OrderOrm order = null;
            try{
                db = new Database();
                rs = db.select(SQL.LOAD_ORDER(orderid));
                if(rs != null && rs.next())
                order = new OrderOrm(OrderItemsDao.LoadAll(rs.getInt("order_id")),rs.getInt("status_code"),
                        rs.getInt("order_id"), rs.getString("w_names"),rs.getString("b_names"),
                        rs.getTimestamp("last_update"));
            }catch (Exception e){
                e.printStackTrace();
                return null;
            }
            finally {
                Database.RELEASE(rs);
                Database.RELEASE(db);
            }
            return order;
        }

        public static List<OrderOrm> LoadAll()
        {
            Database db = null;
            ResultSet rs = null;
            List<OrderOrm> orders = new ArrayList<>();
            try{
                db = new Database();
                rs = db.select(SQL.LOAD_ORDERS);
                while (rs != null && rs.next()) {
                    orders.add(new OrderOrm(OrderItemsDao.LoadAll(rs.getInt("order_id")),rs.getInt("status_code"),
                            rs.getInt("order_id"), rs.getString("w_names"),rs.getString("b_names"),
                            rs.getTimestamp("last_update")));
                }
            }
            catch (SQLException |NullPointerException e)
            {
                e.printStackTrace();
                return null;
            }
            finally {
                Database.RELEASE(rs);
                Database.RELEASE(db);
            }
            return orders;
        }
}
