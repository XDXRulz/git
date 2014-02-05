package bg.infologica.water.dao;

import bg.infologica.water.core.Database;
import bg.infologica.water.core.SQL;
import bg.infologica.water.orm.Category;
import bg.infologica.water.orm.OrderItemsOrm;
import bg.infologica.water.orm.OrderOrm;

import java.sql.PreparedStatement;
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
                        rs.getInt("order_id"), rs.getString("w_names"),rs.getInt("w_id"),rs.getString("b_names"),
                        rs.getInt("b_id"),rs.getTimestamp("last_update"));
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
                            rs.getInt("order_id"), rs.getString("w_names"),rs.getInt("w_id"),rs.getString("b_names"),
                            rs.getInt("b_id"),rs.getTimestamp("last_update")));
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
    public static boolean Save(OrderOrm order)
    {
        Database db = null;
        PreparedStatement stmt = null;
        try{
            db = new Database();
            if(order.getOrderId()!=0)
            {
                stmt = db.prepareStatement(SQL.UPDATE_ORDER);
                stmt.setInt(1, order.getBartenderId());
                stmt.setInt(2, order.getStatusCode());
                stmt.setInt(3, order.getOrderId());
            }
            else
            {
                int orderId = db.getUnique("orders","order_id");
                stmt = db.prepareStatement(SQL.ADD_ORDER);
                stmt.setInt(1,orderId);
                stmt.setInt(2, order.getWaitressId());
                stmt.setInt(3, order.getStatusCode());
                for(OrderItemsOrm item:order.getItemsList()){
                    OrderItemsDao.Save(item,orderId);
                }
            }
            stmt.execute();
            return true;
        }
        catch (SQLException|NullPointerException e)
        {
            e.printStackTrace();
            return false;
        }
        finally {
            Database.RELEASE(stmt);
            Database.RELEASE(db);
        }
    }
    public static void Delete(int orderItemId)
    {
        Database db = null;
        try{
            db = new Database();
            db.execute(SQL.DELETE_ORDER_ITEM(orderItemId));
        }
        finally {
            Database.RELEASE(db);
        }
    }
}
