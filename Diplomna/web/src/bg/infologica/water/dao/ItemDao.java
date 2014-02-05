package bg.infologica.water.dao;

import bg.infologica.water.core.Database;
import bg.infologica.water.core.SQL;
import bg.infologica.water.orm.Category;
import bg.infologica.water.orm.Item;
import bg.infologica.water.orm.ItemType;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Admin on 14-2-5.
 */
public class ItemDao {

    public static void Delete(int itemId)
    {
        Database db = null;
        try{
            db = new Database();
            db.execute(SQL.DELETE_ITEMS(itemId));
        }
        finally {
            Database.RELEASE(db);
        }
    }
    public static Item Load(int item_id)
    {
        Database db = null;
        Item item = null;
        try{
            db = new Database();
            item = new Item(item_id,db.fetchString(SQL.LOAD_ITEM(item_id)));
        }
        finally {
            Database.RELEASE(db);
        }
        return item;
    }
    public static boolean Save(Item item)
    {
        Database db = null;
        PreparedStatement stmt = null;
        try{
            db = new Database();
            if(item.getItemId()!=0)
            {
                stmt = db.prepareStatement(SQL.UPDATE_ITEMS);
                stmt.setString(1,item.getItemName());
                stmt.setDouble(2,item.getPrice());
                stmt.setInt(3, item.getItemType().getTypeId());
                stmt.setInt(4,item.getItemId());
            }
            else
            {
                stmt = db.prepareStatement(SQL.INSERT_ITEMS);
                stmt.setString(1,item.getItemName());
                stmt.setDouble(2, item.getPrice());
                stmt.setInt(3,item.getItemType().getTypeId());
            }
            stmt.execute();
            return true;
        }
        catch (SQLException |NullPointerException e)
        {
            e.printStackTrace();
            return false;
        }
        finally {
            Database.RELEASE(stmt);
            Database.RELEASE(db);
        }
    }
    public static List<Item> LoadAll()
    {
        Database db = null;
        ResultSet rs = null;
        List<Item> items = new ArrayList<>();
        try{
            db = new Database();
            rs = db.select(SQL.LOAD_ITEMS);
            while (rs != null && rs.next()) {
                items.add(new Item(rs.getInt("item_id"), rs.getString("item_name"),rs.getDouble("price"),
                        new ItemType(rs.getInt("type_id"),rs.getString("type_name"),
                                new Category(rs.getInt("category_id"),rs.getString("category_name")))));
            }
        }
        catch (SQLException|NullPointerException e)
        {
            e.printStackTrace();
            return null;
        }
        finally {
            Database.RELEASE(rs);
            Database.RELEASE(db);
        }
        return items;
    }


}


