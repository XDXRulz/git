package bg.infologica.project.dao;

import bg.infologica.project.core.Database;
import bg.infologica.project.core.SQL;
import bg.infologica.project.orm.OrderItemsOrm;
import bg.infologica.project.orm.OrderOrm;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Nikola on 14-2-5.
 */
public class OrderDao {
    public static OrderOrm Load(int orderid,boolean getItems)
    {
        Database db = null;
        ResultSet rs = null;
        OrderOrm order = null;
        try{
            db = new Database();
            rs = db.select(SQL.LOAD_ORDER(orderid));
            if(rs != null && rs.next())
                order = new OrderOrm(getItems?OrderItemsDao.LoadAll(rs.getInt("order_id")):null,rs.getInt("status_code"),
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
    public static List<OrderOrm> LoadAll(boolean flag)
    {
        Database db = null;
        ResultSet rs = null;
        List<OrderOrm> orders = new ArrayList<>();
        try{
            db = new Database();
            if(flag) rs = db.select(SQL.LOAD_ORDERS);
            else rs = db.select(SQL.LOAD_ORDERS_BARTENDER);

            while (rs != null && rs.next()) {
                orders.add(new OrderOrm(OrderItemsDao.LoadAll(rs.getInt("order_id")),rs.getInt("status_code"),
                        rs.getInt("order_id"), rs.getString("w_names"),rs.getInt("w_id"),rs.getString("b_names"),
                        rs.getInt("b_id"),rs.getTimestamp("last_update")));
            }
        }
        catch (Exception e)
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
    public static List<OrderOrm> LoadAll()
    {
        return LoadAll(true);
    }
    public static boolean Save(OrderOrm order)
    {
        Database db = null;
        PreparedStatement stmt = null;
        try{
            db = new Database();
            if(order.getOrderId()>0)
            {
                stmt = db.prepareStatement(SQL.UPDATE_ORDER);
                if( order.getBartenderId()>0)
                    stmt.setInt(1, order.getBartenderId());
                else
                    stmt.setNull(1, Types.INTEGER);
                stmt.setInt(2, order.getStatusCode());
                if( order.getWaitressId()>0)
                    stmt.setInt(3, order.getWaitressId());
                else
                    stmt.setNull(3, Types.INTEGER);
                stmt.setInt(4, order.getOrderId());

                stmt.execute();
            }
            else
            {
                int orderId = db.getUnique("orders","order_id");
                stmt = db.prepareStatement(SQL.ADD_ORDER);
                stmt.setInt(1,orderId);
                stmt.setInt(2, order.getWaitressId());
                stmt.setInt(3, order.getStatusCode());
                stmt.execute();
                for(OrderItemsOrm item:order.getItemsList()){
                    OrderItemsDao.Save(item,orderId);
                }
            }
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
    public static void Delete(int orderId)
    {
        Database db = null;
        try{
            db = new Database();
            db.execute(SQL.DELETE_ORDER(orderId));
        }
        finally {
            Database.RELEASE(db);
        }
    }
    public static boolean CheckForNew(Timestamp timestamp)
    {
        Database db = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try{
            db = new Database();
            stmt = db.prepareStatement(SQL.CHECK_FOR_NEW_ORDERS);
            stmt.setTimestamp(1,timestamp);
            rs = stmt.executeQuery();
            return rs != null && rs.next() && rs.getInt(1) > 0;
        }
        catch (SQLException e){
            e.printStackTrace();
        }
        finally {
            Database.RELEASE(rs);
            Database.RELEASE(stmt);
            Database.RELEASE(db);
        }
        return false;
    }
}
