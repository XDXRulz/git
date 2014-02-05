package bg.infologica.water.orm;

/**
 * Created by Admin on 14-2-5.
 */

        import bg.infologica.water.core.Database;
        import bg.infologica.water.core.SQL;

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
