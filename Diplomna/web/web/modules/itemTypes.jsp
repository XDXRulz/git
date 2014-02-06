<%@ page import="bg.infologica.common.SmartMap" %><%@ page import="bg.infologica.common.web.Html" %><%@ page import="bg.infologica.water.core.Database" %><%@ page import="java.sql.ResultSet" %><%@ page import="bg.infologica.water.core.SQL" %><%@ page contentType="text/html;charset=UTF-8" language="java" %><%
    SmartMap get = new SmartMap(request);
    int categoryId = get.getInt("category_id");
    int typeId = get.getInt("type_id");
    ResultSet itemTypes = null;
    Database db = null;
    try {
        db = new Database();
        itemTypes = db.select(SQL.LOAD_ITEMTYPES(categoryId));
%><%= Html.select("type_id",typeId, itemTypes) %><%} catch (Exception e){e.printStackTrace();}
finally {
    Database.RELEASE(itemTypes);
    Database.RELEASE(db);
}%>
