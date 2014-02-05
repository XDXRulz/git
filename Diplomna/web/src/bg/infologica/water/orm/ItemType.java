package bg.infologica.water.orm;

/**
 * Created by Admin on 14-2-5.
 */
import bg.infologica.common.SmartMap;
import bg.infologica.water.core.Database;
import bg.infologica.water.core.SQL;
public class ItemType {

        private int typeId;
        private String typeName;
    private Category category;

        public ItemType() {
        }
    public ItemType(SmartMap get) {
        setTypeId(get.getInt("type_id"));
        setTypeName(get.getString("type_name"));
        setCategory(new Category(get.getInt("category_id")));

    }
    public ItemType(int typeId, String typeName) {
        this.typeId = typeId;
        this.typeName = typeName;
        //this.category=category;

    }
    public ItemType(int typeId) {
        this.typeId = typeId;
      // this.typeName = typeName;
        //this.category=category;

    }
    public ItemType(int typeId, String typeName, Category category) {
            this.typeId = typeId;
            this.typeName = typeName;
            this.category=category;

        }

        public int getTypeId() {
            return typeId;
        }

        public void setTypeId(int typeId) {
            this.typeId = typeId;
        }

        public String getTypeName() {
            return typeName!=null?typeName:"";
        }

        public void setTypeName(String typeName) {
            this.typeName = typeName;
        }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
    }

