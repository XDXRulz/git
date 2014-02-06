<%@ page import="bg.infologica.common.SmartMap" %><%@ page import="bg.infologica.common.web.Html" %><%@ page import="bg.infologica.project.core.Database" %><%@ page import="java.sql.ResultSet" %><%@ page import="bg.infologica.project.core.SQL" %><%@ page contentType="text/html;charset=UTF-8" language="java" %><%
    SmartMap get = new SmartMap(request);
    int typeId = get.getInt("type_id");
    int itemId = get.getInt("item_id");
    ResultSet items = null;
    Database db = null;
    try {
        db = new Database();
        items = db.select(SQL.LOAD_ITEMS(typeId));
%><%= Html.select("item_id",itemId, items) %><%} catch (Exception e){e.printStackTrace();}
finally {
    Database.RELEASE(items);
    Database.RELEASE(db);
}%>
