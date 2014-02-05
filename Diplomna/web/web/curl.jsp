<%@ page import="bg.infologica.common.SmartMap" %><%@ page import="bg.infologica.water.core.cUrl" %><%@ page contentType="text/html;charset=UTF-8" language="java" %><%
    try
    {
        SmartMap get;
        get = new SmartMap(request);
        String url = get.getString("url");
        System.out.println(url);
        String contentType = get.getString("contentType");
        if(get.getInt("download")==1)
        {
            response.setHeader ( "Content-Disposition", "attachement; filename=\"wfs_output.xml\"" );
        }
        if(contentType!=null && contentType.length()!=0)
            response.setContentType(contentType);

%><%=cUrl.cUrl1(url)%><%
    }
    catch (Exception e)
    {
        e.printStackTrace();
    }%>