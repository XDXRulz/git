package bg.infologica.project.orm;

/**
 * Created by Admin on 14-2-5.
 */

import bg.infologica.common.Debug;
import bg.infologica.common.SmartMap;
import bg.infologica.project.core.Database;
import bg.infologica.project.core.SQL;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Item {

    /**
     * Created by Admin on 14-2-5.
     */



    private int itemId;
    private String itemName;
    private double price;
    private ItemType itemType;



    public Item() {
    }
    public Item(SmartMap get) {
        setItemId(get.getInt("item_id"));
        setPrice(get.getDouble("price"));
        setItemType(new ItemType(get.getInt("type_id")));

    }
    public Item(int itemId, String itemName) {
        this.itemId = itemId;
        this.itemName = itemName;
        //this.category=category;

    }
    public Item(int itemId, String itemName, double price, ItemType itemType) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.price=price;
        this.itemType=itemType;

    }
    public Item(Database db, int item_id) {
        ResultSet rs = null;
        try {
            rs = db.select(SQL.LOAD_ITEM(item_id) );
            if (rs != null && rs.next()) {
                setItemId(rs.getInt("item_id"));
                setItemName(rs.getString("item_name"));
                setPrice(rs.getDouble("price"));
                setItemType(new ItemType(rs.getInt("type_id"),rs.getString("type_name"),
                        new Category(rs.getInt("category_id"),rs.getString("category_name"))));
            }
        }
        catch (SQLException e) {
            Debug.trace(e, "UserOrm()");
        }
        finally {
            Database.RELEASE(rs);
        }
    }
    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }


}
