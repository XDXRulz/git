package bg.infologica.project.orm;

/**
 * Created by XDX on 2/5/14.
 */
public class Category
{
    private int categoryId;
    private String categoryName;

    public Category() {
    }

    public Category(int categoryId, String categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
    public Category(int categoryId) {
        this.categoryId = categoryId;

    }
    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName!=null?categoryName:"";
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

}
