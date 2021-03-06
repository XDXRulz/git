package bg.infologica.project.dao;

import bg.infologica.project.core.Database;
import bg.infologica.project.core.SQL;
import bg.infologica.project.orm.OrderItemsOrm;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by XDX on 2/5/14.
 */
public class OrderItemsDao {
    public static OrderItemsOrm Load(int itemId)
    {
        Database db = null;
        ResultSet rs = null;
        OrderItemsOrm order = null;
        try{
            db = new Database();
            rs = db.select(SQL.LOAD_ORDER_ITEM(itemId));
            if(rs != null && rs.next())
                order = new OrderItemsOrm(rs.getInt("order_id"),rs.getInt("order_item_id"),rs.getFloat("quantity"),rs.getString("remark"),
                        rs.getTimestamp("order_item_timestamp"),ItemDao.Load(rs.getInt("item_id")));
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

    public static List<OrderItemsOrm> LoadAll(int orderId)
    {
        Database db = null;
        ResultSet rs = null;
        List<OrderItemsOrm> orders = new ArrayList<>();
        try{
            db = new Database();
            rs = db.select(SQL.LOAD_ORDER_ITEMS(orderId));
            while (rs != null && rs.next()) {
                orders.add(new OrderItemsOrm(rs.getInt("order_id"),rs.getInt("order_item_id"),rs.getFloat("quantity"),rs.getString("remark"),
                        rs.getTimestamp("order_item_timestamp"),ItemDao.Load(rs.getInt("item_id"))));
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
    public static boolean Save(OrderItemsOrm item,int orderId)
    {
        Database db = null;
        PreparedStatement stmt = null;
        try{
            db = new Database();
            if(item.getOrderItemId()!=0)
            {
                stmt = db.prepareStatement(SQL.UPDATE_ORDER_ITEM);
                stmt.setInt(1,item.getItem().getItemId());
                stmt.setDouble(2,item.getQuantity());
                stmt.setString(3,item.getRemark());
                stmt.setInt(4,item.getOrderItemId());
            }
            else
            {
                stmt = db.prepareStatement(SQL.ADD_ORDER_ITEM);
                stmt.setInt(1,orderId);
                stmt.setInt(2,item.getItem().getItemId());
                stmt.setDouble(3,item.getQuantity());
                stmt.setString(4,item.getRemark());
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
    public static boolean CheckForNew(Timestamp timestamp)
    {
        Database db = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try{
            db = new Database();
            stmt = db.prepareStatement(SQL.CHECK_FOR_NEW_ITEMS);
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
