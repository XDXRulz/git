package bg.infologica.water.dao;

import bg.infologica.water.core.Database;
import bg.infologica.water.core.SQL;
import bg.infologica.water.orm.ItemType;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Admin on 14-2-5.
 */
public class ItemTypeDao {

        public static void Delete(int type_id)
        {
            Database db = null;
            try{
                db = new Database();
                db.execute(SQL.DELETE_ITEMTYPES(type_id));
            }
            finally {
                Database.RELEASE(db);
            }
        }
        public static ItemType Load(int type_id)
        {
            Database db = null;
            ItemType itemType = null;
            try{
                db = new Database();
                itemType = new ItemType(type_id,db.fetchString(SQL.LOAD_ITEMTYPES(type_id)));
            }
            finally {
                Database.RELEASE(db);
            }
            return itemType;
        }
        public static boolean Save(ItemType itemTypetype)
        {
            Database db = null;
            PreparedStatement stmt = null;
            try{
                db = new Database();
                if(itemTypetype.getTypeId()!=0)
                {
                    stmt = db.prepareStatement(SQL.UPDATE_ITEMTYPES);
                    stmt.setString(1,itemTypetype.getTypeName());
                    stmt.setInt(2,itemTypetype.getCategory().getCategoryId());
                    stmt.setInt(3,itemTypetype.getTypeId());
                }
                else
                {
                    stmt = db.prepareStatement(SQL.INSERT_ITEMTYPES);
                    stmt.setString(1,itemTypetype.getTypeName());
                    stmt.setInt(2,itemTypetype.getCategory().getCategoryId());
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
        public static List<ItemType> LoadAll()
        {
            Database db = null;
            ResultSet rs = null;
            List<ItemType> itemTypes = new ArrayList<>();
            try{
                db = new Database();
                rs = db.select(SQL.LOAD_ITEMTYPES);
                while (rs != null && rs.next()) {
                    itemTypes.add(new ItemType(rs.getInt("type_id"), rs.getString("type_name")));
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
            return itemTypes;
        }


    }


