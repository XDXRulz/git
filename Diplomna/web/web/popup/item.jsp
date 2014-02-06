<%--
  Created by IntelliJ IDEA.
  User: Admin
  Date: 14-2-5
  Time: 16:39
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="bg.infologica.common.SmartMap" %>
<%@ page import="bg.infologica.common.Tools" %>
<%@ page import="bg.infologica.common.web.Html" %>
<%@ page import="bg.infologica.common.web.JavaScript" %>
<%@ page import="bg.infologica.common.web.Popup" %>
<%@ page import="bg.infologica.project.core.*" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="bg.infologica.project.core.SessionMessages" %>
<%@ page import="bg.infologica.project.core.User" %>
<%@ page import="bg.infologica.project.core.BarCommons" %>
<%@ page import="bg.infologica.project.core.UserRole" %>
<%@ page import="bg.infologica.project.orm.ItemType" %>
<%@ page import="bg.infologica.project.dao.ItemTypeDao" %>
<%@ page import="bg.infologica.project.orm.Category" %>
<%@ page import="bg.infologica.project.orm.Item" %>
<%@ page import="bg.infologica.project.dao.ItemDao" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    SmartMap get;
    get = new SmartMap(request);
    // проверка правата за достъп на потребителя
    User user = User.create(session);
    boolean admin = User.valid(user) && user.hasRole(UserRole.ADMIN);
    if (!admin) {
        out.println(JavaScript.documentReload());
        return;
    }
    Item item=null;
    ResultSet categories = null;
    ResultSet types = null;
    Database db = null;
    try {
        db = new Database();
        if (get.getInt("capture") > 0) {
            item = new Item(get);

            item = new Item(db, get.getInt("id"));
        }
        categories = db.select(SQL.LOAD_CATEGORIES);

        int id = get.getInt("id");
        String action= get.getString("action");
        // Item item = null;
        if("delete".equals(action)){
            ItemDao.Delete(id);
            out.println(JavaScript.documentReload());
            return;
        }
        if("save".equals(action))
        {
            item = new Item(get.getInt("id"),get.getString("item_name"),get.getDouble("price"),new ItemType(get.getInt("type_id")));
            if (Tools.emptyString(item.getItemName())) {
                SessionMessages.error(session, "Задължително трябва да се въведе наименование.");
            }
            if (!SessionMessages.exists(session)) {
                if (ItemDao.Save(item)) {
                    SessionMessages.success(session, "Успешнно добавяне/редакция на артикули.");
                } else {
                    SessionMessages.error(session, "Грешка при запис  на артикули.");
                }
                out.println(JavaScript.documentReload());
                return;
            }
            else{SessionMessages.error(session, BarCommons.ERROR_SAVE);}
        }
        else
        {
            if("edit".equals(action))
            {
                item  = new Item(db, get.getInt("id"));
                //ItemDao.Load(id);
%>
<%= Popup.header(response, "Редакция на артикули") %>
<%}else{%><%= Popup.header(response, "Добавяне на артикули") %><%}%>
<%= SessionMessages.get(session) %>
<form method="get" action="<%= request.getRequestURI() %>">
    <%= Html.hidden("action", "save") %>
    <%= Html.hidden("id", id) %>
    <fieldset>
        <label>Наименование:</label>
        <%= Html.inputText("item_name", (item != null) ? item.getItemName() : "") %>
        <label>Цена:</label>
        <%= Html.inputFloat("price", (item != null) ? item.getPrice() : 0, 8, 2) %>
        <label>Категория артикул:</label>
        <%= Html.select("category_id", (item != null && item.getItemType() != null && item.getItemType().getCategory() != null)
                ? item.getItemType().getCategory().getCategoryId() : 0, categories) %>
        <label>Тип артикул:</label>
        <div id="types"><%= Html.select("type_id","short") %></div>
        <br/>
    </fieldset>
    <%= Popup.buttonsSaveAndCancel() %>
</form>
<script type="text/javascript">
    function generateTypes(category,type)
    {
        console.log(category);
        var request = $.ajax({
            url: "../modules/itemTypes.jsp",
            type: "POST",
            data: { category_id : category,type_id:type },
            dataType: "html"
        });

        request.done(function( msg ) {
            console.log( msg );
            $( "#types" ).html( msg );
        });

        request.fail(function( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
        });
    }
    function init()
    {
        console.log('init');
        var category = $("#category_id");
        category.bind('change',function(){
          console.log('changing');
           generateTypes($("#category_id").val(),0)
        });
        generateTypes(category.val(),<%= (item != null && item.getItemType() != null )?item.getItemType().getTypeId():0%>);

    }
    setTimeout(init,500);

</script>
<%= Popup.footer() %>
<%
        }
    }
    catch (Exception e){
        e.printStackTrace();
    }
    finally {
        Database.RELEASE(categories);
        Database.RELEASE(db);
    }
%>