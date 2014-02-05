package bg.infologica.water.dao;

import bg.infologica.water.core.Database;
import bg.infologica.water.core.SQL;
import bg.infologica.water.orm.OrderItemsOrm;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
    public static boolean Save(OrderItemsOrm item)
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
                stmt.setInt(1,item.getOrderId());
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

}
