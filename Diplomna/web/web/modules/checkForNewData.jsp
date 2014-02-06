<%@ page import="bg.infologica.project.dao.OrderDao" %><%@ page import="bg.infologica.common.SmartMap" %><%@ page import="java.sql.Timestamp" %><%@ page import="bg.infologica.project.dao.OrderItemsDao" %><%@ page contentType="text/json;charset=UTF-8" language="java" %><%
    SmartMap get = new SmartMap(request);
    Timestamp time = new Timestamp(get.getLong("time"));
    boolean isNew =  OrderDao.CheckForNew(time)|| OrderItemsDao.CheckForNew(time);
%><%="{\"flag\":\""+isNew+"\"}"%>

