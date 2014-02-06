package bg.infologica.project.dao;

import bg.infologica.project.core.Database;
import bg.infologica.project.core.SQL;
import bg.infologica.project.orm.Category;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by XDX on 2/5/14.
 */
public class CategoryDao {
    public static void Delete(int categoryId)
    {
        Database db = null;
        try{
            db = new Database();
            db.execute(SQL.DELETE_CATEGORY(categoryId));
        }
        finally {
            Database.RELEASE(db);
        }
    }
    public static Category Load(int categoryId)
    {
        Database db = null;
        Category category = null;
        try{
            db = new Database();
            category = new Category(categoryId,db.fetchString(SQL.LOAD_CATEGORY(categoryId)));
        }
        finally {
            Database.RELEASE(db);
        }
        return category;
    }
    public static boolean Save(Category category)
    {
        Database db = null;
        PreparedStatement stmt = null;
        try{
            db = new Database();
            if(category.getCategoryId()!=0)
            {
                stmt = db.prepareStatement(SQL.UPDATE_CATEGORY);
                stmt.setString(1,category.getCategoryName());
                stmt.setInt(2,category.getCategoryId());
            }
            else
            {
                stmt = db.prepareStatement(SQL.INSERT_CATEGORY);
                stmt.setString(1,category.getCategoryName());
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
    public static List<Category> LoadAll()
    {
        Database db = null;
        ResultSet rs = null;
        List<Category> categories = new ArrayList<>();
        try{
            db = new Database();
            rs = db.select(SQL.LOAD_CATEGORIES);
            while (rs != null && rs.next()) {
                categories.add(new Category(rs.getInt("category_id"), rs.getString("category_name")));
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
        return categories;
    }


}
